import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'pending' | 'error' | 'eco' | 'gold' | 'neutral' | 'blue' | 'purple';
  size?: 'sm' | 'md' | 'lg';
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
  const baseStyles = "inline-flex items-center font-bold rounded-full tracking-tight";

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 leading-none',
    md: 'text-[11px] px-2.5 py-1 gap-1.5 leading-tight',
    lg: 'text-xs px-3 py-1.5 gap-1.5 leading-normal',
  };

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/90',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/90',
    pending: 'bg-sky-50 text-sky-700 border border-sky-200/90',
    error: 'bg-rose-50 text-rose-700 border border-rose-200/90',
    eco: 'bg-eco-50 text-eco-700 border border-eco-200',
    gold: 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  };

  return (
    <span className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

