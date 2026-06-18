'use client';

import React from 'react';

type BadgeVariant = 'default' | 'verified' | 'authenticated' | 'warning' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-brand-orange/5 text-brand-orange border-brand-orange/20',
  verified: 'bg-brand-teal/5 text-brand-teal border-brand-teal/20',
  authenticated: 'bg-zinc-800/40 text-zinc-300 border-zinc-700/50',
  warning: 'bg-red-950/20 text-red-400 border-red-900/30',
  muted: 'bg-brand-surface text-brand-muted border-brand-border',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded
        text-[10px] font-mono-tech uppercase tracking-wider border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
