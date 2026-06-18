# P2Pesa

> "Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn't have to be."

**Decentralized reputation and verification platform for Bitcoin P2P agents in Kenya.**

Built for the [Bitcoin++ Open Source Edition Hackathon 2026](https://www.btcplusplus.dev/) — Nairobi.

---

## Quick Start

```bash
cd p2pesa
npm install
npm run dev
# → http://localhost:3000
```

To test the application, you must configure a self-sovereign Nostr identity. 
**Please follow our comprehensive [Nostr Setup Guide](../docs/nostr-setup-guide.md) before logging in.**

---

## Team

| Role | Owner | Story | Status |
|------|-------|-------|--------|
| Nostr & Identity Lead | **Nathan** | Story 1.1 | ✅ Done |
| Bitcoin & Verification Lead | **Francis** | Story 1.2 | 🔜 In progress |
| Reputation & Protocol Lead | **Rico** | Stories 2.1, 2.2 | ⏳ |
| Frontend & UI Lead | **Daisy** | Stories 2.1, 3.1 | ⏳ |

**→ See [project-progress.md](../project-progress.md) for full handoff notes.**

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript (strict) |
| Styling | Tailwind CSS |
| Identity | Nostr NDK + NIP-07 (Alby) |
| Bitcoin Verification | `bitcoinjs-message` (Story 1.2 — Francis) |
| On-chain Data | Mempool.space API (Story 1.2 — Francis) |
| Reviews | NIP-57 Zaps (Story 2.1 — Rico) |

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
