# P2Pesa — Project Progress

> **Hackathon:** Bitcoin++ Open Source Edition — Nairobi, Kenya  
> **Submission Deadline:** Thursday June 18, 2026 at 1:00 PM (GMT+03:00)  
> **Judging Expo:** 1:30 PM – 3:30 PM

---

## Development Order

| # | Role | Owner | Story | Status |
|---|------|-------|-------|--------|
| 1 | Nostr & Identity Lead ("The Soul") | **Nathan** | Story 1.1 — Nostr Authentication | ✅ **COMPLETE** |
| 2 | Bitcoin & Verification Lead ("The Trust") | **Francis** | Story 1.2 — Bitcoin Wallet Verification | ✅ **IMPLEMENTED** |
| 3 | Reputation & Protocol Lead ("The Brain") | **Rico** | Stories 2.1, 2.2 — Zap Reviews + Trust Score | ✅ **IMPLEMENTED** |
| 4 | Frontend & UI Lead ("The Shell") | **Daisy** | Stories 2.1, 3.1 — Profile UI + Search | ✅ **IMPLEMENTED** |

---

## ✅ Story 1.1 — COMPLETE (Nathan)

Built the Next.js 14 + TypeScript + Tailwind foundation, Nostr NIP-07 login, profile fetching, auth context, reusable profile components, navbar, landing page, profile route, and auth/profile tests.

Key files:
- `p2pesa/src/lib/nostr.ts`
- `p2pesa/src/lib/nostrProfile.ts`
- `p2pesa/src/context/NostrAuthContext.tsx`
- `p2pesa/src/features/agents/NostrLoginButton.tsx`
- `p2pesa/src/features/agents/AgentProfileCard.tsx`
- `p2pesa/src/app/page.tsx`
- `p2pesa/src/app/profile/[npub]/page.tsx`

---

## ✅ Story 1.2 — IMPLEMENTED (Francis)

Built deferred Bitcoin wallet verification:
- Real `bitcoinjs-message` verification for Legacy + SegWit signatures.
- Mempool.space balance lookup.
- `completeWalletVerification` flow.
- Browser `Buffer` webpack polyfill.
- Wallet verification UI wired to the real verification logic.

Key files:
- `p2pesa/src/lib/bitcoin.ts`
- `p2pesa/src/features/agents/WalletVerificationStub.tsx`
- `p2pesa/next.config.js`
- `p2pesa/package.json`

MVP decisions:
- Taproot/BIP-322 is out of scope.
- Wallet signing is manual copy/paste.
- The `npub` is embedded in the challenge string → binds the signature to the Nostr identity.

---

## ✅ Stories 2.1 and 2.2 — IMPLEMENTED (Rico)

Built zap-gated reviews and trust score calculation:
- NIP-57 zap receipt parsing for kind `9735`.
- Agent-target validation via the `p` tag.
- Minimum zap backing threshold of 1 sat (`1000` millisats).
- P2Pesa review event creation using app-specific kind `1985`.
- NIP-07 signing and relay publishing for review events.
- Relay fetch/index behavior for agent review events.
- Trust score calculation from verified wallet status plus zap-backed reviews.
- Unit tests for zap receipt parsing, review event creation/parsing, and trust score calculation.

Key files:
- `p2pesa/src/lib/reputation.ts`
- `p2pesa/src/lib/reputationRelay.ts`
- `p2pesa/src/features/reviews/ReviewSubmissionForm.tsx`
- `p2pesa/src/features/reviews/TrustScorePanel.tsx`
- `p2pesa/src/__tests__/reputation.test.ts`
- `bmad_output/implementation-artifacts/2-1-zap-gated-review-submission.md`
- `bmad_output/implementation-artifacts/2-2-trust-score-calculation.md`

Validation:
```bash
cd p2pesa
npm.cmd test -- --runInBand
npm.cmd run build
```

Both passed on 2026-06-18.

MVP decisions:
- LNURL invoice creation is out of scope for Rico's hackathon slice.
- The review form accepts a NIP-57 zap receipt JSON after payment.
- Reputation remains portable in signed Nostr events; no centralized database or backend service was added.

---

## ✅ Stories 2.1 and 3.1 — IMPLEMENTED (Daisy)

Built the user-facing frontend shell:
- UI system: `TrustScoreRing`, `StarRating`, `ZapBadge`, `PaymentMethodBadge`.
- Agent experience: `AgentCard` and `AgentProfileFull`.
- Reputation UI: `ReviewCard` and `ReviewSubmitForm`.
- Search system: `AgentSearchFilter` and `/search`.
- Mock data layer: realistic Nairobi agents and zap-enabled reviews for the demo flow.
- Profile route now favors Daisy's `AgentProfileFull` UI and demo data while Rico's protocol layer remains available for live integration.

Key files:
- `p2pesa/src/app/profile/[npub]/page.tsx`
- `p2pesa/src/app/search/page.tsx`
- `p2pesa/src/features/agents/AgentCard.tsx`
- `p2pesa/src/features/agents/AgentProfileFull.tsx`
- `p2pesa/src/features/search/AgentSearchFilter.tsx`
- `p2pesa/src/features/reviews/ReviewCard.tsx`
- `p2pesa/src/features/reviews/ReviewSubmitForm.tsx`
- `p2pesa/src/lib/mockAgents.ts`
- `p2pesa/src/lib/mockReviews.ts`

Demo flow:
> Login → Discover Agents → View Profiles → Verify Trust → Submit Zap-backed Reviews

---

## 🏗️ Architecture Reference

See `bmad_output/planning-artifacts/architecture.md` for full details.

Key patterns:
- Feature-based structure: `src/features/{domain}/`
- Naming: `camelCase` vars, `PascalCase` types/components
- Response wrapper: `{ data: T | null, error: string | null }`
- TypeScript strict mode — no `any`
- External APIs are encapsulated in `src/lib/`

Relay config:
- Pinned relay: `wss://relay.damus.io`
- Fallback relays: `wss://relay.nostr.band,wss://nos.lol,wss://relay.primal.net`

---

## 📁 Current File Map

```text
p2pesa/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── profile/[npub]/page.tsx
│   │   └── search/page.tsx
│   ├── components/
│   │   ├── shared/Navbar.tsx
│   │   └── ui/
│   ├── context/NostrAuthContext.tsx
│   ├── features/
│   │   ├── agents/
│   │   ├── reviews/
│   │   └── search/
│   ├── hooks/useNostrAuth.ts
│   ├── lib/
│   │   ├── bitcoin.ts
│   │   ├── mockAgents.ts
│   │   ├── mockReviews.ts
│   │   ├── nostr.ts
│   │   ├── nostrProfile.ts
│   │   ├── reputation.ts
│   │   └── reputationRelay.ts
│   ├── types/nostr.ts
│   └── __tests__/
└── package.json
```

---

## 🔗 Resources

- **Nostr Setup Guide:** `docs/nostr-setup-guide.md`
- **PRD:** `bmad_output/planning-artifacts/prd.md`
- **Architecture:** `bmad_output/planning-artifacts/architecture.md`
- **Epics & Stories:** `bmad_output/planning-artifacts/epics.md`
- **Session Context:** `docs/session-context.md`
- **NDK Docs:** https://github.com/nostr-dev-kit/ndk
- **Mempool API:** https://mempool.space/api
- **NIP-07:** https://github.com/nostr-protocol/nips/blob/master/07.md
- **NIP-57:** https://github.com/nostr-protocol/nips/blob/master/57.md

---

_Last updated: 2026-06-18 by Rico/Daisy merge resolution._
