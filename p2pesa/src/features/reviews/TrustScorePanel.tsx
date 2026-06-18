'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { AgentReview, TrustScore, WalletVerification } from '@/types/nostr';
import { calculateTrustScore, parseReviewEvent } from '@/lib/reputation';
import { fetchAgentReviewEvents } from '@/lib/reputationRelay';

interface TrustScorePanelProps {
  agentPubkey: string;
  wallet: WalletVerification;
  reviews: AgentReview[];
}

export function TrustScorePanel({ agentPubkey, wallet, reviews }: TrustScorePanelProps) {
  const [relayReviews, setRelayReviews] = useState<AgentReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [relayError, setRelayError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    fetchAgentReviewEvents(agentPubkey).then((result) => {
      if (cancelled) {
        return;
      }

      if (result.error) {
        setRelayError(result.error);
      }

      const parsed = (result.data ?? [])
        .map((event) => parseReviewEvent(event).data)
        .filter((review): review is AgentReview => Boolean(review));
      setRelayReviews(parsed);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [agentPubkey]);

  const trustScore = useMemo<TrustScore>(() => {
    const byId = new Map<string, AgentReview>();
    for (const review of [...relayReviews, ...reviews]) {
      byId.set(review.id ?? `${review.reviewerPubkey}-${review.createdAt}`, review);
    }
    return calculateTrustScore(Array.from(byId.values()), wallet);
  }, [relayReviews, reviews, wallet]);

  return (
    <section className="rounded-2xl border border-brand-border bg-brand-surface/30 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-semibold">Trust Score</h2>
          <p className="text-brand-muted text-xs">
            Verified trades + zap-backed reviews
          </p>
        </div>
        <span className="rounded-full border border-brand-border bg-brand-border/50 px-2 py-0.5 text-xs text-brand-muted">
          {isLoading ? 'Syncing' : 'Eventual consistency'}
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10">
          <span className="text-4xl font-black text-brand-gold">
            {trustScore.score}
          </span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 text-sm">
          <Metric label="Verified trades" value={trustScore.verifiedTradeCount} />
          <Metric label="Zap reviews" value={trustScore.zapBackedReviewCount} />
          <Metric label="Avg rating" value={trustScore.averageRating || '-'} />
          <Metric label="Zap sats" value={trustScore.totalZapSats} />
        </div>
      </div>

      <p className="mt-4 text-xs text-brand-muted">
        Last updated:{' '}
        {trustScore.lastUpdated
          ? new Date(trustScore.lastUpdated * 1000).toLocaleString()
          : 'No verified reputation events yet'}
      </p>

      {relayError && (
        <p className="mt-3 rounded-lg bg-brand-orange/10 px-3 py-2 text-xs text-brand-orange">
          Relay fallback active: {relayError}
        </p>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-brand-border bg-brand-dark/40 p-3">
      <p className="text-xs text-brand-muted">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold text-white">{value}</p>
    </div>
  );
}
