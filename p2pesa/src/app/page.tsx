'use client';

import React from 'react';
import Link from 'next/link';
import { NostrLoginButton } from '@/features/agents/NostrLoginButton';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { FiZap, FiSearch, FiUser } from 'react-icons/fi';

export default function HomePage() {
  const { auth } = useNostrAuth();
  const isAuthenticated = auth.status === 'authenticated' && !!auth.npub;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 border border-brand-border bg-brand-surface/50 rounded px-3 py-1 mb-8 text-xs font-medium tracking-wide text-brand-orange uppercase font-mono-tech">
          <span>⚡</span>
          <span>Bitcoin++ Hackathon 2026 — Nairobi, Kenya</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
          Trust on <span className="text-brand-orange">Bitcoin</span> Rails
        </h1>

        <p className="text-base sm:text-lg text-brand-muted mb-8 max-w-lg mx-auto leading-relaxed">
          Decentralized reputation for mobile money agents. No KYC. No middlemen. Protected by cryptographic proofs.
        </p>

        <blockquote className="text-brand-muted italic text-sm mb-12 border-l border-brand-orange/60 pl-4 text-left mx-auto max-w-md">
          &ldquo;Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn&apos;t have to be.&rdquo;
        </blockquote>

        <div className="flex flex-col items-center gap-6">
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/search"
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-brand-orange text-black font-semibold text-sm hover:bg-brand-orange/90 transition-colors"
              >
                <FiSearch className="w-4 h-4" />
                <span>Browse Agents</span>
              </Link>
              <Link
                href={`/profile/${auth.npub}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded border border-brand-border bg-brand-surface text-white font-semibold text-sm hover:border-brand-orange/60 transition-colors"
              >
                <FiUser className="w-4 h-4 text-brand-orange" />
                <span>My Profile</span>
              </Link>
            </div>
          ) : (
            <NostrLoginButton />
          )}

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-brand-muted text-xs font-mono-tech">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
              <span>Self-sovereign identity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
              <span>Bitcoin-verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <span>Zap-gated reviews</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 w-full max-w-4xl border-t border-brand-border pt-12">
        <h2 className="text-center text-brand-muted text-xs font-bold uppercase tracking-widest mb-10 font-mono-tech">
          SYSTEM ARCHITECTURE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-border">
          <PillarCard
            number="01"
            title="Nostr Identity"
            description="Authenticate using your self-held Nostr keys. Your reputation remains yours — portable across any application."
          />
          <PillarCard
            number="02"
            title="Prove Liquidity"
            description="Sign a cryptographic challenge with your on-chain Bitcoin wallet to prove ownership of trade capital."
          />
          <PillarCard
            number="03"
            title="Earn Trust"
            description="Receive community scores locked to Lightning micro-payments. Sybil-resistant and verified by real sats."
          />
        </div>
      </div>
    </div>
  );
}

function PillarCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-brand-dark p-6 flex flex-col justify-between transition-colors hover:bg-brand-surface/40">
      <div>
        <div className="text-xs font-mono-tech text-brand-orange mb-4">{number}</div>
        <h3 className="text-white font-medium text-base mb-2">{title}</h3>
        <p className="text-brand-muted text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
