'use client';

// src/features/agents/AgentCard.tsx
// Daisy — Story 3.1
// Compact agent card for search/list views

import React from 'react';
import Link from 'next/link';
import { AgentProfile } from '@/types/nostr';
import TrustScoreRing from '@/components/ui/TrustScoreRing';
import PaymentMethodBadge from '@/components/ui/PaymentMethodBadge';
import StarRating from '@/components/ui/StarRating';

interface AgentCardProps {
  agent: AgentProfile;
}

function formatBtc(sats: number): string {
  return (sats / 100_000_000).toFixed(4);
}

function avgRating(reviewCount: number, zapVolume: number): number {
  // Proxy average from zap volume per review — replaced by real avg from Rico's indexer
  if (reviewCount === 0) return 0;
  const raw = 3.5 + Math.min(zapVolume / reviewCount / 5000, 1.5);
  return Math.min(5, Math.round(raw * 10) / 10);
}

export default function AgentCard({ agent }: AgentCardProps) {
  const { npub, nostrProfile, walletVerification, trustScore, location, paymentMethods } = agent;
  const name = nostrProfile.display_name || nostrProfile.name || 'Unknown Agent';
  const handle = nostrProfile.name ? `@${nostrProfile.name}` : npub.slice(0, 16) + '…';
  const score = trustScore?.total ?? 0;
  const trades = trustScore?.tradeCount ?? 0;
  const reviews = trustScore?.reviewCount ?? 0;
  const sats = walletVerification?.balanceSats;
  const rating = avgRating(reviews, trustScore?.zapVolumeSats ?? 0);

  return (
    <Link
      href={`/profile/${npub}`}
      className="group block bg-gray-900/60 border border-gray-800 rounded-2xl p-4 hover:border-orange-500/40 hover:bg-gray-900/90 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Score ring */}
        <TrustScoreRing score={score} size="sm" animated={false} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-gray-100 text-sm truncate group-hover:text-orange-400 transition-colors">
                {name}
              </p>
              <p className="text-[11px] text-gray-500 font-mono truncate">{handle}</p>
            </div>
            {walletVerification?.status === 'verified' && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                ✓ Verified
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {reviews > 0 && (
              <div className="flex items-center gap-1">
                <StarRating value={Math.round(rating) as any} readonly size="sm" />
                <span className="text-[11px] text-gray-500">({reviews})</span>
              </div>
            )}
            {trades > 0 && (
              <span className="text-[11px] text-gray-500">
                <span className="text-gray-300 font-semibold">{trades}</span> trades
              </span>
            )}
            {sats != null && (
              <span className="text-[11px] text-gray-500">
                <span className="text-amber-400 font-semibold font-mono">{formatBtc(sats)}</span> BTC
              </span>
            )}
          </div>

          {/* Location + payment methods */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {location && (
              <span className="text-[11px] text-gray-500 flex items-center gap-0.5">
                <span>📍</span>{location}
              </span>
            )}
            {paymentMethods?.map((m) => (
              <PaymentMethodBadge key={m} method={m as any} />
            ))}
          </div>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="flex justify-end mt-2 -mb-1">
        <span className="text-gray-700 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all text-sm">→</span>
      </div>
    </Link>
  );
}
