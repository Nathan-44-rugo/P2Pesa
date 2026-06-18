'use client';

/**
 * src/app/profile/[npub]/page.tsx
 *
 * Agent profile page — shows Nostr identity + BTC verification status.
 * AC2: Profile information fetched from Nostr relay
 * AC3: Redirected here after login
 *
 * @param params.npub — the agent's npub (URL-encoded)
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { NostrProfile, WalletVerification } from '@/types/nostr';
import { fetchNostrProfile } from '@/lib/nostrProfile';
import { npubToPubkey } from '@/lib/nostr';
import { AgentProfileCard } from '@/features/agents/AgentProfileCard';
import { WalletVerificationStub } from '@/features/agents/WalletVerificationStub';
import { useNostrAuth } from '@/hooks/useNostrAuth';

export default function ProfilePage() {
  const params = useParams();
  const npub = decodeURIComponent(params.npub as string);
  const { auth } = useNostrAuth();

  const [profile, setProfile] = useState<NostrProfile | null>(null);
  const [wallet, setWallet] = useState<WalletVerification>({
    status: 'unverified',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Is this the logged-in user's own profile?
  const isOwnProfile = auth.npub === npub;

  useEffect(() => {
    if (!npub) return;

    // If this is the logged-in user's profile and we already have their profile, use it
    if (isOwnProfile && auth.profile) {
      setProfile(auth.profile);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch from relay
    const { data: pubkey, error: decodeError } = npubToPubkey(npub);
    if (decodeError || !pubkey) {
      setError('Invalid npub — could not decode public key');
      setIsLoading(false);
      return;
    }

    fetchNostrProfile(pubkey).then(({ data, error: fetchError }) => {
      if (fetchError) {
        setError(fetchError);
      } else if (data) {
        setProfile(data);
      }
      setIsLoading(false);
    });
  }, [npub, isOwnProfile, auth.profile]);

  const handleWalletVerified = (verification: WalletVerification) => {
    setWallet(verification);
  };

  // --- Render states ---

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-white text-2xl font-bold mb-2">Profile Not Found</h1>
        <p className="text-brand-muted">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="text-5xl mb-4">👤</div>
        <h1 className="text-white text-2xl font-bold mb-2">No Profile Found</h1>
        <p className="text-brand-muted">
          This agent has not published a Kind 0 profile event yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {/* Page title */}
      <div className="mb-6">
        <p className="text-brand-muted text-sm mb-1">
          {isOwnProfile ? '👤 Your Profile' : '🔍 Agent Profile'}
        </p>
        <h1 className="text-white text-3xl font-bold">
          {profile.displayName ?? profile.name ?? 'Anonymous Agent'}
        </h1>
      </div>

      {/* Profile card */}
      <AgentProfileCard profile={profile} wallet={wallet} className="mb-6" />

      {/* Wallet verification (own profile only — deferred verification pattern) */}
      {isOwnProfile && wallet.status !== 'verified' && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="text-brand-muted text-xs px-2">Deferred Verification</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>
          <WalletVerificationStub
            npub={npub}
            onVerified={handleWalletVerified}
          />
        </div>
      )}

      {/* Trust score placeholder (Rico builds this in Epic 2) */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Trust Score</h2>
          <span className="text-xs text-brand-muted bg-brand-border/50 px-2 py-0.5 rounded-full">
            Epic 2 — Rico
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-5xl font-black text-brand-gold">—</div>
          <div>
            <p className="text-brand-muted text-sm">
              Trust score calculates once Zap-gated reviews are enabled.
            </p>
            <p className="text-brand-muted text-xs mt-1">
              Components: Verified trades + Zap-backed reviews + Wallet history
            </p>
          </div>
        </div>
      </div>

      {/* Eventual consistency badge */}
      <p className="text-center text-brand-muted text-xs mt-4">
        📡 Data sourced from Nostr relays — may be eventually consistent
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-brand-border rounded mb-4" />
      <div className="rounded-3xl border border-brand-border bg-brand-surface p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-brand-border" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-brand-border rounded mb-2" />
            <div className="h-4 w-24 bg-brand-border rounded" />
          </div>
        </div>
        <div className="h-10 bg-brand-border rounded-xl mb-4" />
        <div className="h-16 bg-brand-border rounded" />
      </div>
    </div>
  );
}
