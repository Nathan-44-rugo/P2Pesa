/**
 * src/lib/nostr.ts
 *
 * Core Nostr/NDK initialization and relay configuration.
 * Architecture boundary: All relay + NDK interactions live here.
 * Consumed by features via hooks, never directly in components.
 */

import NDK, { NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import type { NostrProfile, ApiResponse } from '@/types/nostr';

// --- Relay Configuration ---
// "Pinned" authoritative relay for P2Pesa + community fallbacks.
// Controlled via env variables per architecture spec.
const PINNED_RELAY =
  process.env.NEXT_PUBLIC_PINNED_RELAY ?? 'wss://relay.damus.io';

const FALLBACK_RELAYS = (
  process.env.NEXT_PUBLIC_FALLBACK_RELAYS ??
  'wss://relay.nostr.band,wss://nos.lol,wss://relay.primal.net'
)
  .split(',')
  .map((r) => r.trim());

export const RELAY_URLS = [PINNED_RELAY, ...FALLBACK_RELAYS];

// --- NDK Singleton ---
let _ndk: NDK | null = null;

/**
 * Returns the shared NDK instance, creating it on first call.
 * Uses a module-level singleton to avoid duplicate connections.
 */
export function getNdk(): NDK {
  if (!_ndk) {
    _ndk = new NDK({
      explicitRelayUrls: RELAY_URLS,
    });
  }
  return _ndk;
}

/**
 * Connects NDK to configured relays.
 * Safe to call multiple times — NDK handles idempotency.
 */
export async function connectNdk(): Promise<NDK> {
  const ndk = getNdk();
  await ndk.connect(2000); // 2s timeout
  return ndk;
}

// --- NIP-07 Login ---

/**
 * Logs the user in via a NIP-07 browser extension (e.g. Alby).
 * Returns the user's public key on success.
 *
 * @throws if window.nostr is not available
 */
export async function loginWithNip07(): Promise<{
  pubkey: string;
  npub: string;
  ndkUser: NDKUser;
}> {
  if (typeof window === 'undefined' || !('nostr' in window)) {
    throw new Error(
      'No NIP-07 extension found. Please install Alby or a compatible Nostr browser extension.'
    );
  }

  const signer = new NDKNip07Signer();
  const ndk = getNdk();
  ndk.signer = signer;

  await connectNdk();

  // NDKNip07Signer surfaces the user after blockForSigner()
  const ndkUser = await signer.user();
  const pubkey = ndkUser.pubkey;
  const npub = nip19.npubEncode(pubkey);

  return { pubkey, npub, ndkUser };
}

/**
 * Converts a raw hex pubkey to npub format.
 */
export function pubkeyToNpub(pubkey: string): string {
  return nip19.npubEncode(pubkey);
}

/**
 * Decodes an npub string back to a raw hex pubkey.
 */
export function npubToPubkey(npub: string): ApiResponse<string> {
  try {
    const decoded = nip19.decode(npub);
    if (decoded.type !== 'npub') {
      return { data: null, error: 'Invalid npub string' };
    }
    return { data: decoded.data as string, error: null };
  } catch {
    return { data: null, error: 'Failed to decode npub' };
  }
}

/**
 * Signs out: clears the NDK signer reference.
 * Profile data/state cleanup is the caller's responsibility.
 */
export function signOut(): void {
  const ndk = getNdk();
  ndk.signer = undefined;
}
