import { useState } from 'react';
import { FASTING_BENEFITS } from '../../constants/benefits';
import { BenefitCard } from './BenefitCard';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'metabolic', label: 'Metabolic' },
  { key: 'cellular', label: 'Cellular' },
  { key: 'cognitive', label: 'Brain' },
  { key: 'immune', label: 'Immune' },
  { key: 'psychological', label: 'Mind' },
] as const;

export function BenefitLibrary() {
  const [filter, setFilter] = useState('all');

  const benefits = filter === 'all'
    ? FASTING_BENEFITS
    : FASTING_BENEFITS.filter(b => b.category === filter);

  return (
    <div>
      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-3 mb-3">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === c.key ? 'bg-still-water text-white' : 'bg-morning-mist text-deep-ocean'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {benefits.map(b => (
          <BenefitCard key={b.id} benefit={b} />
        ))}
      </div>
    </div>
  );
}
