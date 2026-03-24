import type { HealthCheckIn } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatLocalDateTime } from '../../utils/conversions';

interface CheckInHistoryProps {
  checkIns: HealthCheckIn[];
}

const MOOD_EMOJIS: Record<string, string> = {
  great: '😄', good: '🙂', neutral: '😐', low: '😔', bad: '😣',
};

const ALERT_BADGE: Record<string, { variant: 'info' | 'success' | 'warning' | 'danger'; label: string }> = {
  none: { variant: 'success', label: 'All clear' },
  yellow: { variant: 'warning', label: 'Mild' },
  orange: { variant: 'warning', label: 'Caution' },
  red: { variant: 'danger', label: 'Urgent' },
};

export function CheckInHistory({ checkIns }: CheckInHistoryProps) {
  if (checkIns.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-deep-ocean">Recent Check-Ins</h3>
      {checkIns.map((ci) => {
        const ab = ALERT_BADGE[ci.alert_level];
        return (
          <Card key={ci.id}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary">{formatLocalDateTime(ci.timestamp)}</span>
              <Badge variant={ab.variant}>{ab.label}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>{MOOD_EMOJIS[ci.mood]}</span>
              <span className="text-text-secondary">Energy {ci.energy}/10</span>
              <span className="text-text-secondary">Clarity {ci.clarity}/10</span>
            </div>
            {(ci.dizziness !== 'none' || ci.nausea !== 'none' || ci.headache !== 'none' || ci.heart_palpitations || ci.muscle_cramps) && (
              <div className="flex flex-wrap gap-1 mt-2">
                {ci.dizziness !== 'none' && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Dizzy: {ci.dizziness}</span>}
                {ci.nausea !== 'none' && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Nausea: {ci.nausea}</span>}
                {ci.headache !== 'none' && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Headache: {ci.headache}</span>}
                {ci.heart_palpitations && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">Palpitations</span>}
                {ci.muscle_cramps && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Cramps</span>}
              </div>
            )}
            {ci.notes && <p className="text-xs text-text-secondary mt-2 italic">{ci.notes}</p>}
          </Card>
        );
      })}
    </div>
  );
}
