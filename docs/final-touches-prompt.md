# Master System Directive: P2Pesa Premium Reputation Layer Upgrade

You are an expert Next.js 16, TypeScript, Tailwind CSS, and Nostr/Bitcoin developer. Your objective is to review the P2Pesa codebase and apply a comprehensive technical and aesthetic upgrade to its decentralized reputation layer. 

This upgrade moves away from generic, high-contrast, glowing templates and establishes a highly professional, technical, and scholarly design language inspired directly by the Btrust Builders ecosystem (**btrust.tech**).

---

## 1. Core Principles & Benchmarks

### 1.1 Aesthetic & Styling Benchmark: Btrust (btrust.tech)
*   **Palette:** Subdue the color system. Use matte charcoals, ink-blacks, and clean graphite surfaces. Avoid deep purple/blue hues.
*   **Accents:** Replace vibrant neon colors with earthy, professional tones. Use flat copper/terracotta gold (`#DF762B`) for brand accents and deep forest sage/teal (`#318274`) for verified statuses.
*   **Geometry:** Remove large pill bubbles (`rounded-full`, `rounded-3xl` or `rounded-2xl`). Standardize on crisp, technical rectangular geometry (`rounded` or `rounded-sm` which translates to 2px/4px corner radiuses).
*   **Typography:** Emphasize clean sans-serif UI typography paired with precise, high-contrast monospace accents (`JetBrains Mono` / `font-mono-tech` class) for cryptographic hashes, keys, and values.
*   **Icons:** Remove all playful, colorful emojis. Replace them entirely with crisp, 1.5px/2px stroke minimalist icons from the **Feather Icons** library (`react-icons/fi`) and **Simple Icons** (`react-icons/si`) for Bitcoin.
*   **Layout Structure:** Use thin `1px` lines/grid-dividers to separate panels instead of floating cards with heavy glowing drop shadows.

### 1.2 Technical Directives
*   **Auto-Login (Session Persistence):** Persist the user's authenticated Nostr public key in local storage. Implement a brief delay (`500ms`) on boot before checking `window.nostr` to allow extension-injected content scripts (like Alby) to fully bind to the browser window.
*   **Stale-While-Revalidate (SWR) Profile Caching:** Fetch and parse Kind 0 profiles asynchronously. Cache the output in `localStorage` under a TTL (Time-to-Live) policy. If cached, serve the profile instantly (0ms load time) and run the network relay update silently in the background.
*   **Active Relay Connection Monitor:** Implement a subtle status monitor that pulls connected relays directly from the active `getNdk().pool` singleton to display live decentralized network connectivity.
*   **Copy-to-Clipboard Interactions:** Provide direct clipboard utility for both `npub` identities and verified Bitcoin addresses, with micro-interaction states (icons changing to a checkmark on success).

---

## 2. Upgrade Checklist & Target Files

Apply the premium upgrades to the following files by matching the provided implementations exactly:

1.  `p2pesa/src/app/globals.css` — Matte-charcoal color palette and typographic overrides.
2.  `p2pesa/src/app/page.tsx` — Technical layout, grid system, and clean Hero CTA.
3.  `p2pesa/src/app/layout.tsx` — Standardized viewport configurations and global wrapper layout.
4.  `p2pesa/src/components/shared/Navbar.tsx` — Clean, high-end navbar with Feather Icons.
5.  `p2pesa/src/components/shared/RelayStatus.tsx` — *New Component* to track live NDK relay connections.
6.  `p2pesa/src/components/ui/Avatar.tsx` — Replaces sunset gradients with a matte charcoal monogram fallback.
7.  `p2pesa/src/components/ui/Badge.tsx` — Crisp, rectangular tech tags instead of pill capsules.
8.  `p2pesa/src/context/NostrAuthContext.tsx` — Auto-reconnect persistence logic.
9.  `p2pesa/src/lib/nostrProfile.ts` — SWR LocalStorage profile cache engine.
10. `p2pesa/src/features/agents/AgentProfileCard.tsx` — Profile visualization, fallback empty states, and clipboard utilities.
11. `p2pesa/src/features/agents/NostrLoginButton.tsx` — Minimalist flat login state with loading indicators.
12. `p2pesa/src/features/agents/WalletVerificationStub.tsx` — Step-by-step wallet signing walkthrough and crisp input fields.

---

## 3. Core Implementation Reference Code

Please carefully overwrite or merge the target files with the verified code blocks below:

### 3.1 `p2pesa/src/app/globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-brand-dark: #0D0E11;
  --color-brand-surface: #14161C;
  --color-brand-border: #21242E;
  --color-brand-orange: #DF762B; 
  --color-brand-teal: #318274;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--color-brand-dark);
  color: #ECECED;
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: var(--color-brand-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--color-brand-border);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-brand-orange);
}

*:focus-visible {
  outline: 1.5px solid var(--color-brand-orange);
  outline-offset: 3px;
  border-radius: 1px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.grid-divider {
  border-color: var(--color-brand-border);
}

.font-mono-tech {
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.025em;
}
```

### 3.2 `p2pesa/src/app/page.tsx`
```tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NostrLoginButton } from '@/features/agents/NostrLoginButton';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { FiZap } from 'react-icons/fi';

export default function HomePage() {
  const { auth } = useNostrAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.status === 'authenticated' && auth.npub) {
      router.push(`/profile/${auth.npub}`);
    }
  }, [auth.status, auth.npub, router]);

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
          <NostrLoginButton />

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
```

### 3.3 `p2pesa/src/app/layout.tsx`
```tsx
import type { Metadata } from 'next';
import './globals.css';
import { NostrAuthProvider } from '@/context/NostrAuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { RelayStatus } from '@/components/shared/RelayStatus';

export const metadata: Metadata = {
  title: 'P2Pesa — Decentralized Reputation for Bitcoin Agents',
  description:
    'P2Pesa is a trustless reputation layer for Bitcoin and mobile money agents in Kenya. Verify identity via Nostr, prove liquidity via Bitcoin wallet signatures, and earn community trust through Zap-backed reviews.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-brand-dark antialiased flex flex-col">
        <NostrAuthProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-12 w-full">
            {children}
          </main>
          <footer className="max-w-5xl mx-auto px-4 sm:px-8 py-6 w-full border-t border-brand-border/40 flex justify-between items-center">
            <span className="text-[10px] font-mono-tech text-brand-muted uppercase">P2Pesa — Bitcoin++ 2026</span>
            <RelayStatus />
          </footer>
        </NostrAuthProvider>
      </body>
    </html>
  );
}
```

### 3.4 `p2pesa/src/components/shared/Navbar.tsx`
```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { FiZap, FiLogOut, FiUser } from 'react-icons/fi';

export function Navbar() {
  const { auth, logout } = useNostrAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-dark/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <FiZap className="w-5 h-5 text-brand-orange transition-transform group-hover:scale-105" />
          <span className="font-bold text-lg text-white tracking-tight group-hover:text-brand-orange transition-colors">
            P2Pesa
          </span>
          <span className="hidden sm:inline-block text-[10px] text-brand-muted font-mono-tech border-l border-brand-border pl-2.5 mt-0.5 uppercase tracking-wider">
            Reputation Rails
          </span>
        </Link>

        {auth.status === 'authenticated' && auth.npub ? (
          <div className="flex items-center gap-4">
            <Link
              href={`/profile/${auth.npub}`}
              className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded px-3 py-1.5 hover:border-brand-orange/60 transition-colors"
            >
              <FiUser className="w-3.5 h-3.5 text-brand-orange" />
              <span className="text-white text-xs font-mono-tech">
                {auth.npub.slice(0, 8)}...{auth.npub.slice(-4)}
              </span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-brand-muted text-xs hover:text-red-400 font-mono-tech uppercase tracking-wider transition-colors"
              aria-label="Log out"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono-tech uppercase tracking-wider text-brand-orange border border-brand-orange/30 rounded px-3 py-1.5 hover:bg-brand-orange/5 transition-colors"
          >
            <FiZap className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
```

### 3.5 `p2pesa/src/components/shared/RelayStatus.tsx`
```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getNdk } from '@/lib/nostr';
import { FiActivity } from 'react-icons/fi';

export function RelayStatus() {
  const [activeRelays, setActiveRelays] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ndk = getNdk();
      if (ndk?.pool) {
        const connected = Array.from(ndk.pool.relays.values())
          .filter((relay) => relay.status === 2 || relay.status === 1)
          .map((relay) => relay.url.replace('wss://', ''));
        setActiveRelays(connected);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-[10px] font-mono-tech text-brand-muted tracking-wide">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-teal"></span>
      </span>
      <div className="flex items-center gap-1">
        <FiActivity className="w-3 h-3 text-brand-teal" />
        <span>
          {activeRelays.length > 0 
            ? `CONNECTED: ${activeRelays[0]}` 
            : 'RESOLVING RELAYS...'}
        </span>
        {activeRelays.length > 1 && (
          <span className="opacity-60">(+{activeRelays.length - 1} more)</span>
        )}
      </div>
    </div>
  );
}
```

### 3.6 `p2pesa/src/components/ui/Avatar.tsx`
```tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  initials?: string;
  className?: string;
}

export function Avatar({
  src,
  alt,
  size = 48,
  initials = '?',
  className = '',
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const baseClasses = `object-cover border border-brand-border bg-brand-surface flex items-center justify-center ${className}`;

  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-sm ${baseClasses}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`rounded-sm text-brand-muted font-mono-tech ${baseClasses}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      aria-label={alt}
    >
      {initials && initials !== '?' ? (
        <span>{initials.slice(0, 2).toUpperCase()}</span>
      ) : (
        <FiUser className="text-brand-muted opacity-80" style={{ width: size * 0.45, height: size * 0.45 }} />
      )}
    </div>
  );
}
```

### 3.7 `p2pesa/src/components/ui/Badge.tsx`
```tsx
'use client';

import React from 'react';

type BadgeVariant = 'default' | 'verified' | 'authenticated' | 'warning' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-brand-orange/5 text-brand-orange border-brand-orange/20',
  verified: 'bg-brand-teal/5 text-brand-teal border-brand-teal/20',
  authenticated: 'bg-zinc-800/40 text-zinc-300 border-zinc-700/50',
  warning: 'bg-red-950/20 text-red-400 border-red-900/30',
  muted: 'bg-brand-surface text-brand-muted border-brand-border',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5 rounded
        text-[10px] font-mono-tech uppercase tracking-wider border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
```

### 3.8 `p2pesa/src/context/NostrAuthContext.tsx`
```tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import type { AuthState } from '@/types/nostr';
import {
  loginWithNip07,
  signOut as nostrSignOut,
} from '@/lib/nostr';
import { fetchNostrProfile } from '@/lib/nostrProfile';

interface NostrAuthContextValue {
  auth: AuthState;
  login: () => Promise<void>;
  logout: () => void;
}

const defaultAuth: AuthState = {
  status: 'idle',
  pubkey: null,
  npub: null,
  profile: null,
  error: null,
};

const NostrAuthContext = createContext<NostrAuthContextValue | null>(null);

export function NostrAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);

  const login = useCallback(async () => {
    setAuth({ ...defaultAuth, status: 'loading' });

    try {
      const { pubkey, npub } = await loginWithNip07();
      localStorage.setItem('p2pesa_active_pubkey', pubkey);

      setAuth({
        status: 'authenticated',
        pubkey,
        npub,
        profile: { pubkey, npub },
        error: null,
      });

      const result = await fetchNostrProfile(pubkey);
      if (result.data) {
        setAuth((prev) => ({
          ...prev,
          profile: result.data,
        }));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed';
      setAuth({
        status: 'error',
        pubkey: null,
        npub: null,
        profile: null,
        error: message,
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('p2pesa_active_pubkey');
    nostrSignOut();
    setAuth(defaultAuth);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedPubkey = localStorage.getItem('p2pesa_active_pubkey');
    if (savedPubkey && auth.status === 'idle') {
      const timer = setTimeout(() => {
        if ('nostr' in window) {
          login().catch(() => {
            localStorage.removeItem('p2pesa_active_pubkey');
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [login, auth.status]);

  return (
    <NostrAuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </NostrAuthContext.Provider>
  );
}

export function useNostrAuthContext(): NostrAuthContextValue {
  const ctx = useContext(NostrAuthContext);
  if (!ctx) {
    throw new Error(
      'useNostrAuthContext must be used within NostrAuthProvider'
    );
  }
  return ctx;
}
```

### 3.9 `p2pesa/src/lib/nostrProfile.ts`
```typescript
import { getNdk, connectNdk } from '@/lib/nostr';
import { nip19 } from 'nostr-tools';
import type { NostrProfile, ApiResponse } from '@/types/nostr';

const CACHE_PREFIX = 'p2pesa_profile_';
const CACHE_TTL = 1000 * 60 * 60 * 24;

function getCachedProfile(pubkey: string): NostrProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${pubkey}`);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as { profile: NostrProfile; timestamp: number };
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      return null;
    }
    return parsed.profile;
  } catch {
    return null;
  }
}

function setCachedProfile(pubkey: string, profile: NostrProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${pubkey}`,
      JSON.stringify({ profile, timestamp: Date.now() })
    );
  } catch {}
}

export function parseKind0Content(
  pubkey: string,
  contentJson: string
): NostrProfile | null {
  try {
    const data = JSON.parse(contentJson) as Record<string, string>;
    const npub = nip19.npubEncode(pubkey);

    return {
      pubkey,
      npub,
      name: data.name ?? undefined,
      displayName: data.display_name ?? data.displayName ?? undefined,
      picture: data.picture ?? undefined,
      about: data.about ?? undefined,
      website: data.website ?? undefined,
      lud16: data.lud16 ?? undefined,
      nip05: data.nip05 ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function fetchNostrProfile(
  pubkey: string
): Promise<ApiResponse<NostrProfile>> {
  const cached = getCachedProfile(pubkey);

  if (cached) {
    silentBackgroundFetch(pubkey);
    return { data: cached, error: null };
  }

  return fetchAndCacheDirect(pubkey);
}

async function fetchAndCacheDirect(pubkey: string): Promise<ApiResponse<NostrProfile>> {
  try {
    const ndk = await connectNdk();
    const event = await ndk.fetchEvent({
      kinds: [0],
      authors: [pubkey],
    });

    if (!event) {
      const fallbackProfile: NostrProfile = {
        pubkey,
        npub: nip19.npubEncode(pubkey),
        name: undefined,
        displayName: undefined,
        picture: undefined,
        about: undefined,
        website: undefined,
      };
      setCachedProfile(pubkey, fallbackProfile);
      return { data: fallbackProfile, error: null };
    }

    const profile = parseKind0Content(pubkey, event.content);
    if (!profile) {
      return { data: null, error: 'Failed to parse profile metadata' };
    }

    setCachedProfile(pubkey, profile);
    return { data: profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { data: null, error: `Failed to fetch profile: ${message}` };
  }
}

function silentBackgroundFetch(pubkey: string): void {
  fetchAndCacheDirect(pubkey).catch(() => {});
}

export function getDisplayName(profile: NostrProfile): string {
  return (
    profile.displayName ??
    profile.name ??
    `${profile.npub.slice(0, 8)}...${profile.npub.slice(-4)}`
  );
}
```

### 3.10 `p2pesa/src/features/agents/AgentProfileCard.tsx`
```tsx
'use client';

import React, { useState } from 'react';
import type { NostrProfile, WalletVerification } from '@/types/nostr';
import { getDisplayName } from '@/lib/nostrProfile';
import { Avatar } from '@/components/ui/Avatar';
import { FiGlobe, FiCheck, FiKey, FiCopy, FiInfo } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

interface AgentProfileCardProps {
  profile: NostrProfile;
  wallet?: WalletVerification;
  className?: string;
}

export function AgentProfileCard({
  profile,
  wallet,
  className = '',
}: AgentProfileCardProps) {
  const displayName = getDisplayName(profile);
  const isVerified = wallet?.status === 'verified';
  const shortNpub = `${profile.npub.slice(0, 14)}...${profile.npub.slice(-8)}`;

  const [npubCopied, setNpubCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  const handleCopyNpub = () => {
    navigator.clipboard.writeText(profile.npub);
    setNpubCopied(true);
    setTimeout(() => setNpubCopied(false), 2000);
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const isProfileEmpty = !profile.about && !profile.displayName && !profile.name && !profile.picture;

  return (
    <div
      className={`
        relative rounded border border-brand-border bg-brand-surface/40
        p-6 backdrop-blur-sm animate-fade-in
        ${className}
      `}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <Avatar 
            src={profile.picture} 
            alt={displayName} 
            size={56} 
            initials={displayName[0]} 
          />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-brand-teal border border-brand-surface"
            aria-label="Agent online"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-lg tracking-tight truncate">
            {displayName}
          </h2>
          {profile.nip05 && (
            <p className="text-brand-teal text-xs font-mono-tech truncate flex items-center gap-1 mt-0.5">
              <FiCheck className="w-3 h-3" />
              <span>{profile.nip05}</span>
            </p>
          )}
        </div>

        <TrustBadge isVerified={isVerified} />
      </div>

      <div className="bg-brand-dark/40 border border-brand-border/60 rounded p-3 mb-5 flex items-center justify-between gap-2 font-mono-tech text-xs text-brand-muted">
        <div className="flex items-center gap-2 truncate">
          <span className="text-brand-orange text-[10px] uppercase font-semibold shrink-0">npub</span>
          <span className="opacity-85 truncate">{shortNpub}</span>
        </div>
        <button
          onClick={handleCopyNpub}
          className="text-brand-muted hover:text-white transition-colors shrink-0 p-1"
          title="Copy npub"
        >
          {npubCopied ? (
            <FiCheck className="w-3.5 h-3.5 text-brand-teal" />
          ) : (
            <FiCopy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {isProfileEmpty ? (
        <div className="flex gap-2.5 bg-brand-surface border border-brand-border rounded p-3.5 mb-5 text-[11px] leading-relaxed text-brand-muted">
          <FiInfo className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <div>
            <span className="text-zinc-300 font-semibold">New Nostr Identity: </span>
            No profile metadata found on relays. Edit your profile on{' '}
            <a href="https://snort.social" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">Snort</a>{' '}
            or{' '}
            <a href="https://coracle.social" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline font-semibold">Coracle</a>.
          </div>
        </div>
      ) : (
        profile.about && (
          <p className="text-zinc-300 text-xs leading-relaxed mb-5 line-clamp-3">
            {profile.about}
          </p>
        )
      )}

      {isVerified && wallet?.balanceSats !== undefined && wallet.address ? (
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 bg-brand-teal/5 border border-brand-teal/20 rounded p-3.5">
            <SiBitcoin className="w-5 h-5 text-brand-teal shrink-0" />
            <div>
              <p className="text-brand-teal font-semibold text-[10px] font-mono-tech uppercase tracking-wider">
                VERIFIED LIQUIDITY
              </p>
              <p className="text-white font-mono-tech font-bold text-sm mt-0.5">
                {(wallet.balanceSats / 100_000_000).toFixed(8)} BTC
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 border border-brand-border/40 rounded px-3 py-1.5 text-[10px] font-mono-tech text-brand-muted bg-brand-dark/10">
            <span className="truncate">ADDR: {wallet.address}</span>
            <button
              onClick={() => handleCopyAddress(wallet.address!)}
              className="hover:text-white transition-colors shrink-0 p-0.5"
              title="Copy address"
            >
              {addressCopied ? (
                <FiCheck className="w-3 h-3 text-brand-teal" />
              ) : (
                <FiCopy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-brand-surface/80 border border-brand-border rounded p-3.5">
          <SiBitcoin className="w-5 h-5 text-brand-muted shrink-0" />
          <div className="flex-1 text-xs">
            <span className="text-brand-muted">Wallet not verified — </span>
            <span className="text-brand-orange font-medium">Verify Wallet Ownership</span> to display balance.
          </div>
        </div>
      )}

      {profile.website && (
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-1.5 text-brand-muted text-[11px] font-mono-tech hover:text-brand-orange transition-colors truncate"
        >
          <FiGlobe className="w-3.5 h-3.5" />
          <span>{profile.website.replace(/(^\w+:|^)\/\//, '')}</span>
        </a>
      )}
    </div>
  );
}

function TrustBadge({ isVerified }: { isVerified: boolean }) {
  return (
    <div
      className={`
        flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[10px] font-mono-tech uppercase tracking-wider
        ${
          isVerified
            ? 'bg-brand-teal/5 text-brand-teal border-brand-teal/20'
            : 'bg-brand-orange/5 text-brand-orange border-brand-orange/20'
        }
      `}
      aria-label={isVerified ? 'Status: Verified' : 'Status: Authenticated'}
    >
      {isVerified ? (
        <FiCheck className="w-3.5 h-3.5 text-brand-teal" />
      ) : (
        <FiKey className="w-3.5 h-3.5 text-brand-orange" />
      )}
      <span>{isVerified ? 'Verified' : 'Auth'}</span>
    </div>
  );
}
```

### 3.11 `p2pesa/src/features/agents/NostrLoginButton.tsx`
```tsx
'use client';

import React from 'react';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { FiZap, FiLoader, FiAlertCircle } from 'react-icons/fi';

interface NostrLoginButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export function NostrLoginButton({
  onSuccess,
  className = '',
}: NostrLoginButtonProps) {
  const { auth, login } = useNostrAuth();

  const handleLogin = async () => {
    await login();
    if (auth.status === 'authenticated' && onSuccess) {
      onSuccess();
    }
  };

  const isLoading = auth.status === 'loading';

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm">
      <button
        id="nostr-login-btn"
        onClick={handleLogin}
        disabled={isLoading}
        className={`
          w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded
          bg-brand-orange text-white font-mono-tech font-bold text-sm uppercase tracking-wider
          transition-colors duration-200
          hover:bg-brand-orange/90 active:bg-brand-orange/85
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        aria-label="Log in with Nostr browser extension"
      >
        {isLoading ? (
          <FiLoader className="w-4 h-4 animate-spin text-white" />
        ) : (
          <FiZap className="w-4 h-4 text-white" />
        )}

        <span>
          {isLoading ? 'Connecting...' : 'Log in with Nostr'}
        </span>
      </button>

      {auth.status === 'error' && auth.error && (
        <div
          role="alert"
          className="w-full flex items-start gap-2.5 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded p-3 text-left animate-fade-in font-mono-tech"
        >
          <FiAlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            {auth.error.includes('NIP-07') ? (
              <span>
                NIP-07 extension missing.{' '}
                <a
                  href="https://getalby.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-red-300"
                >
                  Install Alby
                </a>
              </span>
            ) : (
              <span>{auth.error}</span>
            )}
          </div>
        </div>
      )}

      {auth.status === 'idle' && (
        <p className="text-brand-muted text-[11px] font-mono-tech text-center tracking-wide leading-relaxed">
          Requires a NIP-07 browser utility (e.g.{' '}
          <a
            href="https://getalby.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange hover:underline font-semibold"
          >
            Alby
          </a>
          )
        </p>
      )}
    </div>
  );
}
```

### 3.12 `p2pesa/src/features/agents/WalletVerificationStub.tsx`
```tsx
'use client';

import React, { useState } from 'react';
import type { WalletVerification } from '@/types/nostr';
import { generateChallenge, completeWalletVerification } from '@/lib/bitcoin';
import { FiCheckCircle, FiLoader, FiLock, FiInfo, FiCopy, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

interface WalletVerificationStubProps {
  npub: string;
  onVerified?: (verification: WalletVerification) => void;
  className?: string;
}

export function WalletVerificationStub({
  npub,
  onVerified,
  className = '',
}: WalletVerificationStubProps) {
  const [step, setStep] = useState<'idle' | 'challenge' | 'signing' | 'done'>(
    'idle'
  );
  const [challenge] = useState(() => generateChallenge(npub));
  const [address, setAddress] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [showGuide, setShowGuide] = useState(false);
  const [copiedChallenge, setCopiedChallenge] = useState(false);

  const handleStartVerification = () => {
    setStep('challenge');
    setError(null);
  };

  const handleCopyChallenge = () => {
    navigator.clipboard.writeText(challenge);
    setCopiedChallenge(true);
    setTimeout(() => setCopiedChallenge(false), 2000);
  };

  const handleSubmitSignature = async () => {
    if (!address.trim() || !signature.trim()) {
      setError('Please provide both your wallet address and signature.');
      return;
    }

    setStep('signing');
    setError(null);

    try {
      const result = await completeWalletVerification(
        address.trim(),
        signature.trim(),
        challenge
      );

      if (result.error || !result.data || result.data.status !== 'verified') {
        setError(result.error ?? 'Verification failed.');
        setStep('challenge');
        return;
      }

      onVerified?.(result.data);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setStep('challenge');
    }
  };

  if (step === 'done') {
    return (
      <div className={`rounded bg-brand-teal/5 border border-brand-teal/20 p-4.5 ${className}`}>
        <div className="flex items-start gap-3">
          <FiCheckCircle className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <div>
            <p className="text-brand-teal font-bold text-sm tracking-tight">Wallet Ownership Confirmed</p>
            <p className="text-brand-muted text-xs leading-relaxed mt-0.5">
              Your cryptographic proof has been successfully verified against your active identity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded border border-brand-border bg-brand-surface/40 p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <SiBitcoin className="w-4 h-4 text-brand-orange" />
        <h3 className="text-white font-semibold text-sm tracking-tight uppercase font-mono-tech">Verify Wallet Ownership</h3>
        <span className="ml-auto text-[9px] font-mono-tech text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-2 py-0.5 rounded">
          STORY 1.2 — FRANCIS
        </span>
      </div>

      <p className="text-brand-muted text-xs leading-relaxed mb-5">
        Prove ownership of a Bitcoin wallet to transition to &quot;Active/Verified&quot; status, showing cryptographic liquidity to traders on the platform.
      </p>

      {step === 'idle' && (
        <button
          id="verify-wallet-btn"
          onClick={handleStartVerification}
          className="w-full py-3 px-4 rounded border border-brand-orange/30 bg-brand-orange/5 text-brand-orange font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-brand-orange/15 transition-colors"
        >
          Verify Wallet Ownership
        </button>
      )}

      {(step === 'challenge' || step === 'signing') && (
        <div className="space-y-4 font-mono-tech text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-brand-muted text-[10px] uppercase font-bold tracking-wider block">
                Message to Sign
              </label>
              <button
                onClick={handleCopyChallenge}
                className="text-brand-orange hover:text-white transition-colors flex items-center gap-1 text-[10px]"
              >
                {copiedChallenge ? (
                  <>
                    <FiCheck className="w-3 h-3 text-brand-teal" />
                    <span className="text-brand-teal">Copied</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-brand-dark/50 border border-brand-border rounded p-3 text-brand-light break-all select-all leading-relaxed">
              {challenge}
            </div>
          </div>

          <div className="border border-brand-border bg-brand-dark/20 rounded overflow-hidden">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-brand-surface/45 transition-colors"
            >
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-zinc-400">
                <FiInfo className="w-3.5 h-3.5 text-brand-orange" />
                <span>How to sign this challenge?</span>
              </span>
              {showGuide ? <FiChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <FiChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
            </button>
            
            {showGuide && (
              <div className="px-3 pb-3 border-t border-brand-border/40 text-[11px] leading-relaxed text-brand-muted space-y-2 mt-2">
                <p>1. Copy the <span className="text-white font-semibold">Message to Sign</span> above.</p>
                <p>2. Open any standard Bitcoin Wallet (e.g., Sparrow, BlueWallet, Electrum, or Alby).</p>
                <p>3. Go to <span className="text-white font-semibold">Tools / Sign Message</span>. Paste this challenge text, select your address, and click <span className="text-white font-semibold">Sign</span>.</p>
                <p>4. Copy the resulting base64 signature string and paste it along with your address below.</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="wallet-address" className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-1 block">
              Bitcoin Address
            </label>
            <input
              id="wallet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="bc1q... or 1Abc... or 3Xyz..."
              className="w-full bg-brand-dark border border-brand-border rounded px-3 py-2 text-white text-xs placeholder-brand-border focus:outline-none focus:border-brand-orange/50 transition-colors font-mono-tech"
            />
          </div>

          <div>
            <label htmlFor="wallet-signature" className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-1 block">
              Signature (base64)
            </label>
            <textarea
              id="wallet-signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Paste base64 signature string..."
              rows={2}
              className="w-full bg-brand-dark border border-brand-border rounded px-3 py-2 text-white text-xs placeholder-brand-border focus:outline-none focus:border-brand-orange/50 transition-colors resize-none leading-relaxed font-mono-tech"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-950/25 border border-red-900/30 rounded p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmitSignature}
            disabled={step === 'signing'}
            className="w-full py-3 px-4 rounded bg-brand-orange text-white font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {step === 'signing' ? (
              <>
                <FiLoader className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <FiLock className="w-3.5 h-3.5" />
                <span>Submit & Verify</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Operational Instructions

To apply this setup seamlessly without compilation warnings or runtime discrepancies:

1.  **Dependencies Setup:** Ensure that `react-icons` is installed in the workspace. Run:
    ```bash
    npm install react-icons
    ```
2.  **Next.js Dev Warning Check:** Check if the development server throws `[MODULE_TYPELESS_PACKAGE_JSON]` warnings. If it does, ensure `next.config.js` has been cleanly renamed to `next.config.mjs` to resolve dynamic reparsing overheads safely.
3.  **Cache Invalidation:** Immediately after implementing these file edits, clear the Webpack caching system by deleting the local build output folder:
    ```bash
    # Windows Command Prompt
    rmdir /s /q .next
    
    # macOS / Linux / Bash
    rm -rf .next
    ```
4.  **Execute Dev Server:** Start up the server and confirm layout and functionality are restored:
    ```bash
    npm run dev
    ```
