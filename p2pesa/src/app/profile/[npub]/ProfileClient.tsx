'use client';

// src/app/profile/[npub]/ProfileClient.tsx
// Client-side profile resolver.
// Relay fetches run in the browser (WebSocket) so real profiles load on Vercel,
// where serverless functions cannot hold open relay connections.

import React, { useEffect, useState } from 'react';
import AgentProfileFull from '@/features/agents/AgentProfileFull';
import { MOCK_AGENTS } from '@/lib/mockAgents';
import { getReviewsForAgent } from '@/lib/mockReviews';
import { fetchNostrProfile } from '@/lib/nostrProfile';
import { npubToPubkey } from '@/lib/nostr';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { AgentProfile, Review } from '@/types/nostr';

interface ProfileClientProps {
  npub: string;
}

export default function ProfileClient({ npub }: ProfileClientProps) {
  const { auth } = useNostrAuth();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const resolved = await resolveAgent(npub);
      if (cancelled) return;
      setAgent(resolved);
      setReviews(getReviewsForAgent(resolved.npub));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [npub]);

  const isOwnProfile = auth.status === 'authenticated' && auth.npub === npub;

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {loading || !agent ? (
          <ProfileSkeleton />
        ) : (
          <AgentProfileFull agent={agent} reviews={reviews} isOwnProfile={isOwnProfile} />
        )}
      </div>
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Loading profile">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-brand-surface" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-1/2 bg-brand-surface rounded" />
          <div className="h-4 w-1/3 bg-brand-surface rounded" />
        </div>
      </div>
      <div className="h-24 bg-brand-surface rounded-2xl" />
      <div className="h-40 bg-brand-surface rounded-2xl" />
    </div>
  );
}

async function resolveAgent(npub: string): Promise<AgentProfile> {
  const demoAgent = MOCK_AGENTS.find((a) => a.npub === npub);
  if (demoAgent) return demoAgent;

  const decoded = npubToPubkey(npub);
  if (!decoded.data) return createFallbackAgent(npub);

  const profile = await fetchNostrProfile(decoded.data);
  return createFallbackAgent(npub, decoded.data, profile.data ?? undefined);
}

function createFallbackAgent(
  npub: string,
  pubkey = npub,
  nostrProfile?: AgentProfile['nostrProfile']
): AgentProfile {
  return {
    npub,
    nostrProfile: nostrProfile ?? {
      npub,
      pubkey,
      display_name: 'Nostr Agent',
      about:
        'This profile is linked to the signed-in Nostr identity. Reputation data will appear after wallet verification and zap-backed reviews.',
    },
    walletVerification: {
      status: 'unverified',
    },
    trustScore: {
      total: 0,
      reviewCount: 0,
      tradeCount: 0,
      disputeCount: 0,
      zapVolumeSats: 0,
    },
    paymentMethods: [],
  };
}
