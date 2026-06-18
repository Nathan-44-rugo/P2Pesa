'use client';

import React from 'react';
import Link from 'next/link';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { FiZap, FiLogOut, FiUser } from 'react-icons/fi';
import { RelayStatus } from './RelayStatus';

export function Navbar() {
  const { auth, logout, demoMode, toggleDemoMode } = useNostrAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-dark/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <FiZap className="w-5 h-5 text-brand-orange transition-transform group-hover:scale-105" />
          <span className="font-bold text-lg text-white tracking-tight group-hover:text-brand-orange transition-colors">
            P2Pesa
          </span>
          <div className="hidden lg:flex items-center border-l border-brand-border ml-4 pl-4 h-6">
            <RelayStatus />
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDemoMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono-tech uppercase tracking-wider transition-all duration-300 border ${
              demoMode
                ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-brand-surface border-brand-border text-brand-muted hover:border-amber-500/50 hover:text-amber-400/80'
            }`}
            title="Toggle Demo Mode"
          >
            <FiZap className={`w-3.5 h-3.5 ${demoMode ? 'fill-current text-amber-400' : ''}`} />
            <span>{demoMode ? 'Demo Active' : 'Demo Mode'}</span>
          </button>

          {auth.status === 'authenticated' && auth.npub ? (
            <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
}
