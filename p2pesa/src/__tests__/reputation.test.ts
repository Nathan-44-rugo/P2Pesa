import {
  calculateTrustScore,
  createUnsignedReviewEvent,
  parseReviewEvent,
  parseZapReceipt,
} from '@/lib/reputation';
import type { AgentReview, NostrEvent, ZapReceipt } from '@/types/nostr';

const AGENT_PUBKEY = 'agent'.padEnd(64, '0');
const REVIEWER_PUBKEY = 'reviewer'.padEnd(64, '1');

function zapReceipt(overrides: Partial<NostrEvent> = {}): NostrEvent {
  return {
    id: 'zap1',
    pubkey: 'wallet'.padEnd(64, '2'),
    created_at: 1718700000,
    kind: 9735,
    tags: [
      ['p', AGENT_PUBKEY],
      ['P', REVIEWER_PUBKEY],
      ['amount', '5000'],
      ['bolt11', 'lnbc...'],
      ['description', '{}'],
    ],
    content: '',
    sig: 'sig',
    ...overrides,
  };
}

describe('parseZapReceipt', () => {
  it('parses a valid NIP-57 zap receipt for the expected agent', () => {
    const result = parseZapReceipt(JSON.stringify(zapReceipt()), AGENT_PUBKEY);

    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      id: 'zap1',
      agentPubkey: AGENT_PUBKEY,
      reviewerPubkey: REVIEWER_PUBKEY,
      amountMsats: 5000,
    });
  });

  it('rejects receipts for a different agent', () => {
    const result = parseZapReceipt(JSON.stringify(zapReceipt()), 'other-agent');

    expect(result.data).toBeNull();
    expect(result.error).toBe('Zap receipt is not for this agent.');
  });

  it('rejects non-zap events', () => {
    const result = parseZapReceipt(JSON.stringify(zapReceipt({ kind: 1 })), AGENT_PUBKEY);

    expect(result.data).toBeNull();
    expect(result.error).toContain('kind 9735');
  });
});

describe('createUnsignedReviewEvent and parseReviewEvent', () => {
  it('creates a P2Pesa review event that references the zap receipt', () => {
    const parsedZap = parseZapReceipt(JSON.stringify(zapReceipt()), AGENT_PUBKEY)
      .data as ZapReceipt;

    const result = createUnsignedReviewEvent({
      agentPubkey: AGENT_PUBKEY,
      reviewerPubkey: REVIEWER_PUBKEY,
      rating: 5,
      comment: 'Fast and fair trade.',
      zapReceipt: parsedZap,
    });

    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      pubkey: REVIEWER_PUBKEY,
      kind: 1985,
      tags: expect.arrayContaining([
        ['p', AGENT_PUBKEY],
        ['rating', '5'],
        ['zap_receipt', 'zap1'],
        ['zap_amount_msats', '5000'],
      ]),
    });

    const parsedReview = parseReviewEvent(result.data as NostrEvent);
    expect(parsedReview.data).toMatchObject({
      agentPubkey: AGENT_PUBKEY,
      reviewerPubkey: REVIEWER_PUBKEY,
      rating: 5,
      comment: 'Fast and fair trade.',
      zapReceiptId: 'zap1',
      zapAmountMsats: 5000,
    });
  });

  it('rejects empty review comments', () => {
    const parsedZap = parseZapReceipt(JSON.stringify(zapReceipt()), AGENT_PUBKEY)
      .data as ZapReceipt;

    const result = createUnsignedReviewEvent({
      agentPubkey: AGENT_PUBKEY,
      reviewerPubkey: REVIEWER_PUBKEY,
      rating: 4,
      comment: ' ',
      zapReceipt: parsedZap,
    });

    expect(result.data).toBeNull();
    expect(result.error).toBe('Review comment is required.');
  });
});

describe('calculateTrustScore', () => {
  it('uses verified wallet status and zap-backed reviews', () => {
    const reviews: AgentReview[] = [
      {
        id: 'review1',
        agentPubkey: AGENT_PUBKEY,
        reviewerPubkey: REVIEWER_PUBKEY,
        rating: 5,
        comment: 'Great',
        zapReceiptId: 'zap1',
        zapAmountMsats: 5000,
        createdAt: 1718700000,
      },
      {
        id: 'review2',
        agentPubkey: AGENT_PUBKEY,
        reviewerPubkey: 'other',
        rating: 1,
        comment: 'No zap',
        zapReceiptId: 'zap2',
        zapAmountMsats: 0,
        createdAt: 1718700100,
      },
    ];

    const score = calculateTrustScore(reviews, {
      status: 'verified',
      verifiedAt: 1718700200000,
    });

    expect(score.verifiedTradeCount).toBe(1);
    expect(score.zapBackedReviewCount).toBe(1);
    expect(score.averageRating).toBe(5);
    expect(score.totalZapSats).toBe(5);
    expect(score.score).toBeGreaterThan(75);
  });
});
