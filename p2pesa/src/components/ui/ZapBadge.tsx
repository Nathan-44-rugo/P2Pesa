// src/components/ui/ZapBadge.tsx
// Daisy — Story 2.1

import React from 'react';

interface ZapBadgeProps {
  sats: number;
  verified: boolean;
}

function formatSats(sats: number): string {
  if (sats >= 1_000_000) return `${(sats / 1_000_000).toFixed(1)}M`;
  if (sats >= 1_000) return `${(sats / 1_000).toFixed(0)}k`;
  return `${sats}`;
}

export default function ZapBadge({ sats, verified }: ZapBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        verified
          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          : 'bg-gray-800 text-gray-500 border border-gray-700'
      }`}
      title={verified ? `Zap-verified review (${sats} sats)` : 'Unverified review'}
    >
      <span>{verified ? '⚡' : '○'}</span>
      {formatSats(sats)} sats
    </span>
  );
}
