// src/lib/mockAgents.ts
// Demo seed data for hackathon — replaced by live Nostr relay indexer (Rico, Story 2.2)

import { AgentProfile } from '@/types/nostr';

export const MOCK_AGENTS: AgentProfile[] = [
  {
    npub: 'npub1qsk2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9',
    nostrProfile: {
      npub: 'npub1qsk2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9',
      pubkey: 'qsk2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9',
      name: 'kamau_btc',
      display_name: 'James Kamau',
      about: 'P2P Bitcoin agent in Nairobi CBD. Fast, reliable M-Pesa swaps. Operating since 2021.',
      picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=kamau',
    },
    walletVerification: {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      status: 'verified',
      balanceSats: 4850000,
      verifiedAt: Date.now() - 86400000,
    },
    trustScore: {
      total: 94,
      breakdown: { walletScore: 32, reviewScore: 28, attestationScore: 18, disputePenalty: 0, accountAge: 16 },
      reviewCount: 87,
      tradeCount: 342,
      disputeCount: 0,
      zapVolumeSats: 210000,
      computedAt: Date.now() - 3600000,
    },
    location: 'Nairobi CBD',
    paymentMethods: ['mpesa', 'bank_transfer'],
    languages: ['en', 'sw'],
  },
  {
    npub: 'npub1abc2def3ghi4jkl5mno6pqr7stu8vwx9yz0123456789abcdef012345678',
    nostrProfile: {
      npub: 'npub1abc2def3ghi4jkl5mno6pqr7stu8vwx9yz0123456789abcdef012345678',
      pubkey: 'abc2def3ghi4jkl5mno6pqr7stu8vwx9yz0123456789abcdef012345678',
      name: 'wanjiru_sats',
      display_name: 'Grace Wanjiru',
      about: 'Westlands Bitcoin broker. Airtel Money & M-Pesa. Available 8am–9pm daily.',
      picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=wanjiru',
    },
    walletVerification: {
      address: 'bc1q34567890abcdefghijklmnopqrstuvwxyz12345',
      status: 'verified',
      balanceSats: 2100000,
      verifiedAt: Date.now() - 172800000,
    },
    trustScore: {
      total: 88,
      breakdown: { walletScore: 28, reviewScore: 26, attestationScore: 14, disputePenalty: -4, accountAge: 24 },
      reviewCount: 54,
      tradeCount: 198,
      disputeCount: 1,
      zapVolumeSats: 134000,
      computedAt: Date.now() - 7200000,
    },
    location: 'Westlands',
    paymentMethods: ['mpesa', 'airtel_money'],
    languages: ['en', 'sw'],
  },
  {
    npub: 'npub1zzz9yyy8xxx7www6vvv5uuu4ttt3sss2rrr1qqq0ppp9ooo8nnn7mmm6lll',
    nostrProfile: {
      npub: 'npub1zzz9yyy8xxx7www6vvv5uuu4ttt3sss2rrr1qqq0ppp9ooo8nnn7mmm6lll',
      pubkey: 'zzz9yyy8xxx7www6vvv5uuu4ttt3sss2rrr1qqq0ppp9ooo8nnn7mmm6lll',
      name: 'odhiambo_p2p',
      display_name: 'Kevin Odhiambo',
      about: 'Kisumu & Nairobi agent. Competitive rates on large volumes. Verified since 2022.',
      picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=odhiambo',
    },
    walletVerification: {
      address: 'bc1qaaaabbbbccccddddeeeeffffgggghhhhiiiijjjj',
      status: 'verified',
      balanceSats: 7300000,
      verifiedAt: Date.now() - 259200000,
    },
    trustScore: {
      total: 76,
      breakdown: { walletScore: 26, reviewScore: 20, attestationScore: 10, disputePenalty: -8, accountAge: 28 },
      reviewCount: 31,
      tradeCount: 112,
      disputeCount: 3,
      zapVolumeSats: 88000,
      computedAt: Date.now() - 10800000,
    },
    location: 'Kisumu / Nairobi',
    paymentMethods: ['mpesa', 'cash'],
    languages: ['en', 'sw', 'luo'],
  },
  {
    npub: 'npub1fff2eee3ddd4ccc5bbb6aaa7999888777666555444333222111000fffeeedd',
    nostrProfile: {
      npub: 'npub1fff2eee3ddd4ccc5bbb6aaa7999888777666555444333222111000fffeeedd',
      pubkey: 'fff2eee3ddd4ccc5bbb6aaa7999888777666555444333222111000fffeeedd',
      name: 'aisha_lightning',
      display_name: 'Aisha Mwangi',
      about: 'Lightning-fast BTC agent. Mombasa Road corridor. Lightning + M-Pesa settlements.',
      picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=aisha',
    },
    walletVerification: {
      address: 'bc1qzzzzyyyy3xxxx4wwww5vvvv6uuuu7tttt8ssss',
      status: 'verified',
      balanceSats: 1540000,
      verifiedAt: Date.now() - 432000000,
    },
    trustScore: {
      total: 82,
      breakdown: { walletScore: 22, reviewScore: 24, attestationScore: 16, disputePenalty: -4, accountAge: 24 },
      reviewCount: 42,
      tradeCount: 155,
      disputeCount: 1,
      zapVolumeSats: 96000,
      computedAt: Date.now() - 14400000,
    },
    location: 'Mombasa Road',
    paymentMethods: ['mpesa', 'airtel_money', 'bank_transfer'],
    languages: ['en', 'sw'],
  },
  {
    npub: 'npub11234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    nostrProfile: {
      npub: 'npub11234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      pubkey: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      name: 'njoroge_new',
      display_name: 'Peter Njoroge',
      about: 'New agent in Thika. Building my reputation. Small trades welcome.',
      picture: 'https://api.dicebear.com/7.x/identicon/svg?seed=njoroge',
    },
    walletVerification: {
      address: 'bc1qnewagent12345678901234567890123456789012',
      status: 'verified',
      balanceSats: 450000,
      verifiedAt: Date.now() - 604800000,
    },
    trustScore: {
      total: 52,
      breakdown: { walletScore: 14, reviewScore: 14, attestationScore: 8, disputePenalty: 0, accountAge: 16 },
      reviewCount: 8,
      tradeCount: 22,
      disputeCount: 0,
      zapVolumeSats: 18000,
      computedAt: Date.now() - 18000000,
    },
    location: 'Thika',
    paymentMethods: ['mpesa'],
    languages: ['en', 'sw'],
  },
];

export function searchAgents(
  agents: AgentProfile[],
  query: string,
  minScore: number,
  paymentMethods: string[],
  sortBy: string
): AgentProfile[] {
  let results = agents.filter((a) => {
    const name = (a.nostrProfile.display_name || a.nostrProfile.name || '').toLowerCase();
    const about = (a.nostrProfile.about || '').toLowerCase();
    const location = (a.location || '').toLowerCase();
    const q = query.toLowerCase();

    const matchesQuery = !q || name.includes(q) || about.includes(q) || location.includes(q);
    const matchesScore = (a.trustScore?.total ?? 0) >= minScore;
    const matchesPayment =
      paymentMethods.length === 0 ||
      paymentMethods.some((m) => a.paymentMethods?.includes(m as any));

    return matchesQuery && matchesScore && matchesPayment;
  });

  switch (sortBy) {
    case 'trust_score':
      results.sort((a, b) => (b.trustScore?.total ?? 0) - (a.trustScore?.total ?? 0));
      break;
    case 'trade_count':
      results.sort((a, b) => (b.trustScore?.tradeCount ?? 0) - (a.trustScore?.tradeCount ?? 0));
      break;
    case 'review_count':
      results.sort((a, b) => (b.trustScore?.reviewCount ?? 0) - (a.trustScore?.reviewCount ?? 0));
      break;
  }

  return results;
}
