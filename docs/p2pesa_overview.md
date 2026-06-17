# P2Pesa — Project Overview

## What It Is

P2Pesa is a decentralized reputation and verification platform for Bitcoin and mobile money agents. It gives users a way to evaluate the trustworthiness of a human agent before initiating a Bitcoin or fiat swap — replacing informal word-of-mouth trust (WhatsApp groups, Telegram, referrals) with cryptographically verifiable, community-backed reputation.

**One-line pitch:** "Uber ratings for Bitcoin agents — but decentralized, open-source, and Bitcoin-native."

---

## The Problem

In Africa and other emerging markets, a significant portion of Bitcoin transactions flow through:

- Mobile money networks (M-Pesa, Airtel Money)
- Human brokers and P2P agents
- Informal OTC markets

Before trading, a user faces several immediate trust questions:
- Can I trust this agent?
- Have they scammed anyone before?
- Do they have liquidity right now?
- What happens if a dispute arises?

Currently, no universal trust layer exists. Users rely entirely on social proof from informal channels. This creates:

- Fraud risk (exit scams, fake liquidity claims)
- Adoption friction (users afraid to enter the market)
- No accountability for bad actors
- No reward/recognition for good actors

---

## The Solution

P2Pesa creates a **public, verifiable profile** for every agent. Each profile surfaces:

| Field | Description |
|---|---|
| Trust Score | Composite score from wallet activity, reviews, and swap attestations |
| Trade History | Number of completed trades (attested on-chain where possible) |
| Liquidity Level | Self-declared and community-validated liquidity availability |
| Community Reviews | Ratings and written reviews from past counterparties |
| Dispute History | Record of raised disputes and their resolutions |
| Verified Identity | Nostr public key + Bitcoin wallet signature |

### Example User Journey

1. User wants to buy Bitcoin via mobile money.
2. Opens AgentTrust, searches for nearby or available agents.
3. Sees 5 agent profiles with trust scores.
4. Compares: reviews, trade count, dispute history.
5. Chooses the agent with the strongest verified record.
6. Initiates the swap with confidence.

Instead of: *"Trust me bro."*
They get: *"342 successful trades, 4.9 rating, zero disputes, Bitcoin-verified wallet."*

---

## Technical Architecture

### 1. Identity Layer — Nostr

Every agent's identity is their **Nostr keypair** (public/private key).

- No email. No username. No password.
- The Nostr public key (`npub`) is the agent's universal ID across the platform.
- Login is via Nostr signing (e.g. browser extension like Alby, or NIP-07 compatible wallet).
- Reputation is **portable** — tied to the key, not the platform.
- Agents can carry their reputation across any Nostr-compatible app.

**Why Nostr:** Decentralized, self-sovereign, censorship-resistant. Fits the Bitcoin ethos exactly.

### 2. Verification Layer — Bitcoin Wallet Signatures

To prevent fake or borrowed reputation, agents must **cryptographically prove** ownership of a Bitcoin wallet.

- Agent signs a challenge message with their Bitcoin private key.
- Platform verifies the signature against the wallet's public address.
- On-chain transaction history of that wallet is fetched and used to inform the trust score.
- This ties the agent's real economic activity on Bitcoin to their profile.

**Key distinction:** An agent doesn't just *claim* they've done 500 trades. Their wallet's on-chain history *demonstrates* it.

> Note: This is not a perfect sybil-resistance mechanism. A multi-sig or shared wallet could be misused. In the MVP, this is disclosed as a design goal — the verification is presented as a strong signal, not absolute proof.

### 3. Social/Review Layer — Soapbox + Nostr

Community reviews, endorsements, and dispute discussions live on **Nostr relays**, surfaced via **Soapbox**.

- Reviews are Nostr events (kind 1 or a custom NIP) signed by the reviewer's key.
- Reviews are censorship-resistant — no central database to manipulate.
- Soapbox provides the social feed UX: threaded discussions, community endorsements, agent reputation feeds.
- Think: decentralized Trustpilot, built on Nostr rails.

**Soapbox integration specifics:**
- Use Soapbox's open-source stack to render agent review feeds.
- Agent dispute discussions are public Nostr threads — transparent and auditable.
- Community endorsements are Nostr "zap" or reaction events attached to agent profiles.

### 4. Trust Score Algorithm — Open Source

The Trust Score is a composite, deterministic score computed from:

| Signal | Weight (indicative) |
|---|---|
| Verified wallet transaction count | High |
| Average community review rating | High |
| Number of verified swap attestations | Medium |
| Dispute count and resolution outcome | Medium (negative) |
| Account age (Nostr key first seen) | Low |
| Liquidity self-declaration (unverified) | Low |

The scoring algorithm is **open source and publicly auditable**. No black box. Any community member can inspect, fork, or propose improvements to the scoring logic.

**Key principle:** Trust should not be owned by a company. The algorithm is a public good.

### 5. Swap Attestations — Pontmore Protocol (optional integration)

For teams pursuing the Pontmore prize or deeper infrastructure:

- Pontmore is a Nostr-native protocol for coordinating Bitcoin-fiat swaps, agent discovery, escrow, and dispute resolution.
- Completed swaps on Pontmore can generate **attestation events** on Nostr.
- AgentTrust can ingest these attestations as verified trade signals — stronger than self-reported history.
- This creates a feedback loop: more swaps on Pontmore → stronger AgentTrust profiles.

---

## Tech Stack (MVP)

| Layer | Technology |
|---|---|
| Frontend | React (web app) |
| Identity | Nostr (NIP-07 login, keypair-based profiles) |
| Social/Reviews | Nostr relays + Soapbox open-source components |
| Bitcoin Verification | Bitcoin message signing (secp256k1) |
| On-chain data | Mempool.space API or similar block explorer API |
| Trust Score | Client-side or server-side JS computation |
| Data storage | Nostr relays (decentralized) + lightweight backend for score caching |
| Open Source | MIT licensed, public GitHub repo |

---

## Prize Alignment

| Prize | How AgentTrust Qualifies |
|---|---|
| **Main Competition** | Real problem, strong demo narrative, Bitcoin-native design |
| **Best use of Soapbox** | Soapbox used for agent review feeds and community endorsements on Nostr |
| **Best Tool for Mobile Money Agents (Minmo)** | Directly addresses agent liquidity, swap management, and trust for M-Pesa/Airtel agents |
| **Best Contribution to Open Source (Btrust)** | Fully open-source reputation protocol with public scoring algorithm |

---

## What Makes This Different

- **Not a platform.** A protocol. The reputation data lives on Nostr — not in AgentTrust's database.
- **Not KYC.** No government ID. Verification is cryptographic, not bureaucratic.
- **Not custodial.** AgentTrust never holds funds or acts as escrow.
- **Bitcoin-native design.** Applies Bitcoin's core principles (trustless verification, transparency, open-source) to the human layer of trading.

---

## MVP Scope (Hackathon Build)

Given time constraints, the MVP focuses on:

1. **Agent profile page** — Nostr login, display key, wallet verification flow
2. **Trust score display** — computed from mock + real on-chain data
3. **Review submission** — sign and publish a Nostr review event for an agent
4. **Agent search/list** — browse and compare agents by score
5. **Demo narrative** — one complete user journey from "find agent" to "read their verified history"

Out of scope for MVP (design targets, not built):
- Live swap integration with Pontmore
- Full dispute resolution workflow
- Mobile app

---

## Open Questions / Known Limitations

- **Cold start problem:** First agents have no reviews. Solution framing: agents self-attest first, community verification follows (similar to Airbnb's early host model).
- **Wallet borrowing:** An agent could borrow a wallet with history. Mitigated by requiring the same wallet to also be the agent's receiving address, making it economically irrational to borrow.
- **Review spam:** Mitigated by requiring Nostr keys with proof-of-work (NIP-13) or a minimum age threshold for review submissions.
- **Sybil resistance:** Not fully solved at MVP stage. Acknowledged as an ongoing research problem.

---

## Summary

AgentTrust is building the trust infrastructure that Bitcoin P2P markets in Africa currently lack. It uses Bitcoin wallet signatures for verification, Nostr keypairs for decentralized identity, and Soapbox for community reputation — creating a portable, open-source, censorship-resistant reputation layer for the human agents who make Bitcoin accessible at the last mile.

> "Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn't have to be."
