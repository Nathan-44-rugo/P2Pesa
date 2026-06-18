/**
 * src/lib/nostrProfile.ts
 *
 * Fetches and parses Kind 0 (profile metadata) events from Nostr relays.
 * Architecture boundary: all relay queries for profiles live here.
 */

import { getNdk, connectNdk } from '@/lib/nostr';
import { nip19 } from 'nostr-tools';
import type { NostrProfile, ApiResponse } from '@/types/nostr';

/**
 * Parses the content field of a Kind 0 Nostr event into a NostrProfile.
 * Returns null if parsing fails (graceful degradation).
 */
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
      display_name: data.display_name ?? data.display_name ?? undefined,
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

/**
 * Fetches the Kind 0 profile event for a given pubkey from connected relays.
 * Returns the most recent profile found, or an error response.
 */
export async function fetchNostrProfile(
  pubkey: string
): Promise<ApiResponse<NostrProfile>> {
  try {
    const ndk = await connectNdk();

    const event = await ndk.fetchEvent({
      kinds: [0],
      authors: [pubkey],
    });

    if (!event) {
      return {
        data: {
          pubkey,
          npub: nip19.npubEncode(pubkey),
          name: undefined,
          display_name: undefined,
          picture: undefined,
          about: undefined,
          website: undefined,
        },
        error: null,
      };
    }

    const profile = parseKind0Content(pubkey, event.content);
    if (!profile) {
      return { data: null, error: 'Failed to parse profile metadata' };
    }

    return { data: profile, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { data: null, error: `Failed to fetch profile: ${message}` };
  }
}

/**
 * Gets a human-readable display name for a profile.
 * Priority: display_name > name > truncated npub
 */
export function getDisplayName(profile: NostrProfile): string {
  return (
    profile.display_name ??
    profile.name ??
    `${profile.npub.slice(0, 12)}...`
  );
}
