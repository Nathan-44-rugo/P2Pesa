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
