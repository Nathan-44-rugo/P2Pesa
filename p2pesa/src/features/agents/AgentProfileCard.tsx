'use client';

import React, { useState } from 'react';
import type { NostrProfile, WalletVerification } from '@/types/nostr';
import { getDisplayName } from '@/lib/nostrProfile';
import { Avatar } from '@/components/ui/Avatar';
import { FiGlobe, FiCheck, FiKey, FiCopy, FiInfo } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

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
  const shortNpub = `${profile.npub.slice(0, 14)}...${profile.npub.slice(-8)}`;

  const [npubCopied, setNpubCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const handleCopyNpub = () => {
    navigator.clipboard.writeText(profile.npub);
    setNpubCopied(true);
    setTimeout(() => setNpubCopied(false), 2000);
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const isProfileEmpty = !profile.about && !profile.displayName && !profile.name && !profile.picture;

  return (
    <div
      className={`
        relative rounded border border-brand-border bg-brand-surface/40
        p-6 backdrop-blur-sm animate-fade-in
        ${className}
      `}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <Avatar 
            src={profile.picture} 
            alt={displayName} 
            size={56} 
            initials={displayName[0]} 
          />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-brand-teal border border-brand-surface"
            aria-label="Agent online"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-lg tracking-tight truncate">
            {displayName}
          </h2>
          {profile.nip05 && (
            <p className="text-brand-teal text-xs font-mono-tech truncate flex items-center gap-1 mt-0.5">
              <FiCheck className="w-3 h-3" />
              <span>{profile.nip05}</span>
            </p>
          )}
        </div>

        <TrustBadge isVerified={isVerified} />
      </div>

      <div className="bg-brand-dark/40 border border-brand-border/60 rounded p-3 mb-5 flex items-center justify-between gap-2 font-mono-tech text-xs text-brand-muted">
        <div className="flex items-center gap-2 truncate">
          <span className="text-brand-orange text-[10px] uppercase font-semibold shrink-0">npub</span>
          <span className="opacity-85 truncate">{shortNpub}</span>
        </div>
        <button
          onClick={handleCopyNpub}
          className="text-brand-muted hover:text-white transition-colors shrink-0 p-1"
          title="Copy npub"
        >
          {npubCopied ? (
            <FiCheck className="w-3.5 h-3.5 text-brand-teal" />
          ) : (
            <FiCopy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {isProfileEmpty ? (
        <div className="flex gap-2.5 bg-brand-surface border border-brand-border rounded p-3.5 mb-5 text-[11px] leading-relaxed text-brand-muted">
          <FiInfo className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <div>
            <span className="text-zinc-300 font-semibold">New Nostr Identity: </span>
            No profile metadata found on relays. Edit your profile on{' '}
            <a href="https://snort.social" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">Snort</a>{' '}
            or{' '}
            <a href="https://coracle.social" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">Coracle</a>.
          </div>
        </div>
      ) : (
        profile.about && (
          <p className="text-zinc-300 text-xs leading-relaxed mb-5 line-clamp-3">
            {profile.about}
          </p>
        )
      )}

      {isVerified && wallet?.balanceSats !== undefined && wallet.address ? (
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 bg-brand-teal/5 border border-brand-teal/20 rounded p-3.5">
            <SiBitcoin className="w-5 h-5 text-brand-teal shrink-0" />
            <div>
              <p className="text-brand-teal font-semibold text-[10px] font-mono-tech uppercase tracking-wider">
                VERIFIED LIQUIDITY
              </p>
              <p className="text-white font-mono-tech font-bold text-sm mt-0.5">
                {(wallet.balanceSats / 100_000_000).toFixed(8)} BTC
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 border border-brand-border/40 rounded px-3 py-1.5 text-[10px] font-mono-tech text-brand-muted bg-brand-dark/10">
            <span className="truncate">ADDR: {wallet.address}</span>
            <button
              onClick={() => handleCopyAddress(wallet.address!)}
              className="hover:text-white transition-colors shrink-0 p-0.5"
              title="Copy address"
            >
              {addressCopied ? (
                <FiCheck className="w-3 h-3 text-brand-teal" />
              ) : (
                <FiCopy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-brand-surface/80 border border-brand-border rounded p-3.5">
          <SiBitcoin className="w-5 h-5 text-brand-muted shrink-0" />
          <div className="flex-1 text-xs">
            <span className="text-brand-muted">Wallet not verified — </span>
            <span className="text-brand-orange font-medium">Verify Wallet Ownership</span> to display balance.
          </div>
        </div>
      )}

      {profile.website && (
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-1.5 text-brand-muted text-[11px] font-mono-tech hover:text-brand-orange transition-colors truncate"
        >
          <FiGlobe className="w-3.5 h-3.5" />
          <span>{profile.website.replace(/(^\w+:|^)\/\//, '')}</span>
        </a>
      )}
    </div>
  );
}

function TrustBadge({ isVerified }: { isVerified: boolean }) {
  return (
    <div
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10px] font-mono-tech uppercase tracking-wider
        ${
          isVerified
            ? 'bg-brand-teal/5 text-brand-teal border-brand-teal/20'
            : 'bg-brand-orange/5 text-brand-orange border-brand-orange/20'
        }
      `}
      aria-label={isVerified ? 'Status: Verified' : 'Status: Authenticated'}
    >
      {isVerified ? (
        <FiCheck className="w-3.5 h-3.5 text-brand-teal" />
      ) : (
        <FiKey className="w-3.5 h-3.5 text-brand-orange" />
      )}
      <span>{isVerified ? 'Verified' : 'Auth'}</span>
    </div>
  );
}
