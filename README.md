# P2Pesa

> "Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn't have to be."

**Decentralized reputation and verification platform for Bitcoin P2P agents in Kenya.**

P2Pesa is a free and open source project built for the [Bitcoin++ Open Source Edition Hackathon 2026](https://www.btcplusplus.dev/) in Nairobi. It gives mobile money and P2P Bitcoin agents a portable, self-sovereign reputation that lives on Nostr and is backed by real on-chain and Lightning activity - no KYC, no central database, no platform lock-in.

## Why It Matters

P2P agents are how most people in Kenya actually get in and out of Bitcoin. Today, trust in those agents is informal and easily faked. P2Pesa anchors trust in cryptography instead:

- Identity is a Nostr keypair, owned by the agent and portable across any Nostr app.
- Liquidity and history are proven by signing a challenge with a Bitcoin wallet.
- Reviews are gated by Lightning zaps, making fake reputation expensive to manufacture.

Because everything is a signed Nostr event, an agent's reputation is not trapped inside P2Pesa - it travels with their key.

---

## Quick Start

```bash
cd p2pesa
npm install
npm run dev
# -> http://localhost:3000
```

To test the application, you must configure a self-sovereign Nostr identity. 
**Please follow our comprehensive [Nostr Setup Guide](../docs/nostr-setup-guide.md) before logging in.**

---

## Features

- Nostr login via NIP-07 browser extensions (for example Alby or nos2x).
- Bitcoin wallet verification by signing a challenge message, with balance lookup via Mempool.space.
- Zap-gated reviews using NIP-57 zap receipts, so reviews are backed by real sats.
- Trust score computed from verified wallet status plus zap-backed reviews.
- Agent discovery and search with filtering by trust score, payment method, and location.
- Demo Mode for quick evaluation: seeds realistic agents, one-click wallet verification, and generated zap receipts. Crypto libraries stay untouched - the bypass is purely at the UI/state level.

## Team

| Role | Owner | Story | Status |
|------|-------|-------|--------|
| Nostr & Identity Lead | **Nathan** | Story 1.1 | Implemented |
| Bitcoin & Verification Lead | **Francis** | Story 1.2 | Implemented |
| Reputation & Protocol Lead | **Rico** | Stories 2.1, 2.2 | Implemented |
| Frontend & UI Lead | **Daisy** | Stories 2.1, 3.1 | Implemented |

See [project-progress.md](../project-progress.md) for full handoff notes.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS |
| Identity | Nostr NDK + NIP-07 (Alby) |
| Bitcoin Verification | `bitcoinjs-message` (Story 1.2 - Francis) |
| On-chain Data | Mempool.space API (Story 1.2 - Francis) |
| Reviews | NIP-57 Zaps (Story 2.1 - Rico) |

---

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run test     # Run Jest tests
npm run lint     # ESLint check
```

---

## Architecture

See `bmad_output/planning-artifacts/architecture.md` for full architectural decisions.

Key principles:
- All relay/API calls encapsulated in `src/lib/`
- Feature-based structure: `src/features/{domain}/`
- TypeScript strict mode everywhere
- "Deferred Verification" pattern: Nostr login first, Bitcoin wallet verification on demand
- Eventual consistency: UI badges show "Last updated X ago"
- Profile data is resolved client-side so relay fetches work on serverless hosts like Vercel

---

## Contributing

P2Pesa is open source and contributions are welcome. To get started:

1. Fork the repository and create a feature branch.
2. Run `npm install`, then `npm run dev` to work locally.
3. Keep changes inside the feature-based structure and respect TypeScript strict mode.
4. Run `npm run test` and `npm run build` before opening a pull request.

Reputation must remain portable: never write mock or demo data to live Nostr relays, and never weaken the cryptographic logic in `src/lib/bitcoin.ts` or `src/lib/reputation.ts`.

---

## License

Released as open source under the MIT License. See the repository root for license details.
