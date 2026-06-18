import type {
  AgentReview,
  ApiResponse,
  NostrEvent,
  ReviewRating,
  TrustScore,
  WalletVerification,
  ZapReceipt,
} from '@/types/nostr';

export const P2PESA_REVIEW_KIND = 1985;
export const NIP57_ZAP_RECEIPT_KIND = 9735;
export const MIN_ZAP_MSATS = 1000;

export interface ReviewInput {
  agentPubkey: string;
  reviewerPubkey: string;
  rating: ReviewRating;
  comment: string;
  zapReceipt: ZapReceipt;
}

export function parseZapReceipt(
  raw: string,
  expectedAgentPubkey?: string
): ApiResponse<ZapReceipt> {
  if (!raw.trim()) {
    return { data: null, error: 'Zap receipt is required.' };
  }

  try {
    const event = JSON.parse(raw) as NostrEvent;

    if (event.kind !== NIP57_ZAP_RECEIPT_KIND) {
      return { data: null, error: 'Zap receipt must be a NIP-57 kind 9735 event.' };
    }

    if (!event.id || !event.pubkey || !Array.isArray(event.tags)) {
      return { data: null, error: 'Zap receipt is missing required event fields.' };
    }

    const agentPubkey = findTagValue(event.tags, 'p');
    if (!agentPubkey) {
      return { data: null, error: 'Zap receipt does not reference an agent pubkey.' };
    }

    if (expectedAgentPubkey && agentPubkey !== expectedAgentPubkey) {
      return { data: null, error: 'Zap receipt is not for this agent.' };
    }

    const amountMsats = readZapAmountMsats(event);
    if (amountMsats < MIN_ZAP_MSATS) {
      return { data: null, error: 'Zap receipt amount must be at least 1 sat.' };
    }

    return {
      data: {
        id: event.id,
        pubkey: event.pubkey,
        createdAt: event.created_at,
        agentPubkey,
        reviewerPubkey: findTagValue(event.tags, 'P'),
        amountMsats,
        rawEvent: event,
      },
      error: null,
    };
  } catch {
    return { data: null, error: 'Zap receipt must be valid JSON.' };
  }
}

export function createUnsignedReviewEvent(input: ReviewInput): ApiResponse<NostrEvent> {
  const cleanComment = input.comment.trim();

  if (!input.agentPubkey.trim()) {
    return { data: null, error: 'Agent pubkey is required.' };
  }
  if (!input.reviewerPubkey.trim()) {
    return { data: null, error: 'Reviewer pubkey is required.' };
  }
  if (!cleanComment) {
    return { data: null, error: 'Review comment is required.' };
  }
  if (cleanComment.length > 500) {
    return { data: null, error: 'Review comment must be 500 characters or fewer.' };
  }
  if (input.zapReceipt.agentPubkey !== input.agentPubkey) {
    return { data: null, error: 'Zap receipt does not match the reviewed agent.' };
  }

  return {
    data: {
      pubkey: input.reviewerPubkey,
      created_at: Math.floor(Date.now() / 1000),
      kind: P2PESA_REVIEW_KIND,
      tags: [
        ['p', input.agentPubkey],
        ['rating', String(input.rating)],
        ['zap_receipt', input.zapReceipt.id],
        ['zap_amount_msats', String(input.zapReceipt.amountMsats)],
        ['client', 'p2pesa'],
      ],
      content: JSON.stringify({
        rating: input.rating,
        comment: cleanComment,
        zapReceiptId: input.zapReceipt.id,
        zapReceipt: input.zapReceipt.rawEvent,
      }),
    },
    error: null,
  };
}

export function parseReviewEvent(event: NostrEvent): ApiResponse<AgentReview> {
  if (event.kind !== P2PESA_REVIEW_KIND) {
    return { data: null, error: 'Event is not a P2Pesa review.' };
  }

  const agentPubkey = findTagValue(event.tags, 'p');
  const ratingTag = Number(findTagValue(event.tags, 'rating'));
  const zapReceiptId = findTagValue(event.tags, 'zap_receipt');
  const zapAmountMsats = Number(findTagValue(event.tags, 'zap_amount_msats') ?? 0);

  if (!agentPubkey || !isReviewRating(ratingTag) || !zapReceiptId) {
    return { data: null, error: 'Review event is missing required tags.' };
  }

  try {
    const content = JSON.parse(event.content) as { comment?: string };
    return {
      data: {
        id: event.id,
        agentPubkey,
        reviewerPubkey: event.pubkey,
        rating: ratingTag,
        comment: content.comment ?? '',
        zapReceiptId,
        zapAmountMsats,
        createdAt: event.created_at,
      },
      error: null,
    };
  } catch {
    return { data: null, error: 'Review event content must be JSON.' };
  }
}

export function calculateTrustScore(
  reviews: AgentReview[],
  wallet?: WalletVerification
): TrustScore {
  const zapBackedReviews = reviews.filter((review) => review.zapAmountMsats >= MIN_ZAP_MSATS);
  const averageRating = zapBackedReviews.length
    ? zapBackedReviews.reduce((sum, review) => sum + review.rating, 0) / zapBackedReviews.length
    : 0;
  const totalZapSats = Math.floor(
    zapBackedReviews.reduce((sum, review) => sum + review.zapAmountMsats, 0) / 1000
  );
  const verifiedTradeCount = wallet?.status === 'verified' ? 1 : 0;
  const walletPoints = verifiedTradeCount * 15;
  const reviewPoints = averageRating * 12;
  const volumePoints = Math.min(25, Math.log10(totalZapSats + 1) * 10);
  const score = Math.min(100, Math.round(walletPoints + reviewPoints + volumePoints));
  const lastUpdated = zapBackedReviews.length
    ? Math.max(...zapBackedReviews.map((review) => review.createdAt))
    : wallet?.verifiedAt
      ? Math.floor(wallet.verifiedAt / 1000)
      : null;

  return {
    score,
    verifiedTradeCount,
    zapBackedReviewCount: zapBackedReviews.length,
    averageRating: Number(averageRating.toFixed(2)),
    totalZapSats,
    lastUpdated,
  };
}

function readZapAmountMsats(event: NostrEvent): number {
  const directAmount = Number(findTagValue(event.tags, 'amount') ?? 0);
  if (directAmount > 0) {
    return directAmount;
  }

  const description = findTagValue(event.tags, 'description');
  if (!description) {
    return 0;
  }

  try {
    const request = JSON.parse(description) as { tags?: string[][] };
    return Number(findTagValue(request.tags ?? [], 'amount') ?? 0);
  } catch {
    return 0;
  }
}

function findTagValue(tags: string[][], name: string): string | undefined {
  return tags.find((tag) => tag[0] === name)?.[1];
}

function isReviewRating(value: number): value is ReviewRating {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}
