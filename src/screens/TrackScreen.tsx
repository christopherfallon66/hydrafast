import { useState } from 'react';
import { WaterTracker } from '../components/water/WaterTracker';
import { WaterHistory } from '../components/water/WaterHistory';
import { WeightTracker } from '../components/metrics/WeightTracker';

const TABS = [
  { key: 'water', label: 'Water' },
  { key: 'metrics', label: 'Weight' },
] as const;

export function TrackScreen() {
  const [tab, setTab] = useState<string>('water');

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-lg font-bold text-deep-ocean mb-4">Track</h1>

      {/* Tab selector */}
      <div className="flex gap-1 bg-morning-mist rounded-xl p-1 mb-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-surface text-deep-ocean shadow-sm' : 'text-text-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tab === 'water' && (
          <>
            <WaterTracker />
            <WaterHistory />
          </>
        )}
        {tab === 'metrics' && (
          <WeightTracker />
        )}
      </div>
    </div>
  );
}
