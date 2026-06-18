'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { AgentReview, NostrProfile, WalletVerification } from '@/types/nostr';
import { fetchNostrProfile } from '@/lib/nostrProfile';
import { npubToPubkey } from '@/lib/nostr';
import { AgentProfileCard } from '@/features/agents/AgentProfileCard';
import { WalletVerificationStub } from '@/features/agents/WalletVerificationStub';
import { ReviewSubmissionForm } from '@/features/reviews/ReviewSubmissionForm';
import { TrustScorePanel } from '@/features/reviews/TrustScorePanel';
import { useNostrAuth } from '@/hooks/useNostrAuth';

export default function ProfilePage() {
  const params = useParams();
  const npub = decodeURIComponent(params.npub as string);
  const { auth } = useNostrAuth();

  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [agentPubkey, setAgentPubkey] = useState<string | null>(null);
  const [wallet, setWallet] = useState<WalletVerification>({
    status: 'unverified',
  });
  const [reviews, setReviews] = useState<AgentReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = auth.npub === npub;

  useEffect(() => {
    if (!npub) {
      return;
    }

    if (isOwnProfile && auth.profile) {
      setProfile(auth.profile);
      setAgentPubkey(auth.pubkey);
      setIsLoading(false);
      return;
    }

    const { data: pubkey, error: decodeError } = npubToPubkey(npub);
    if (decodeError || !pubkey) {
      setError('Invalid npub - could not decode public key');
      setIsLoading(false);
      return;
    }

    setAgentPubkey(pubkey);
    fetchNostrProfile(pubkey).then(({ data, error: fetchError }) => {
      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setProfile(data);
      }
      setIsLoading(false);
    });
  }, [npub, isOwnProfile, auth.profile, auth.pubkey]);

  const handleWalletVerified = (verification: WalletVerification) => {
    setWallet(verification);
  };

  const handleReviewSubmitted = (review: AgentReview) => {
    setReviews((current) => [review, ...current]);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
        <div className="mb-4 text-5xl">!</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Profile Not Found</h1>
        <p className="text-brand-muted">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
        <div className="mb-4 text-5xl">?</div>
        <h1 className="mb-2 text-2xl font-bold text-white">No Profile Found</h1>
        <p className="text-brand-muted">
          This agent has not published a Kind 0 profile event yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <div className="mb-6">
        <p className="mb-1 text-sm text-brand-muted">
          {isOwnProfile ? 'Your Profile' : 'Agent Profile'}
        </p>
        <h1 className="text-3xl font-bold text-white">
          {profile.displayName ?? profile.name ?? 'Anonymous Agent'}
        </h1>
      </div>

      <AgentProfileCard profile={profile} wallet={wallet} className="mb-6" />

      {isOwnProfile && wallet.status !== 'verified' && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="px-2 text-xs text-brand-muted">Deferred Verification</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>
          <WalletVerificationStub npub={npub} onVerified={handleWalletVerified} />
        </div>
      )}

      {agentPubkey && (
        <div className="mb-6">
          <TrustScorePanel
            agentPubkey={agentPubkey}
            wallet={wallet}
            reviews={reviews}
          />
        </div>
      )}

      {agentPubkey && auth.status === 'authenticated' && !isOwnProfile && (
        <div className="mb-6">
          <ReviewSubmissionForm
            agentPubkey={agentPubkey}
            reviewerPubkey={auth.pubkey}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      )}

      <p className="mt-4 text-center text-xs text-brand-muted">
        Data sourced from Nostr relays - may be eventually consistent
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-xl animate-pulse">
      <div className="mb-4 h-8 w-48 rounded bg-brand-border" />
      <div className="rounded-3xl border border-brand-border bg-brand-surface p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-brand-border" />
          <div className="flex-1">
            <div className="mb-2 h-5 w-32 rounded bg-brand-border" />
            <div className="h-4 w-24 rounded bg-brand-border" />
          </div>
        </div>
        <div className="mb-4 h-10 rounded-xl bg-brand-border" />
        <div className="h-16 rounded bg-brand-border" />
      </div>
    </div>
  );
}
