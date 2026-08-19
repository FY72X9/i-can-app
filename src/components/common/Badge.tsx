import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'pending' | 'error' | 'eco' | 'gold' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  icon,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-semibold rounded-full";

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    pending: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    error: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    eco: 'bg-eco-50 text-eco-700 border border-eco-200',
    gold: 'bg-amber-100 text-amber-800 border border-amber-300 font-bold',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
