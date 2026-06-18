'use client';

// src/features/search/AgentSearchFilter.tsx
// Polished Search Filter with brand styling

import React from 'react';
import { AgentSearchFilters, PaymentMethod, SortOption } from '@/types/nostr';
import { FiSearch, FiSliders } from 'react-icons/fi';

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
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
        <input
          type="search"
          className="w-full bg-brand-dark border border-brand-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-brand-light placeholder-brand-muted focus:outline-none focus:border-brand-orange/50 transition-colors shadow-inner font-mono-tech"
          placeholder="Search agents by name or location…"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2 border-t border-brand-border/30">
        {/* Filters Group */}
        <div className="flex flex-wrap gap-6">
          {/* Min trust score */}
          <div className="space-y-2">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-widest block font-mono-tech">
              Min Trust Score
            </span>
            <div className="flex gap-1.5">
              {SCORE_THRESHOLDS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange({ ...filters, minTrustScore: value })}
                  className={`px-3 py-1.5 rounded border text-[11px] font-mono-tech transition-all ${
                    filters.minTrustScore === value
                      ? 'border-brand-orange bg-brand-orange/10 text-brand-orange font-bold shadow-[0_0_10px_rgba(247,147,26,0.1)]'
                      : 'border-brand-border bg-brand-dark/40 text-brand-muted hover:border-brand-muted hover:text-brand-light'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-widest block font-mono-tech">
              Sort By
            </span>
            <div className="relative inline-block">
              <select
                className="appearance-none bg-brand-dark border border-brand-border rounded px-3 py-1.5 pr-8 text-[11px] text-brand-light focus:outline-none focus:border-brand-orange/50 font-mono-tech cursor-pointer transition-colors"
                value={filters.sortBy}
                onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <FiSliders className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted w-3 h-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Result count */}
        <div className="md:text-right">
           <p className="text-[10px] text-brand-muted font-mono-tech uppercase tracking-widest">
            Results Found
          </p>
          <p className="text-xl font-bold text-white font-mono-tech">
            {resultCount.toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Payment method chips */}
      <div className="pt-4 border-t border-brand-border/30">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-brand-muted font-bold uppercase tracking-widest font-mono-tech mr-1">
            Accepts:
          </span>
          {PAYMENT_OPTIONS.map(({ value, label }) => {
            const active = filters.paymentMethods.includes(value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => togglePayment(value)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono-tech border transition-all uppercase tracking-tight ${
                  active
                    ? 'border-brand-teal bg-brand-teal/10 text-brand-teal font-bold shadow-[0_0_8px_rgba(0,191,165,0.1)]'
                    : 'border-brand-border bg-brand-dark/40 text-brand-muted hover:border-brand-muted hover:text-brand-light'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
