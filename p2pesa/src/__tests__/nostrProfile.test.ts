/**
 * src/__tests__/nostrProfile.test.ts
 *
 * Unit tests for nostrProfile.ts — Kind 0 parsing and profile utilities.
 * RED phase: These tests define correct behavior.
 * GREEN phase: parseKind0Content implementation satisfies all assertions.
 */

import { parseKind0Content, getDisplayName } from '@/lib/nostrProfile';
import type { NostrProfile } from '@/types/nostr';

// Mock nostr-tools nip19 for predictable output
jest.mock('nostr-tools', () => ({
  nip19: {
    npubEncode: (pubkey: string) => `npub1${pubkey.slice(0, 8)}test`,
  },
}));

const MOCK_PUBKEY = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

describe('parseKind0Content', () => {
  it('parses a full Kind 0 profile correctly', () => {
    const content = JSON.stringify({
      name: 'Alice Agent',
      display_name: 'Alice the Trusted',
      picture: 'https://example.com/alice.jpg',
      about: 'Reliable Bitcoin agent in Nairobi',
      website: 'https://alice.btc',
      lud16: 'alice@getalby.com',
      nip05: 'alice@example.com',
    });

    const profile = parseKind0Content(MOCK_PUBKEY, content);

    expect(profile).not.toBeNull();
    expect(profile!.pubkey).toBe(MOCK_PUBKEY);
    expect(profile!.name).toBe('Alice Agent');
    expect(profile!.display_name).toBe('Alice the Trusted');
    expect(profile!.picture).toBe('https://example.com/alice.jpg');
    expect(profile!.about).toBe('Reliable Bitcoin agent in Nairobi');
    expect(profile!.website).toBe('https://alice.btc');
    expect(profile!.lud16).toBe('alice@getalby.com');
    expect(profile!.nip05).toBe('alice@example.com');
    // npub should be set via nip19.npubEncode
    expect(profile!.npub).toBeTruthy();
  });

  it('handles missing optional fields gracefully', () => {
    const content = JSON.stringify({ name: 'Bob' });

    const profile = parseKind0Content(MOCK_PUBKEY, content);

    expect(profile).not.toBeNull();
    expect(profile!.name).toBe('Bob');
    expect(profile!.display_name).toBeUndefined();
    expect(profile!.picture).toBeUndefined();
    expect(profile!.about).toBeUndefined();
    expect(profile!.lud16).toBeUndefined();
    expect(profile!.nip05).toBeUndefined();
  });

  it('returns null for invalid JSON', () => {
    const profile = parseKind0Content(MOCK_PUBKEY, 'not-valid-json{{{');
    expect(profile).toBeNull();
  });

  it('returns null for empty string', () => {
    const profile = parseKind0Content(MOCK_PUBKEY, '');
    expect(profile).toBeNull();
  });

  it('handles empty object (minimal profile)', () => {
    const profile = parseKind0Content(MOCK_PUBKEY, '{}');
    expect(profile).not.toBeNull();
    expect(profile!.pubkey).toBe(MOCK_PUBKEY);
    expect(profile!.name).toBeUndefined();
  });

  it('supports both display_name and display_name fields', () => {
    const withSnakeCase = parseKind0Content(
      MOCK_PUBKEY,
      JSON.stringify({ display_name: 'Snake Case' })
    );
    expect(withSnakeCase!.display_name).toBe('Snake Case');

    const withCamelCase = parseKind0Content(
      MOCK_PUBKEY,
      JSON.stringify({ display_name: 'Camel Case' })
    );
    expect(withCamelCase!.display_name).toBe('Camel Case');
  });
});

describe('getDisplayName', () => {
  const baseProfile: NostrProfile = {
    pubkey: MOCK_PUBKEY,
    npub: 'npub1abcdef1234567890test',
  };

  it('prefers display_name over name', () => {
    const profile = { ...baseProfile, display_name: 'Display', name: 'Name' };
    expect(getDisplayName(profile)).toBe('Display');
  });

  it('falls back to name if no display_name', () => {
    const profile = { ...baseProfile, name: 'Just Name' };
    expect(getDisplayName(profile)).toBe('Just Name');
  });

  it('truncates npub when no name fields', () => {
    const result = getDisplayName(baseProfile);
    expect(result).toContain('...');
    expect(result.length).toBeLessThan(baseProfile.npub.length);
  });
});
