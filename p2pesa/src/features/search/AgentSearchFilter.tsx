'use client';

// src/features/search/AgentSearchFilter.tsx
// Daisy — Story 3.1

import React from 'react';
import { AgentSearchFilters, PaymentMethod, SortOption } from '@/types/nostr';

interface AgentSearchFilterProps {
  filters: AgentSearchFilters;
  onChange: (f: AgentSearchFilters) => void;
  resultCount: number;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'airtel_money', label: 'Airtel Money' },
  { value: 'bank_transfer', label: 'Bank' },
  { value: 'cash', label: 'Cash' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'trust_score', label: 'Trust score' },
  { value: 'trade_count', label: 'Most trades' },
  { value: 'review_count', label: 'Most reviews' },
];

const SCORE_THRESHOLDS = [
  { value: 0, label: 'Any' },
  { value: 50, label: '50+' },
  { value: 70, label: '70+' },
  { value: 85, label: '85+' },
];

export default function AgentSearchFilter({ filters, onChange, resultCount }: AgentSearchFilterProps) {
  function togglePayment(method: PaymentMethod) {
    const current = filters.paymentMethods;
    const next = current.includes(method) ? current.filter((m) => m !== method) : [...current, method];
    onChange({ ...filters, paymentMethods: next });
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
        <input
          type="search"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="Search by name, location…"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 items-start">
        {/* Min trust score */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">Min score</span>
          <div className="flex gap-1">
            {SCORE_THRESHOLDS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...filters, minTrustScore: value })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  filters.minTrustScore === value
                    ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">Sort</span>
          <select
            className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1 text-xs text-gray-300 focus:outline-none focus:border-orange-500"
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Payment method chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Accepts</span>
        {PAYMENT_OPTIONS.map(({ value, label }) => {
          const active = filters.paymentMethods.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => togglePayment(value)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                active
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-600">
        {resultCount} {resultCount === 1 ? 'agent' : 'agents'} found
      </p>
    </div>
  );
}
