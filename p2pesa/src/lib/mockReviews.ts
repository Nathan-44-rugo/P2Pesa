// src/lib/mockReviews.ts
// Demo reviews — replaced by live Nostr relay events (Rico, Story 2.1)

import { Review } from '@/types/nostr';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev_001',
    agentNpub: 'npub1qsk2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9',
    reviewerNpub: 'npub1reviewer001',
    reviewerProfile: { npub: 'npub1reviewer001', pubkey: 'reviewer001', display_name: 'Brian M.', picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=brian' },
    rating: 5,
    content: 'Smooth trade, 10 minutes start to finish. M-Pesa confirmation came before I even sat down. Will use again.',
    zapAmountSats: 1000,
    zapVerified: true,
    createdAt: Date.now() - 86400000 * 2,
    nostrEventId: 'evt_001',
  },
  {
    id: 'rev_002',
    agentNpub: 'npub1qsk2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9',
    reviewerNpub: 'npub1reviewer002',
    reviewerProfile: { npub: 'npub1reviewer002', pubkey: 'reviewer002', display_name: 'Amina K.', picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=amina' },
    rating: 5,
    content: 'Best rates in CBD. Legit agent, can verify his wallet on-chain. Highly recommend.',
    zapAmountSats: 2100,
    zapVerified: true,
    createdAt: Date.now() - 86400000 * 5,
    nostrEventId: 'evt_002',
  },
  {
    id: 'rev_003',
    agentNpub: 'npub1qsk2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9',
    reviewerNpub: 'npub1reviewer003',
    reviewerProfile: { npub: 'npub1reviewer003', pubkey: 'reviewer003', display_name: 'David O.' },
    rating: 4,
    content: 'Good experience overall. Took slightly longer than expected but communicated clearly throughout.',
    zapAmountSats: 500,
    zapVerified: true,
    createdAt: Date.now() - 86400000 * 10,
    nostrEventId: 'evt_003',
  },
  {
    id: 'rev_004',
    agentNpub: 'npub1abc2def3ghi4jkl5mno6pqr7stu8vwx9yz0123456789abcdef012345678',
    reviewerNpub: 'npub1reviewer004',
    reviewerProfile: { npub: 'npub1reviewer004', pubkey: 'reviewer004', display_name: 'Faith N.', picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=faith' },
    rating: 5,
    content: 'Grace is amazing. Super fast on Airtel Money swaps. First agent I have fully trusted.',
    zapAmountSats: 3000,
    zapVerified: true,
    createdAt: Date.now() - 86400000 * 3,
    nostrEventId: 'evt_004',
  },
];

export function getReviewsForAgent(agentNpub: string): Review[] {
  return MOCK_REVIEWS.filter((r) => r.agentNpub === agentNpub);
}
