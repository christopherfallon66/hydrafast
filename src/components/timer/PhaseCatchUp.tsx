import { getCompletedPhases, getUpcomingPhases, getCurrentPhase } from '../../constants/phases';
import { Card } from '../common/Card';

interface PhaseCatchUpProps {
  elapsedHours: number;
}

/**
 * Shows users who jump in mid-fast what their body has already been through
 * and what's coming next.
 */
export function PhaseCatchUp({ elapsedHours }: PhaseCatchUpProps) {
  const completed = getCompletedPhases(elapsedHours);
  const current = getCurrentPhase(elapsedHours);
  const upcoming = getUpcomingPhases(elapsedHours);

  if (completed.length === 0) return null;

  return (
    <Card className="mb-4">
      <h3 className="text-sm font-bold text-deep-ocean mb-3">Your Journey So Far</h3>

      {/* Completed phases */}
      <div className="space-y-2 mb-3">
        {completed.map((phase) => (
          <div key={phase.key} className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-deep-ocean">{phase.name}</span>
              <span className="text-xs text-text-secondary ml-1">({phase.onset_hours}–{phase.end_hours}h)</span>
              <p className="text-xs text-text-secondary">{phase.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Current phase */}
      <div className="flex items-start gap-2 bg-morning-mist rounded-xl p-3 mb-3">
        <div className="w-5 h-5 rounded-full bg-still-water flex items-center justify-center flex-shrink-0 mt-0.5">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-still-water">Now: {current.name}</span>
          <p className="text-xs text-deep-ocean mt-0.5">{current.description}</p>
        </div>
      </div>

      {/* Next up */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-xs text-text-secondary mb-1">Coming up:</p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-shallow-pool">{upcoming[0].name}</span>
            <span className="text-xs text-text-secondary">at {upcoming[0].onset_hours}h</span>
          </div>
        </div>
      )}
    </Card>
  );
}
