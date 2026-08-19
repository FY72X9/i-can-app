import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'eco' | 'subtle' | 'outline';
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
    default: 'bg-white shadow-eco-soft border border-surface-border/60',
    eco: 'bg-gradient-to-br from-eco-600 to-eco-700 text-white shadow-eco-float',
    subtle: 'bg-surface-subtle border border-surface-border/40',
    outline: 'bg-transparent border border-surface-border',
  };

  const hoverStyles = hoverable ? 'hover:shadow-eco-card hover:-translate-y-0.5 cursor-pointer' : '';

  return (
    <div className={twMerge(clsx(baseStyles, variantStyles[variant], hoverStyles, className))} {...props}>
      {children}
    </div>
  );
};
