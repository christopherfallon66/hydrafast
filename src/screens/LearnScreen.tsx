import { useState } from 'react';
import { PhaseTimeline } from '../components/timeline/PhaseTimeline';
import { BenefitLibrary } from '../components/benefits/BenefitLibrary';
import { RefeedingGuide } from '../components/refeeding/RefeedingGuide';
import { useFastStore } from '../store/fastStore';
import { getElapsedHours } from '../utils/conversions';

const TABS = [
  { key: 'timeline', label: 'Timeline' },
  { key: 'benefits', label: 'Benefits' },
  { key: 'refeeding', label: 'Refeeding' },
] as const;

export function LearnScreen() {
  const [tab, setTab] = useState<string>('timeline');
  const { activeFast } = useFastStore();
  const elapsedHours = activeFast ? getElapsedHours(activeFast.start_time) : undefined;

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-lg font-bold text-deep-ocean mb-4">Learn</h1>

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

      {tab === 'timeline' && <PhaseTimeline elapsedHours={elapsedHours} />}
      {tab === 'benefits' && <BenefitLibrary />}
      {tab === 'refeeding' && <RefeedingGuide />}
    </div>
  );
}
