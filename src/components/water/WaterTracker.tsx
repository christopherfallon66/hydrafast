import { useEffect } from 'react';
import { useWaterStore } from '../../store/waterStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useFastStore } from '../../store/fastStore';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatWater, ozToMl } from '../../utils/conversions';

export function WaterTracker() {
  const { todayTotal, loadToday, addWater } = useWaterStore();
  const { water_goal_ml, units } = useSettingsStore();
  const { activeFast } = useFastStore();

  useEffect(() => { loadToday(); }, []);

  const progress = Math.min(1, todayTotal / water_goal_ml);
  const quickAmounts = units === 'imperial'
    ? [{ label: '8 oz', ml: ozToMl(8) }, { label: '12 oz', ml: ozToMl(12) }, { label: '16 oz', ml: ozToMl(16) }]
    : [{ label: '250 mL', ml: 250 }, { label: '350 mL', ml: 350 }, { label: '500 mL', ml: 500 }];

  const handleAdd = async (ml: number) => {
    await addWater(ml, activeFast?.id);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-deep-ocean">Water Intake</h3>
        <span className="text-xs text-text-secondary">
          {formatWater(todayTotal, units)} / {formatWater(water_goal_ml, units)}
        </span>
      </div>

      {/* Water fill visual */}
      <div className="relative w-full h-24 bg-morning-mist rounded-xl overflow-hidden mb-3">
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-still-water to-shallow-pool transition-all duration-500 ease-out"
          style={{ height: `${progress * 100}%` }}
        >
          {/* Wave SVG overlay */}
          <svg
            className="water-wave absolute top-0 left-0 w-[200%] h-3"
            viewBox="0 0 1200 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0 5 Q150 0, 300 5 T600 5 T900 5 T1200 5 V10 H0 Z"
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-deep-ocean drop-shadow-sm">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="flex gap-2">
        {quickAmounts.map((amt) => (
          <Button
            key={amt.label}
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => handleAdd(amt.ml)}
          >
            + {amt.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
