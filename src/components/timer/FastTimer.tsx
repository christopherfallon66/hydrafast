import { useState, useEffect } from 'react';
import { useFastStore } from '../../store/fastStore';
import { formatDuration, getElapsedSeconds } from '../../utils/conversions';
import { getCurrentPhase } from '../../constants/phases';

export function FastTimer() {
  const { activeFast } = useFastStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeFast) { setElapsed(0); return; }
    const tick = () => setElapsed(getElapsedSeconds(activeFast.start_time));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeFast]);

  if (!activeFast) return null;

  const { days, hours, minutes, seconds } = formatDuration(elapsed);
  const elapsedHours = elapsed / 3600;
  const phase = getCurrentPhase(elapsedHours);
  const targetHours = activeFast.target_duration_hours;
  const progress = targetHours ? Math.min(1, elapsedHours / targetHours) : null;

  // SVG circle progress
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = progress !== null ? circumference * (1 - progress) : circumference * 0.25;

  return (
    <div className="flex flex-col items-center">
      {/* Circular timer */}
      <div className="relative w-64 h-64 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
          {/* Background circle */}
          <circle cx="128" cy="128" r={radius} fill="none" stroke="#E0F2FE" strokeWidth="10" />
          {/* Progress arc */}
          <circle
            cx="128" cy="128" r={radius} fill="none"
            stroke="url(#timerGradient)" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0C4A6E" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer digits in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-mono text-deep-ocean font-bold tracking-tight" style={{ fontSize: days > 0 ? '28px' : '36px', textShadow: '0 1px 2px rgba(12,74,110,0.1)' }}>
            {days > 0 && <span>{days}<span className="text-lg">d </span></span>}
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          {targetHours && (
            <div className="text-white text-xs mt-1">
              of {targetHours}h goal
            </div>
          )}
        </div>
      </div>

      {/* Phase label */}
      <div className="bg-morning-mist px-4 py-2 rounded-full mb-2">
        <span className="text-sm font-medium text-still-water">{phase.name}</span>
      </div>
      <p className="text-white text-xs text-center max-w-xs px-4">{phase.description}</p>
    </div>
  );
}
