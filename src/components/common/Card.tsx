import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'eco' | 'subtle' | 'outline' | 'glass' | 'gold';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  ...props
}) => {
  const baseStyles = "rounded-card p-4 sm:p-5 transition-all duration-200";

  const variantStyles = {
    default: 'bg-white shadow-eco-soft border border-surface-border/70',
    eco: 'eco-gradient-hero text-white shadow-eco-float border border-white/15',
    subtle: 'bg-surface-subtle border border-surface-border/60',
    outline: 'bg-transparent border border-surface-border',
    glass: 'eco-glass-card shadow-eco-soft',
    gold: 'gold-gradient-card border border-amber-200/80 shadow-eco-soft text-text-primary',
  };

  const hoverStyles = hoverable ? 'hover:shadow-eco-card hover:-translate-y-0.5 cursor-pointer active:translate-y-0' : '';

  return (
    <div className={twMerge(clsx(baseStyles, variantStyles[variant], hoverStyles, className))} {...props}>
      {children}
    </div>
  );
};

