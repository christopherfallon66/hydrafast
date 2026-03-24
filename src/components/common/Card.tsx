import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl shadow-sm p-4 ${onClick ? 'cursor-pointer active:shadow-none transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
