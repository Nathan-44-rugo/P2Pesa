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
