'use client';

// src/app/search/page.tsx
// Polished Search Page with brand styling

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
    <main className="min-h-screen bg-brand-dark text-gray-100">
      {/* Hero Header */}
      <div className="bg-brand-surface/40 border-b border-brand-border py-12 mb-10">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Find an Agent</h1>
          <p className="text-brand-muted text-sm mt-2 max-w-lg">
            Discover verified P2P agents across Kenya. Reputation is mathematically secured by on-chain proofs and zap-backed reviews.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20 space-y-10">
        {/* Filters */}
        <div className="bg-brand-surface/60 border border-brand-border rounded-2xl p-6 shadow-xl">
          <AgentSearchFilter filters={filters} onChange={setFilters} resultCount={results.length} />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 animate-fade-in">
              {results.map((agent) => (
                <AgentCard key={agent.npub} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="border border-brand-border border-dashed rounded-2xl p-16 text-center bg-brand-surface/20">
              <div className="text-4xl mb-4 opacity-20">🔍</div>
              <p className="text-brand-muted text-sm">No agents match your current filters.</p>
              <button
                type="button"
                className="mt-4 text-xs font-mono-tech text-brand-orange hover:text-white uppercase tracking-wider transition-colors"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
