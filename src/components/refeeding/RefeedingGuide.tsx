import { getRefeedingProtocol } from '../../constants/refeeding';
import { useFastStore } from '../../store/fastStore';
import { getElapsedHours } from '../../utils/conversions';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AlertBanner } from '../common/AlertBanner';

interface RefeedingGuideProps {
  overrideHours?: number;
}

export function RefeedingGuide({ overrideHours }: RefeedingGuideProps) {
  const { activeFast } = useFastStore();

  const hours = overrideHours ?? (activeFast ? getElapsedHours(activeFast.start_time) : 24);
  const protocol = getRefeedingProtocol(hours);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-deep-ocean">{protocol.label}</h2>
          <Badge variant={protocol.tier === 'extended' ? 'danger' : protocol.tier === 'medium' ? 'warning' : 'info'}>
            {protocol.risk_level}
          </Badge>
        </div>
        <p className="text-sm text-text-secondary">
          Based on a fast of approximately {Math.round(hours)} hours. Follow these phases to break your fast safely.
        </p>
      </Card>

      {/* Warnings */}
      {protocol.warnings.map((w, i) => (
        <AlertBanner key={i} level={w.includes('emergency') || w.includes('chest pain') ? 'red' : w.includes('Physician') ? 'orange' : 'yellow'}>
          <p className="text-sm">{w}</p>
        </AlertBanner>
      ))}

      {/* Phases */}
      {protocol.phases.map((phase, i) => (
        <Card key={i}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-still-water text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {i + 1}
            </div>
            <div>
              <h3 className="text-sm font-bold text-deep-ocean">{phase.name}</h3>
              <span className="text-xs text-text-secondary">{phase.time_range}</span>
            </div>
          </div>
          <p className="text-xs text-text-secondary mb-3">{phase.notes}</p>
          <div className="bg-glacier rounded-xl p-3">
            <p className="text-xs font-medium text-deep-ocean mb-1.5">Suggested foods:</p>
            <ul className="space-y-1">
              {phase.foods.map((food, j) => (
                <li key={j} className="text-xs text-text-secondary flex items-start gap-1.5">
                  <span className="text-shallow-pool mt-0.5">•</span>
                  {food}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}

      <p className="text-xs text-text-secondary text-center px-4">
        This is not medical advice. Consult a healthcare provider before fasting, especially for extended fasts.
      </p>
    </div>
  );
}
