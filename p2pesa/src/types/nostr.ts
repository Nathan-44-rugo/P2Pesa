// ─── Shared Types (authored by Nathan, extended by Daisy for Reviews/Search) ───

export interface NostrProfile {
  npub: string;
  pubkey: string;
  name?: string;
  display_name?: string;
  about?: string;
  picture?: string;
  nip05?: string;
  lud16?: string;
  website?: string;
}

export interface AuthState {
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  pubkey: string | null;
  npub: string | null;
  profile: NostrProfile | null;
  error: string | null;
}

export interface WalletVerification {
  address: string;
  status: 'verified' | 'failed' | 'pending';
  balanceSats?: number;
  verifiedAt?: number;
}

export interface AgentProfile {
  npub: string;
  nostrProfile: NostrProfile;
  walletVerification?: WalletVerification;
  trustScore?: TrustScore;
  reviews?: Review[];
  location?: string;
  languages?: string[];
  paymentMethods?: string[];
}

// ─── Rico's Trust Score (Story 2.2) ───
export interface TrustScore {
  total: number;          // 0–100
  breakdown: {
    walletScore: number;
    reviewScore: number;
    attestationScore: number;
    disputePenalty: number;
    accountAge: number;
  };
  reviewCount: number;
  tradeCount: number;
  disputeCount: number;
  zapVolumeSats: number;
  computedAt: number;
}

// ─── Review Types (Story 2.1) ───
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

// ─── Search Types (Story 3.1) ───
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

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
