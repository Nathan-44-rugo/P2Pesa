'use client';

// src/app/search/page.tsx
// Daisy — Story 3.1
// Agent discovery page

import React, { useMemo, useState } from 'react';
import { AgentSearchFilters } from '@/types/nostr';
import { MOCK_AGENTS, searchAgents } from '@/lib/mockAgents';
import AgentSearchFilter from '@/features/search/AgentSearchFilter';
import AgentCard from '@/features/agents/AgentCard';

const DEFAULT_FILTERS: AgentSearchFilters = {
  query: '',
  minTrustScore: 0,
  paymentMethods: [],
  sortBy: 'trust_score',
};

export default function SearchPage() {
  const [filters, setFilters] = useState<AgentSearchFilters>(DEFAULT_FILTERS);

  const results = useMemo(
    () => searchAgents(MOCK_AGENTS, filters.query, filters.minTrustScore, filters.paymentMethods, filters.sortBy),
    [filters]
  );

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Find a Bitcoin agent</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse verified P2P agents. Every trust score is computed from on-chain data and zap-backed reviews.
          </p>
        </div>

        {/* Filters */}
        <AgentSearchFilter filters={filters} onChange={setFilters} resultCount={results.length} />

        {/* Results */}
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((agent) => (
              <AgentCard key={agent.npub} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="border border-gray-800 border-dashed rounded-2xl p-12 text-center">
            <p className="text-gray-500">No agents match your filters.</p>
            <button
              type="button"
              className="mt-3 text-xs text-orange-400 hover:text-orange-300"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
