// src/app/profile/[npub]/page.tsx
// Daisy — integrates AgentProfileFull into Nathan's profile page shell
// Fetches agent data (live from Nostr + mock for demo)

import React from 'react';
import { notFound } from 'next/navigation';
import AgentProfileFull from '@/features/agents/AgentProfileFull';
import { MOCK_AGENTS } from '@/lib/mockAgents';
import { getReviewsForAgent } from '@/lib/mockReviews';

interface ProfilePageProps {
  params: { npub: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { npub } = params;

  // TODO (Nathan + Rico): replace mock lookup with:
  // 1. Fetch Kind 0 from Nostr relay (Nathan's nostrProfile.ts)
  // 2. Fetch trust score from Rico's indexer API
  // 3. Fetch reviews from Nostr relay (Rico's Story 2.1)
  const agent = MOCK_AGENTS.find((a) => a.npub === npub) ?? MOCK_AGENTS[0];
  if (!agent) notFound();

  const reviews = getReviewsForAgent(agent.npub);

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <AgentProfileFull agent={agent} reviews={reviews} />
      </div>
    </main>
  );
}
