'use client';

/**
 * src/components/shared/Navbar.tsx
 *
 * Top navigation bar — shows logo + auth state (login button or user npub)
 */

import React from 'react';
import Link from 'next/link';
import { useNostrAuth } from '@/hooks/useNostrAuth';

export function Navbar() {
  const { auth, logout } = useNostrAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-dark/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-xl text-white group-hover:text-brand-orange transition-colors">
            P2Pesa
          </span>
          <span className="hidden sm:block text-xs text-brand-muted mt-1">
            Trust on Bitcoin rails
          </span>
        </Link>

        {/* Auth state */}
        {auth.status === 'authenticated' && auth.npub ? (
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${auth.npub}`}
              className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-xl px-3 py-1.5 hover:border-brand-orange transition-all"
            >
              <span className="text-brand-orange text-sm">⚡</span>
              <span className="text-brand-light text-sm font-mono">
                {auth.npub.slice(0, 12)}...
              </span>
            </Link>
            <button
              onClick={logout}
              className="text-brand-muted text-sm hover:text-red-400 transition-colors"
              aria-label="Log out"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/"
            className="text-sm text-brand-orange border border-brand-orange/30 px-3 py-1.5 rounded-xl hover:bg-brand-orange/10 transition-all"
          >
            ⚡ Login
          </Link>
        )}
      </div>
    </nav>
  );
}
