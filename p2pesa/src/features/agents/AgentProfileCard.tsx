'use client';

/**
 * src/features/agents/AgentProfileCard.tsx
 *
 * Displays an agent's Nostr profile: name, avatar, npub, about, and trust badge.
 * Shows "Authenticated" (Nostr-only) vs "Active/Verified" (Nostr + BTC) states.
 */

import React from 'react';
import Image from 'next/image';
import type { NostrProfile, WalletVerification } from '@/types/nostr';
import { getDisplayName } from '@/lib/nostrProfile';

interface AgentProfileCardProps {
  profile: NostrProfile;
  wallet?: WalletVerification;
  className?: string;
}

export function AgentProfileCard({
  profile,
  wallet,
  className = '',
}: AgentProfileCardProps) {
  const displayName = getDisplayName(profile);
  const isVerified = wallet?.status === 'verified';
  const shortNpub = `${profile.npub.slice(0, 16)}...${profile.npub.slice(-8)}`;

  return (
    <div
      className={`
        relative rounded-3xl border border-brand-border bg-brand-surface
        p-6 shadow-xl backdrop-blur-sm animate-slide-up
        ${className}
      `}
    >
      {/* Verification glow */}
      {isVerified && (
        <div
          className="absolute inset-0 rounded-3xl bg-brand-teal/5 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Header: Avatar + Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          {profile.picture ? (
            <Image
              src={profile.picture}
              alt={`${displayName}'s avatar`}
              width={64}
              height={64}
              className="rounded-full border-2 border-brand-orange object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center text-2xl font-bold text-white">
              {displayName[0]?.toUpperCase() ?? '?'}
            </div>
          )}

          {/* Online indicator */}
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-teal border-2 border-brand-surface"
            aria-label="Online"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-xl truncate">
            {displayName}
          </h2>
          {profile.nip05 && (
            <p className="text-brand-teal text-sm truncate flex items-center gap-1">
              <span>✓</span>
              <span>{profile.nip05}</span>
            </p>
          )}
        </div>

        {/* Trust badge */}
        <TrustBadge isVerified={isVerified} />
      </div>

      {/* Npub */}
      <div className="bg-brand-dark/50 rounded-xl p-3 mb-4 font-mono text-xs text-brand-muted break-all">
        <span className="text-brand-orange mr-1">npub</span>
        {shortNpub}
      </div>

      {/* About */}
      {profile.about && (
        <p className="text-brand-light text-sm leading-relaxed mb-4 line-clamp-3">
          {profile.about}
        </p>
      )}

      {/* Wallet info (if verified - Francis fills this in Story 1.2) */}
      {isVerified && wallet?.balanceSats !== undefined ? (
        <div className="flex items-center gap-2 bg-brand-teal/10 border border-brand-teal/20 rounded-xl p-3">
          <span className="text-brand-teal text-lg">₿</span>
          <div>
            <p className="text-brand-teal font-semibold text-sm">
              Verified Balance
            </p>
            <p className="text-white font-mono font-bold">
              {(wallet.balanceSats / 100_000_000).toFixed(8)} BTC
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-brand-border/30 rounded-xl p-3">
          <span className="text-brand-muted text-lg">₿</span>
          <p className="text-brand-muted text-sm">
            Wallet not verified —{' '}
            <span className="text-brand-orange">Post Liquidity</span> to verify
          </p>
        </div>
      )}

      {/* Website */}
      {profile.website && (
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-brand-muted text-xs hover:text-brand-orange transition-colors truncate"
        >
          🌐 {profile.website}
        </a>
      )}
    </div>
  );
}

// --- Sub-components ---

function TrustBadge({ isVerified }: { isVerified: boolean }) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold
        ${
          isVerified
            ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30'
            : 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
        }
      `}
      aria-label={isVerified ? 'Active/Verified' : 'Authenticated'}
    >
      <span className="text-base">{isVerified ? '✅' : '🔑'}</span>
      <span>{isVerified ? 'Verified' : 'Authenticated'}</span>
    </div>
  );
}
