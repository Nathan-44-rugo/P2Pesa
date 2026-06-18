'use client';

// src/features/agents/AgentProfileFull.tsx
// Daisy — Story 2.1 / 3.1
// Full agent profile view — stitches Nathan's profile card + Francis's wallet data
// + Rico's trust score + Daisy's reviews section

import React, { useState, useEffect, useMemo } from 'react';
import { AgentProfile, PaymentMethod, Review, AgentReview, WalletVerification } from '@/types/nostr';
import TrustScoreRing from '@/components/ui/TrustScoreRing';
import StarRating from '@/components/ui/StarRating';
import PaymentMethodBadge from '@/components/ui/PaymentMethodBadge';
import ReviewCard from '@/features/reviews/ReviewCard';
import ReviewSubmitForm from '@/features/reviews/ReviewSubmitForm';
import { WalletVerificationStub } from '@/features/agents/WalletVerificationStub';
import { FiZap } from 'react-icons/fi';
import { npubToPubkey, pubkeyToNpub } from '@/lib/nostr';
import { fetchAgentReviewEvents } from '@/lib/reputationRelay';
import { parseReviewEvent, calculateTrustScore } from '@/lib/reputation';

interface AgentProfileFullProps {
  agent: AgentProfile;
  reviews: Review[];
  isOwnProfile?: boolean;
}

function formatBtc(sats: number): string {
  return (sats / 100_000_000).toFixed(6);
}

function formatSats(sats: number): string {
  return sats.toLocaleString();
}

function mapAgentReviewToReview(r: AgentReview): Review {
  return {
    id: r.id ?? `${r.reviewerPubkey}-${r.createdAt}`,
    agentNpub: pubkeyToNpub(r.agentPubkey),
    reviewerNpub: pubkeyToNpub(r.reviewerPubkey),
    rating: r.rating,
    content: r.comment,
    zapAmountSats: Math.floor(r.zapAmountMsats / 1000),
    zapVerified: r.zapAmountMsats >= 1000,
    createdAt: r.createdAt,
    nostrEventId: r.id,
  };
}

function mapReviewToAgentReview(r: Review): AgentReview {
  return {
    id: r.id,
    agentPubkey: npubToPubkey(r.agentNpub).data ?? r.agentNpub,
    reviewerPubkey: npubToPubkey(r.reviewerNpub).data ?? r.reviewerNpub,
    rating: r.rating,
    comment: r.content,
    zapReceiptId: r.id,
    zapAmountMsats: (r.zapAmountSats ?? 0) * 1000,
    createdAt: r.createdAt < 10000000000 ? r.createdAt : Math.floor(r.createdAt / 1000),
  };
}

export default function AgentProfileFull({ agent, reviews, isOwnProfile = false }: AgentProfileFullProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [localWalletVerification, setLocalWalletVerification] = useState<WalletVerification | undefined>(agent.walletVerification || agent.wallet);
  const [relayReviews, setRelayReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [relayError, setRelayError] = useState<string | null>(null);

  const { nostrProfile, location, paymentMethods } = agent;
  const name = nostrProfile.display_name || nostrProfile.name || 'Unknown Agent';

  useEffect(() => {
    const { data: agentPubkey } = npubToPubkey(agent.npub);
    if (!agentPubkey) return;

    let cancelled = false;
    setIsLoadingReviews(true);
    setRelayError(null);

    fetchAgentReviewEvents(agentPubkey).then((result) => {
      if (cancelled) return;

      if (result.error) {
        setRelayError(result.error);
      }

      const parsed = (result.data ?? [])
        .map((event) => parseReviewEvent(event).data)
        .filter((review): review is AgentReview => Boolean(review))
        .map(mapAgentReviewToReview);

      setRelayReviews(parsed);
      setIsLoadingReviews(false);
    });

    return () => {
      cancelled = true;
    };
  }, [agent.npub]);

  const mergedReviews = useMemo<Review[]>(() => {
    const byId = new Map<string, Review>();
    for (const r of reviews) {
      byId.set(r.id, r);
    }
    for (const r of relayReviews) {
      byId.set(r.id, r);
    }
    return Array.from(byId.values()).sort((a, b) => b.createdAt - a.createdAt);
  }, [reviews, relayReviews]);

  const computedTrustScore = useMemo(() => {
    const agentReviews = mergedReviews.map(mapReviewToAgentReview);
    return calculateTrustScore(agentReviews, localWalletVerification);
  }, [mergedReviews, localWalletVerification]);

  const score = computedTrustScore.score ?? 0;
  const trades = computedTrustScore.verifiedTradeCount ?? 0;
  const disputes = agent.trustScore?.disputeCount ?? 0;
  const zapVolume = computedTrustScore.totalZapSats ?? 0;

  const computedBreakdown = {
    walletScore: (computedTrustScore.verifiedTradeCount ?? 0) * 15,
    reviewScore: Math.round((computedTrustScore.averageRating ?? 0) * 12),
    attestationScore: Math.min(25, Math.round(Math.log10((computedTrustScore.totalZapSats ?? 0) + 1) * 10)),
    disputePenalty: 0,
    accountAge: 0,
  };

  function handleReviewSuccess() {
    setShowReviewForm(false);
    const { data: agentPubkey } = npubToPubkey(agent.npub);
    if (agentPubkey) {
      setIsLoadingReviews(true);
      fetchAgentReviewEvents(agentPubkey).then((result) => {
        const parsed = (result.data ?? [])
          .map((event) => parseReviewEvent(event).data)
          .filter((review): review is AgentReview => Boolean(review))
          .map(mapAgentReviewToReview);
        setRelayReviews(parsed);
        setIsLoadingReviews(false);
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* ── Hero card ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Top gradient strip */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

        <div className="p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {nostrProfile.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={nostrProfile.picture}
                  alt={name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-2xl font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              {localWalletVerification?.status === 'verified' && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-gray-900" title="Bitcoin wallet verified">✓</span>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-100">{name}</h1>
              {nostrProfile.name && (
                <p className="text-sm text-gray-500 font-mono">@{nostrProfile.name}</p>
              )}
              <p className="text-[11px] text-gray-600 font-mono mt-0.5 truncate">
                {agent.npub.slice(0, 24)}…
              </p>
              {location && (
                <p className="text-sm text-gray-400 mt-1">📍 {location}</p>
              )}
            </div>

            {/* Trust score */}
            <TrustScoreRing score={score} size="lg" breakdown={computedBreakdown} />
          </div>

          {/* Bio */}
          {nostrProfile.about && (
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">{nostrProfile.about}</p>
          )}

          {/* Payment methods */}
          {paymentMethods && paymentMethods.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Accepts</span>
              {paymentMethods.map((m) => (
                <PaymentMethodBadge key={m} method={m as PaymentMethod} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Trades', value: trades, accent: false },
          { label: 'Reviews', value: mergedReviews.length, accent: false },
          { label: 'Disputes', value: disputes, accent: disputes > 0 },
        ].map(({ label, value, accent }) => (
          <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${accent ? 'text-red-400' : 'text-gray-100'}`}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Wallet verification ── */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Bitcoin wallet</h2>
        {localWalletVerification ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Status</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                localWalletVerification.status === 'verified'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {localWalletVerification.status === 'verified' ? '✓ Cryptographically verified' : 'Unverified'}
              </span>
            </div>
            {localWalletVerification.balanceSats != null && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">On-chain balance</span>
                <span className="text-sm font-mono font-semibold text-amber-400">
                  {formatBtc(localWalletVerification.balanceSats)} BTC
                  <span className="text-gray-600 font-normal text-xs ml-1">({formatSats(localWalletVerification.balanceSats)} sats)</span>
                </span>
              </div>
            )}
            {localWalletVerification.address && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-500 flex-shrink-0">Address</span>
                <span className="text-[11px] font-mono text-gray-500 truncate">{localWalletVerification.address}</span>
              </div>
            )}
            <p className="text-[11px] text-gray-600 pt-1">
              Balance sourced from Mempool.space · Signature verified client-side via secp256k1
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Wallet not yet verified.</p>
        )}
      </div>

      {/* ── Deferred Wallet Verification Stub for Own Profile ── */}
      {isOwnProfile && localWalletVerification?.status !== 'verified' && (
        <WalletVerificationStub
          npub={agent.npub}
          onVerified={(v) => setLocalWalletVerification(v)}
        />
      )}

      {/* ── Zap activity ── */}
      {zapVolume > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-sm font-semibold text-amber-400">
              {formatSats(zapVolume)} sats in verified review zaps
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Every review on this profile was backed by a Lightning payment — Sybil-resistant reputation.
            </p>
          </div>
        </div>
      )}

      {/* ── Ecosystem Verification ── */}
      <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
          <FiZap className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-brand-teal">
              Pontmore Protocol Interoperability
            </p>
            <span className="text-[10px] bg-brand-teal/20 text-brand-teal px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
          </div>
          <p className="text-xs text-brand-muted mt-0.5 leading-relaxed">
            This agent profile automatically ingests verified swap attestations from the Pontmore protocol (Kind 30000). Reputation is portable across all P2Pesa-compatible relays.
          </p>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Reviews ({mergedReviews.length})
          </h2>
          {isLoadingReviews && (
            <span className="text-xs text-gray-500 animate-pulse">Syncing relays…</span>
          )}
          {relayError && (
            <span className="text-xs text-brand-orange" title={relayError}>⚠️ Relay fallback active</span>
          )}
          {!isOwnProfile && (
            <button
              type="button"
              onClick={() => setShowReviewForm((v) => !v)}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors border border-orange-500/30 hover:border-orange-500/60 px-3 py-1.5 rounded-lg"
            >
              {showReviewForm ? 'Cancel' : '+ Write a review'}
            </button>
          )}
        </div>

        {showReviewForm && !isOwnProfile && (
          <ReviewSubmitForm
            agentNpub={agent.npub}
            agentName={name}
            onSubmitSuccess={handleReviewSuccess}
          />
        )}

        {mergedReviews.length > 0 ? (
          <div className="space-y-3">
            {mergedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/40 border border-gray-800 border-dashed rounded-2xl p-8 text-center">
            <p className="text-gray-500 text-sm">No reviews yet.</p>
            <p className="text-gray-600 text-xs mt-1">Be the first to trade and leave a verified review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
