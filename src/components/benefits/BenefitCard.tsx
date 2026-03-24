import type { FastingBenefit } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface BenefitCardProps {
  benefit: FastingBenefit;
  compact?: boolean;
}

const EVIDENCE_BADGE: Record<string, { variant: 'success' | 'info' | 'warning'; label: string }> = {
  established: { variant: 'success', label: 'Well-established' },
  emerging: { variant: 'info', label: 'Emerging research' },
  preliminary: { variant: 'warning', label: 'Preliminary' },
};

const CATEGORY_ICONS: Record<string, string> = {
  metabolic: '🔥',
  cellular: '🧬',
  cognitive: '🧠',
  immune: '🛡️',
  psychological: '🧘',
};

export function BenefitCard({ benefit, compact = false }: BenefitCardProps) {
  const evidence = EVIDENCE_BADGE[benefit.evidence_level];

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-morning-mist to-glacier">
        <div className="flex items-start gap-2">
          <span className="text-lg">{CATEGORY_ICONS[benefit.category]}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-deep-ocean">{benefit.title}</h4>
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">{benefit.summary}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xl">{CATEGORY_ICONS[benefit.category]}</span>
        <div className="flex-1">
          <h3 className="text-base font-bold text-deep-ocean">{benefit.title}</h3>
          <Badge variant={evidence.variant}>{evidence.label}</Badge>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-3">{benefit.summary}</p>
      <details>
        <summary className="text-xs text-still-water cursor-pointer hover:underline">Learn more</summary>
        <p className="text-xs text-text-secondary mt-2 leading-relaxed">{benefit.detail}</p>
        {benefit.sources.length > 0 && (
          <p className="text-[10px] text-text-secondary mt-2 italic">
            References: {benefit.sources.join('; ')}
          </p>
        )}
      </details>
    </Card>
  );
}
