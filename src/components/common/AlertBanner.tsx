import type { ReactNode } from 'react';
import type { AlertLevel } from '../../types';

interface AlertBannerProps {
  level: AlertLevel;
  children: ReactNode;
  onDismiss?: () => void;
}

const STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  yellow: { bg: 'bg-amber-50', border: 'border-warning', text: 'text-amber-800', icon: '⚠️' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', icon: '🟠' },
  red: { bg: 'bg-red-50', border: 'border-danger', text: 'text-red-800', icon: '🚨' },
};

export function AlertBanner({ level, children, onDismiss }: AlertBannerProps) {
  if (level === 'none') return null;
  const style = STYLES[level];

  return (
    <div className={`${style.bg} border-l-4 ${style.border} ${style.text} p-4 rounded-r-xl mb-4`} role="alert">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">{style.icon}</span>
        <div className="flex-1 text-sm">{children}</div>
        {onDismiss && (
          <button onClick={onDismiss} className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-2 text-current opacity-60 hover:opacity-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
