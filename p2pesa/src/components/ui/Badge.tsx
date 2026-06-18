'use client';

/**
 * src/components/ui/Badge.tsx — Reusable badge/pill component
 */

import React from 'react';

type BadgeVariant = 'default' | 'verified' | 'authenticated' | 'warning' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  verified: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
  authenticated: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  warning: 'bg-red-500/10 text-red-400 border-red-500/20',
  muted: 'bg-brand-border/50 text-brand-muted border-brand-border',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
        text-xs font-semibold border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
