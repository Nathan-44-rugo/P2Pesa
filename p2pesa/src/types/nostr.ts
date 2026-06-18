// Shared Nostr and P2Pesa domain types.

export interface NostrProfile {
  npub: string;
  pubkey: string;
  name?: string;
  display_name?: string;
  displayName?: string;
  about?: string;
  picture?: string;
  nip05?: string;
  lud16?: string;
  website?: string;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export interface AuthState {
  status: AuthStatus;
  pubkey: string | null;
  npub: string | null;
  profile: NostrProfile | null;
  error: string | null;
}

export type WalletVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'failed';

export interface WalletVerification {
  address?: string;
  status: WalletVerificationStatus;
  balanceSats?: number;
  signature?: string;
  verifiedAt?: number;
}

export interface AgentProfile {
  npub: string;
  nostr?: NostrProfile;
  wallet?: WalletVerification;
  nostrProfile: NostrProfile;
  walletVerification?: WalletVerification;
  trustScore?: TrustScore;
  reviews?: Review[];
  location?: string;
  languages?: string[];
  paymentMethods?: PaymentMethod[];
}

export interface TrustScore {
  // Daisy UI/demo score shape.
  total?: number;
  breakdown?: {
    walletScore: number;
    reviewScore: number;
    attestationScore: number;
    disputePenalty: number;
    accountAge: number;
  };
  reviewCount?: number;
  tradeCount?: number;
  disputeCount?: number;
  zapVolumeSats?: number;
  computedAt?: number;

  // Rico relay/reputation score shape.
  score?: number;
  verifiedTradeCount?: number;
  zapBackedReviewCount?: number;
  averageRating?: number;
  totalZapSats?: number;
  lastUpdated?: number | null;
}

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  agentNpub: string;
  reviewerNpub: string;
  reviewerProfile?: NostrProfile;
  rating: ReviewRating;
  content: string;
  zapAmountSats?: number;
  zapVerified: boolean;
  createdAt: number;
  nostrEventId?: string;
}

export interface ReviewSubmission {
  agentNpub: string;
  rating: ReviewRating;
  content: string;
  zapAmountSats: number;
}

export type SortOption = 'trust_score' | 'trade_count' | 'review_count' | 'newest';
export type PaymentMethod = 'mpesa' | 'airtel_money' | 'bank_transfer' | 'cash';

export interface AgentSearchFilters {
  query: string;
  minTrustScore: number;
  paymentMethods: PaymentMethod[];
  sortBy: SortOption;
  location?: string;
  minTradeCount?: number;
}

export interface NostrEvent {
  id?: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig?: string;
}

export interface ZapReceipt {
  id: string;
  pubkey: string;
  createdAt: number;
  agentPubkey: string;
  reviewerPubkey?: string;
  amountMsats: number;
  rawEvent: NostrEvent;
}

export interface AgentReview {
  id?: string;
  agentPubkey: string;
  reviewerPubkey: string;
  rating: ReviewRating;
  comment: string;
  zapReceiptId: string;
  zapAmountMsats: number;
  createdAt: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
