# PRD: P2Pesa - Decentralized Reputation for P2P Agents

**Status:** Draft
**Created:** 2026-06-17
**Last Updated:** 2026-06-17

---

## 1. Vision & Strategy
### 1.1 Vision
P2Pesa is a decentralized reputation and verification platform for Bitcoin and mobile money agents in Kenya. It replaces informal trust with cryptographically verifiable, community-backed reputation.

### 1.2 Success Narrative
"Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn't have to be."

### 1.3 MVP Goals
- Launch a functional MVP for the Bitcoin++ Hackathon.
- Demonstrate core P2Pesa pillars: Nostr Identity, BTC Wallet Verification, and Zap-Gated Reputation.
- Showcase a "swag factor" presentation to judges (Nairobi, Kenya).

### 1.4 Target Audience
- **Agents:** Mobile money/crypto brokers needing to demonstrate trust to secure trades.
- **Traders:** Individuals needing to safely exchange fiat/BTC with an agent.

## 2. Core Pillars (Integration Strategy)
1. **Identity (Nostr):** Uses Nostr keypairs (NIP-07) for portable, self-sovereign identity.
2. **Proof of Liquidity (Bitcoin Wallet Signatures):** Agents cryptographically prove ownership of Bitcoin wallets to demonstrate liquidity.
3. **Zap-Gated Reputation (The "Social" Layer):** Reviews/Vouches are only "Verified" if backed by a Nostr Zap (Lightning payment), making Sybil attacks economically irrational.
4. **Platform/UX:** Soapbox open-source components used for social feed and reputation UX.

## 3. MVP Scope
1. **Agent Profile Page:** Displays Nostr ID, verified BTC balance, and Zap-backed reviews.
2. **Review Flow:** Allows users to submit a review + Zap.
3. **Agent Search:** Allows users to find and compare agents by trust score and location.

## 4. Judging Criteria Alignment (Olympic Gymnastics Rubric)
- **Routine Difficulty:** Bitcoin-native reputation protocol on Nostr; Zap-gated economic Sybil resistance.
- **Routine Execution:** Functional MVP profile, verification, and review flow.
- **General Effect:** "Uber for Agents" narrative, interoperability with Soapbox/Pontmore, strong applicability to African P2P landscape.

---
## Addendum
- Technical Architecture Details (Nostr relays, Mempool API, etc.)
- Known Limitations (Cold start problem, Sybil resistance targets)
