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
