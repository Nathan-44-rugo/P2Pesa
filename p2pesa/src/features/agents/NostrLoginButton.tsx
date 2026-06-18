'use client';

/**
 * src/features/agents/NostrLoginButton.tsx
 *
 * "Log in with Nostr" button — NIP-07 extension login trigger.
 * Displays different states: idle, loading, error.
 */

import React from 'react';
import { useNostrAuth } from '@/hooks/useNostrAuth';

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
    <div className="flex flex-col items-center gap-3">
      <button
        id="nostr-login-btn"
        onClick={handleLogin}
        disabled={isLoading}
        className={`
          group relative flex items-center gap-3 px-8 py-4 rounded-2xl
          bg-gradient-to-r from-brand-orange to-amber-500
          text-white font-semibold text-lg
          shadow-lg shadow-brand-orange/30
          hover:shadow-xl hover:shadow-brand-orange/50
          hover:scale-105 active:scale-95
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
          transition-all duration-300 ease-out
          ${className}
        `}
        aria-label="Log in with Nostr browser extension"
      >
        {/* Nostr icon (lightning bolt + "N" motif) */}
        <span className="text-2xl" aria-hidden="true">
          {isLoading ? '⏳' : '⚡'}
        </span>

        <span>
          {isLoading ? 'Connecting...' : 'Log in with Nostr'}
        </span>

        {/* Animated shine effect */}
        <span
          className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      </button>

      {/* Error message */}
      {auth.status === 'error' && auth.error && (
        <div
          role="alert"
          className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2 max-w-xs text-center animate-fade-in"
        >
          {auth.error.includes('NIP-07') ? (
            <>
              No Nostr extension found.{' '}
              <a
                href="https://getalby.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-red-300"
              >
                Install Alby
              </a>
            </>
          ) : (
            auth.error
          )}
        </div>
      )}

      {/* Helper text */}
      {auth.status === 'idle' && (
        <p className="text-brand-muted text-sm text-center">
          Requires a NIP-07 browser extension (e.g.{' '}
          <a
            href="https://getalby.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange hover:underline"
          >
            Alby
          </a>
          )
        </p>
      )}
    </div>
  );
}
