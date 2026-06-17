# P2Pesa — Chat Context & Project Definition

**Date:** 2026-06-17
**Project Status:** Ideation Phase (Complete) -> Technical Research Phase (Active)

## Project Vision
P2Pesa is a decentralized reputation and verification platform for Bitcoin and mobile money agents in Kenya. It replaces informal trust with cryptographically verifiable, community-backed reputation.

## Core Pillars

### 1. Identity (Nostr)
- **Mechanism:** Users and Agents login with Nostr keypairs (NIP-07).
- **Benefit:** Self-sovereign identity; reputation is portable across any Nostr-compatible app.

### 2. Proof of Liquidity (Bitcoin Wallet Signatures)
- **Mechanism:** Agents sign a message with their Bitcoin private key to prove ownership of a specific wallet address.
- **Benefit:** Cryptographic proof of "stock on hand" without third-party verification.

### 3. Zap-Gated Reputation (The "Social" Layer)
- **Mechanism:** Reviews and Vouches are only "Verified" if accompanied by a **Nostr Zap** (Lightning payment).
- **Benefit:** Makes Sybil attacks (fake reviews) economically expensive. The "Trust Score" is a composite of Zap volume, account age, and verified liquidity.

## Integration Strategy
- **Soapbox:** Used for the social feed UX, rendering agent profiles, and community discussions.
- **Pontmore:** Potential integration to ingest successful swap events as "Verified Trade" signals.

## MVP Scope
1. **Agent Profile Page:** Displaying Nostr ID, verified BTC balance, and Zap-backed reviews.
2. **Review Flow:** Allowing users to submit a review + Zap.
3. **Agent Search:** Finding agents by trust score and location.

## Success Narrative
"Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn't have to be."
