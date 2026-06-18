// src/app/profile/[npub]/page.tsx
// Daisy — integrates AgentProfileFull into Nathan's profile page shell
// Fetches agent data (live from Nostr + mock for demo)

import React from 'react';
import AgentProfileFull from '@/features/agents/AgentProfileFull';
import { MOCK_AGENTS } from '@/lib/mockAgents';
import { getReviewsForAgent } from '@/lib/mockReviews';
import { fetchNostrProfile } from '@/lib/nostrProfile';
import { npubToPubkey } from '@/lib/nostr';
import { AgentProfile } from '@/types/nostr';

interface ProfilePageProps {
  params: Promise<{ npub: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { npub } = await params;

  // TODO (Nathan + Rico): replace mock lookup with:
  // 1. Fetch Kind 0 from Nostr relay (Nathan's nostrProfile.ts)
  // 2. Fetch trust score from Rico's indexer API
  // 3. Fetch reviews from Nostr relay (Rico's Story 2.1)
  const agent = await resolveAgent(npub);

  const reviews = getReviewsForAgent(agent.npub);

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <AgentProfileFull agent={agent} reviews={reviews} />
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
