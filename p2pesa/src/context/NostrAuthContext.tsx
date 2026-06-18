'use client';

/**
 * src/context/NostrAuthContext.tsx
 *
 * React Context for Nostr authentication state.
 * Wraps the entire app; consumed via useNostrAuth() hook.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { AuthState, NostrProfile } from '@/types/nostr';
import {
  loginWithNip07,
  signOut as nostrSignOut,
  pubkeyToNpub,
} from '@/lib/nostr';
import { fetchNostrProfile } from '@/lib/nostrProfile';

// --- Context Shape ---

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

// --- Provider ---

export function NostrAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);

  const login = useCallback(async () => {
    setAuth({ ...defaultAuth, status: 'loading' });

    try {
      const { pubkey, npub } = await loginWithNip07();

      // Immediately set authenticated with basic info while profile loads
      setAuth({
        status: 'authenticated',
        pubkey,
        npub,
        profile: { pubkey, npub },
        error: null,
      });

      // Enrich with Kind 0 profile data
      const result = await fetchNostrProfile(pubkey);
      if (result.data) {
        setAuth((prev) => ({
          ...prev,
          profile: result.data,
        }));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed';
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
    nostrSignOut();
    setAuth(defaultAuth);
  }, []);

  return (
    <NostrAuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </NostrAuthContext.Provider>
  );
}

// --- Hook ---

/**
 * useNostrAuth — access authentication state and login/logout functions.
 * Must be used inside NostrAuthProvider.
 */
export function useNostrAuthContext(): NostrAuthContextValue {
  const ctx = useContext(NostrAuthContext);
  if (!ctx) {
    throw new Error(
      'useNostrAuthContext must be used within NostrAuthProvider'
    );
  }
  return ctx;
}
