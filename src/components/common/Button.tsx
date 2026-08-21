import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none";

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl',
  };

  const variantStyles = {
    primary: 'bg-eco-600 hover:bg-eco-700 text-white shadow-md shadow-eco-600/25 active:bg-eco-800',
    secondary: 'bg-eco-50 hover:bg-eco-100 text-eco-800 border border-eco-200/80 active:bg-eco-200',
    gold: 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-slate-900 shadow-md shadow-gold-500/25 font-extrabold',
    outline: 'border border-surface-border hover:bg-surface-subtle text-text-primary active:bg-surface-border/50',
    ghost: 'hover:bg-surface-subtle text-text-secondary hover:text-text-primary',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80',
    glass: 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/25',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="flex items-center shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="flex items-center shrink-0">{rightIcon}</span>}
    </button>
  );
};

