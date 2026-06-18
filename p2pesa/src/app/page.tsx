'use client';

/**
 * src/app/page.tsx — Landing / Login page
 *
 * AC1: Shows "Log in with Nostr" button
 * AC3: Redirects to /profile/[npub] after successful login
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NostrLoginButton } from '@/features/agents/NostrLoginButton';
import { useNostrAuth } from '@/hooks/useNostrAuth';

export default function HomePage() {
  const { auth } = useNostrAuth();
  const router = useRouter();

  // AC3: Redirect to profile page when authenticated
  useEffect(() => {
    if (auth.status === 'authenticated' && auth.npub) {
      router.push(`/profile/${auth.npub}`);
    }
  }, [auth.status, auth.npub, router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full px-4 py-1.5 mb-8 text-sm text-brand-orange">
          <span>⚡</span>
          <span>Bitcoin++ Hackathon 2026 — Nairobi, Kenya</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4 leading-tight">
          Trust on{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
            Bitcoin
          </span>{' '}
          Rails
        </h1>

        <p className="text-xl text-brand-muted mb-4 max-w-lg mx-auto">
          Decentralized reputation for mobile money agents. No KYC. No middlemen. Just cryptographic proof.
        </p>

        <blockquote className="text-brand-light italic text-lg mb-10 border-l-2 border-brand-orange pl-4 text-left mx-auto max-w-md">
          &ldquo;Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn&apos;t have to be.&rdquo;
        </blockquote>

        {/* Login CTA */}
        <div className="flex flex-col items-center gap-6">
          <NostrLoginButton />

          <div className="flex items-center gap-6 text-brand-muted text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse-slow" />
              <span>Self-sovereign identity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse-slow" />
              <span>Bitcoin-verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow" />
              <span>Zap-gated reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-20 w-full max-w-3xl">
        <h2 className="text-center text-brand-muted text-sm font-semibold uppercase tracking-wider mb-8">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PillarCard
            icon="🔑"
            title="1. Nostr Identity"
            description="Log in with your Nostr keypair. Your reputation is portable — tied to your key, not P2Pesa."
            accent="orange"
          />
          <PillarCard
            icon="₿"
            title="2. Prove Liquidity"
            description="Sign a challenge with your Bitcoin wallet. Cryptographic proof you own the funds you're trading."
            accent="teal"
          />
          <PillarCard
            icon="⚡"
            title="3. Earn Trust"
            description="Community reviews backed by Lightning Zaps. Sybil-resistant by design — fake reviews cost real sats."
            accent="gold"
          />
        </div>
      </div>
    </div>
  );
}

function PillarCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: string;
  title: string;
  description: string;
  accent: 'orange' | 'teal' | 'gold';
}) {
  const accentStyles = {
    orange: 'border-brand-orange/20 hover:border-brand-orange/40',
    teal: 'border-brand-teal/20 hover:border-brand-teal/40',
    gold: 'border-amber-400/20 hover:border-amber-400/40',
  };

  return (
    <div
      className={`
        bg-brand-surface border rounded-2xl p-5
        transition-all duration-300 hover:-translate-y-1
        ${accentStyles[accent]}
      `}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}
