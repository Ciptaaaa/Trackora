import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-petrol-600 text-white shadow-xs hover:bg-petrol-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-petrol-500 focus-visible:ring-offset-2',
  secondary:
    'bg-petrol-50 text-petrol-700 border border-petrol-200/80 hover:bg-petrol-200/60 active:scale-[0.98] dark:border-petrol-400/40',
  ghost: 'text-ink-600 hover:bg-paper-200/80 hover:text-ink-900 active:scale-[0.98]',
  danger: 'bg-berry-500 text-white hover:bg-berry-700 active:scale-[0.98]',
  'danger-ghost':
    'text-berry-500 border border-berry-500/30 hover:bg-berry-100 hover:text-berry-700 active:scale-[0.98]',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs font-semibold rounded-md',
  md: 'h-9 gap-2 px-4 text-sm font-semibold rounded-md',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center transition-all duration-120 max-sm:min-h-11 disabled:pointer-events-none disabled:opacity-50 select-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
