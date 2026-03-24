import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  children: ReactNode;
}

const VARIANTS = {
  info: 'bg-morning-mist text-still-water',
  success: 'bg-seafoam text-success',
  warning: 'bg-amber-50 text-warning',
  danger: 'bg-red-50 text-danger',
};

export function Badge({ variant = 'info', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
