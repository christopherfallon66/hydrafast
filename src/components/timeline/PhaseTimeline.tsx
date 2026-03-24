import { FASTING_PHASES, getCurrentPhase } from '../../constants/phases';
import { Card } from '../common/Card';

interface PhaseTimelineProps {
  elapsedHours?: number;
}

export function PhaseTimeline({ elapsedHours }: PhaseTimelineProps) {
  const currentPhase = elapsedHours !== undefined ? getCurrentPhase(elapsedHours) : null;

  return (
    <div className="space-y-3">
      {FASTING_PHASES.map((phase, i) => {
        const isCurrent = currentPhase?.key === phase.key;
        const isCompleted = elapsedHours !== undefined && phase.end_hours !== null && elapsedHours >= phase.end_hours;
        const isFuture = elapsedHours !== undefined && elapsedHours < phase.onset_hours;

        return (
          <Card
            key={phase.key}
            className={`relative ${isCurrent ? 'ring-2 ring-still-water bg-morning-mist' : ''} ${isFuture ? 'opacity-50' : ''}`}
          >
            {/* Timeline connector */}
            {i < FASTING_PHASES.length - 1 && (
              <div className="absolute left-7 top-full w-0.5 h-3 bg-morning-mist z-10" />
            )}

            <div className="flex items-start gap-3">
              {/* Status indicator */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-success' : isCurrent ? 'bg-still-water' : 'bg-morning-mist'
              }`}>
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-shallow-pool/40" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-sm font-bold ${isCurrent ? 'text-still-water' : 'text-deep-ocean'}`}>
                    {phase.name}
                  </h3>
                  <span className="text-xs text-text-secondary">
                    {phase.onset_hours}h{phase.end_hours ? `–${phase.end_hours}h` : '+'}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-still-water text-white px-2 py-0.5 rounded-full font-medium">
                      You are here
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{phase.description}</p>

                {/* Expandable detail */}
                <details className="mt-2">
                  <summary className="text-xs text-still-water cursor-pointer hover:underline">Learn more</summary>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">{phase.detail}</p>
                  <p className="text-[10px] text-text-secondary mt-2 italic">
                    Individual responses vary. These timelines are approximate based on available research.
                  </p>
                </details>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
