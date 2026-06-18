'use client';

// src/app/profile/[npub]/page.tsx
// Updated to handle live auth state for "isOwnProfile" logic

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AgentProfileFull from '@/features/agents/AgentProfileFull';
import { MOCK_AGENTS } from '@/lib/mockAgents';
import { getReviewsForAgent } from '@/lib/mockReviews';
import { fetchNostrProfile } from '@/lib/nostrProfile';
import { npubToPubkey } from '@/lib/nostr';
import { AgentProfile, Review } from '@/types/nostr';
import { useNostrAuth } from '@/hooks/useNostrAuth';

export default function ProfilePage() {
  const params = useParams();
  const npub = params.npub as string;
  const { auth } = useNostrAuth();

  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const resolvedAgent = await resolveAgent(npub);
      setAgent(resolvedAgent);
      setReviews(getReviewsForAgent(npub));
      setLoading(false);
    }
    loadData();
  }, [npub]);

  if (loading || !agent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwnProfile = auth.status === 'authenticated' && auth.npub === npub;

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <AgentProfileFull 
          agent={agent} 
          reviews={reviews} 
          isOwnProfile={isOwnProfile} 
        />
      </div>
    </main>
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
      about: 'This profile is linked to the signed-in Nostr identity. Reputation data will appear after wallet verification and zap-backed reviews.',
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
