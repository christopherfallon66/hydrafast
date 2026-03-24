import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const VARIANTS = {
  primary: 'bg-still-water text-white hover:bg-deep-ocean active:bg-deep-ocean',
  secondary: 'bg-morning-mist text-deep-ocean hover:bg-shallow-pool/20 active:bg-shallow-pool/30',
  danger: 'bg-danger text-white hover:bg-red-600 active:bg-red-700',
  ghost: 'bg-transparent text-still-water hover:bg-morning-mist active:bg-shallow-pool/20',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3.5 text-lg rounded-xl',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`ripple font-semibold transition-colors min-h-[44px] min-w-[44px] ${VARIANTS[variant]} ${SIZES[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
