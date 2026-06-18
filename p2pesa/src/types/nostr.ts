/**
 * Shared TypeScript definitions for Nostr-related types.
 * Architecture pattern: types live in src/types/ and are imported by features and lib.
 */

/** Parsed Kind 0 profile metadata from a Nostr relay */
export interface NostrProfile {
  pubkey: string;
  npub: string;
  name?: string;
  displayName?: string;
  picture?: string;
  about?: string;
  website?: string;
  lud16?: string; // Lightning address
  nip05?: string; // NIP-05 verification
}

/** Auth state for the NIP-07 login flow */
export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'error';

export interface AuthState {
  status: AuthStatus;
  pubkey: string | null;
  npub: string | null;
  profile: NostrProfile | null;
  error: string | null;
}

/** Bitcoin wallet verification state (used in Story 1.2 by Francis) */
export type WalletVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'failed';

export interface WalletVerification {
  status: WalletVerificationStatus;
  address?: string;
  balanceSats?: number;
  signature?: string;
  verifiedAt?: number; // Unix timestamp
}

/** Combined agent profile: Nostr identity + optional BTC verification */
export interface AgentProfile {
  nostr: NostrProfile;
  wallet: WalletVerification;
  trustScore?: number;
}

/** Standard API response wrapper per architecture spec */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
