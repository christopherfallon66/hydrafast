import { useState } from 'react';
import { useCheckInStore } from '../../store/checkinStore';
import { useFastStore } from '../../store/fastStore';
import { computeAlertLevel } from '../../constants/alerts';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { AlertBanner } from '../common/AlertBanner';
import type { HealthCheckIn, AlertLevel } from '../../types';

const MOODS = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'bad', emoji: '😣', label: 'Bad' },
] as const;

const SEVERITIES = ['none', 'mild', 'moderate', 'severe'] as const;

export function CheckInForm() {
  const { addCheckIn, recentCheckIns } = useCheckInStore();
  const { activeFast } = useFastStore();
  const [energy, setEnergy] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [mood, setMood] = useState<HealthCheckIn['mood']>('neutral');
  const [dizziness, setDizziness] = useState<HealthCheckIn['dizziness']>('none');
  const [nausea, setNausea] = useState<HealthCheckIn['nausea']>('none');
  const [palpitations, setPalpitations] = useState(false);
  const [headache, setHeadache] = useState<HealthCheckIn['headache']>('none');
  const [cramps, setCramps] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resultAlert, setResultAlert] = useState<AlertLevel>('none');

  const handleSubmit = async () => {
    const previousCheckIn = recentCheckIns.length > 0 ? recentCheckIns[0] : null;
    const checkInData = {
      fast_session_id: activeFast?.id ?? null,
      energy,
      clarity,
      mood,
      dizziness,
      nausea,
      heart_palpitations: palpitations,
      headache,
      muscle_cramps: cramps,
      notes: notes || null,
      alert_level: 'none' as AlertLevel,
    };

    const alertLevel = computeAlertLevel(checkInData, previousCheckIn);
    checkInData.alert_level = alertLevel;
    await addCheckIn(checkInData);
    setResultAlert(alertLevel);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-4">
        {resultAlert === 'red' && (
          <div className="bg-red-50 border-2 border-danger rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🚨</div>
            <h2 className="text-xl font-bold text-danger mb-2">Please Consider Breaking Your Fast</h2>
            <p className="text-red-800 text-sm mb-4">
              Your symptoms suggest you may need to stop fasting. Your health and safety come first.
            </p>
            <div className="bg-white rounded-xl p-4 text-left mb-4">
              <p className="text-sm font-medium text-red-800 mb-2">Immediate steps:</p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Sip bone broth or water with a pinch of salt</li>
                <li>Sit or lie down in a safe place</li>
                <li>Contact your healthcare provider or emergency contact</li>
              </ul>
            </div>
            <p className="text-xs text-red-600">
              If you experience chest pain, severe swelling, or difficulty breathing, call emergency services immediately.
            </p>
          </div>
        )}
        {resultAlert === 'orange' && (
          <AlertBanner level="orange">
            <p className="font-medium mb-1">Caution: Some concerning symptoms detected</p>
            <p>Consider whether it's time to break your fast. Check the Refeeding Guide for safe instructions. If symptoms persist, consult a healthcare provider.</p>
          </AlertBanner>
        )}
        {resultAlert === 'yellow' && (
          <AlertBanner level="yellow">
            <p className="font-medium mb-1">Mild symptoms noted</p>
            <p>Make sure you're staying hydrated and supplementing electrolytes. Rest if you can. These symptoms are common but worth monitoring.</p>
          </AlertBanner>
        )}
        {resultAlert === 'none' && (
          <Card>
            <div className="text-center py-4">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-medium text-deep-ocean">Check-in recorded. You're doing well!</p>
            </div>
          </Card>
        )}
        <Button variant="secondary" onClick={() => { setSubmitted(false); setResultAlert('none'); }} className="w-full">
          Log Another Check-In
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Energy */}
      <Card>
        <label className="block text-sm font-medium text-deep-ocean mb-2">
          Energy Level: <span className="text-still-water">{energy}/10</span>
        </label>
        <input
          type="range" min="1" max="10" value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full accent-still-water"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>Exhausted</span><span>Energized</span>
        </div>
      </Card>

      {/* Clarity */}
      <Card>
        <label className="block text-sm font-medium text-deep-ocean mb-2">
          Mental Clarity: <span className="text-still-water">{clarity}/10</span>
        </label>
        <input
          type="range" min="1" max="10" value={clarity}
          onChange={(e) => setClarity(Number(e.target.value))}
          className="w-full accent-still-water"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>Foggy</span><span>Crystal clear</span>
        </div>
      </Card>

      {/* Mood */}
      <Card>
        <label className="block text-sm font-medium text-deep-ocean mb-2">Mood</label>
        <div className="flex gap-2 justify-between">
          {MOODS.map(m => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`flex flex-col items-center py-2 px-2 rounded-xl min-w-[52px] transition-colors ${
                mood === m.value ? 'bg-morning-mist ring-2 ring-still-water' : 'bg-glacier'
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[10px] text-text-secondary mt-0.5">{m.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Symptoms */}
      <Card>
        <label className="block text-sm font-medium text-deep-ocean mb-3">Symptoms</label>
        <div className="space-y-3">
          <SeverityRow label="Dizziness" value={dizziness} onChange={setDizziness} />
          <SeverityRow label="Nausea" value={nausea} onChange={setNausea} />
          <SeverityRow label="Headache" value={headache} onChange={setHeadache} />
          <ToggleRow label="Heart Palpitations" value={palpitations} onChange={setPalpitations} />
          <ToggleRow label="Muscle Cramps" value={cramps} onChange={setCramps} />
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <label className="block text-sm font-medium text-deep-ocean mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling overall?"
          className="w-full bg-glacier border border-morning-mist rounded-xl px-3 py-2 text-sm text-deep-ocean resize-none h-20"
        />
      </Card>

      <Button onClick={handleSubmit} className="w-full" size="lg">
        Submit Check-In
      </Button>

      <p className="text-xs text-text-secondary text-center">
        This is not medical advice. Consult a healthcare provider before fasting.
      </p>
    </div>
  );
}

function SeverityRow({ label, value, onChange }: { label: string; value: string; onChange: (v: any) => void }) {
  return (
    <div>
      <span className="text-sm text-deep-ocean">{label}</span>
      <div className="flex gap-1.5 mt-1">
        {SEVERITIES.map(s => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              value === s
                ? s === 'severe' ? 'bg-danger text-white' : s === 'moderate' ? 'bg-warning text-white' : s === 'mild' ? 'bg-amber-100 text-amber-800' : 'bg-still-water text-white'
                : 'bg-glacier text-text-secondary'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-deep-ocean">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          value ? 'bg-warning text-white' : 'bg-glacier text-text-secondary'
        }`}
      >
        {value ? 'Yes' : 'No'}
      </button>
    </div>
  );
}
