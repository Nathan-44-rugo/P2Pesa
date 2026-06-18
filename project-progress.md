# P2Pesa — Project Progress

> **Hackathon:** Bitcoin++ Open Source Edition — Nairobi, Kenya  
> **Submission Deadline:** Thursday June 18, 2026 at 1:00 PM (GMT+03:00)  
> **Judging Expo:** 1:30 PM – 3:30 PM

---

## Development Order

| # | Role | Owner | Story | Status |
|---|------|-------|-------|--------|
| 1 | Nostr & Identity Lead ("The Soul") | **Nathan** | Story 1.1 — Nostr Authentication | ✅ **COMPLETE** |
| 2 | Bitcoin & Verification Lead ("The Trust") | **Francis** | Story 1.2 — Bitcoin Wallet Verification | ✅ **IMPLEMENTED** (pending local run) |
| 3 | Reputation & Protocol Lead ("The Brain") | **Rico** | Stories 2.1, 2.2 — Zap Reviews + Trust Score | ⏳ Waiting on Francis |
| 4 | Frontend & UI Lead ("The Shell") | **Daisy** | Stories 2.1, 3.1 — Profile UI + Search | ⏳ Waiting on Rico |

---

## ✅ Story 1.1 — COMPLETE (Nathan)

**What was built:**

### Project Scaffold
- Next.js 14 (App Router) + TypeScript (strict mode) + Tailwind CSS
- Feature-based directory structure per `architecture.md`
- Relay config via `.env.local` (`NEXT_PUBLIC_PINNED_RELAY`, `NEXT_PUBLIC_FALLBACK_RELAYS`)

### Nostr Identity Layer
- **`src/lib/nostr.ts`** — NDK singleton, relay connection, NIP-07 login via `NDKNip07Signer`
- **`src/lib/nostrProfile.ts`** — Kind 0 event fetching and parsing
- **`src/types/nostr.ts`** — Shared TypeScript types (`NostrProfile`, `AuthState`, `WalletVerification`, `AgentProfile`, `ApiResponse<T>`)
- **`src/context/NostrAuthContext.tsx`** — React Context: idle → loading → authenticated → error state machine
- **`src/hooks/useNostrAuth.ts`** — Convenience hook for the auth context

### UI Components
- **`src/features/agents/NostrLoginButton.tsx`** — "Log in with Nostr" button with all states
- **`src/features/agents/AgentProfileCard.tsx`** — Profile card: avatar, name, npub, about, trust badge
- **`src/components/ui/Badge.tsx`** — Reusable trust badge component
- **`src/components/ui/Avatar.tsx`** — Avatar with image fallback
- **`src/components/shared/Navbar.tsx`** — Top nav with auth state

### Pages (App Router)
- **`src/app/page.tsx`** — Landing page with hero + "Log in with Nostr" + "How it works" section
- **`src/app/profile/[npub]/page.tsx`** — Profile page (fetches Kind 0, shows profile card + deferred wallet section)
- **`src/app/layout.tsx`** — Root layout with `NostrAuthProvider` + `Navbar` + SEO meta

### Tests
- **`src/__tests__/nostrProfile.test.ts`** — Kind 0 parsing: full profile, missing fields, invalid JSON, empty object, display_name variants
- **`src/__tests__/useNostrAuth.test.tsx`** — Auth state machine: idle start, success flow, NIP-07 error, logout, provider guard

### Story 1.2 Stubs (for Francis)
- **`src/lib/bitcoin.ts`** — Full function signatures with `TODO` comments + implementation guide
- **`src/features/agents/WalletVerificationStub.tsx`** — UI component: challenge generation + form + stub verification (simulates success for demo)

---

## ✅ Story 1.2 — IMPLEMENTED (Francis)

**Goal:** Deferred Bitcoin wallet verification flow. Builds cleanly (`npm run build` ✓, type-check ✓).

### What was built

#### `p2pesa/src/lib/bitcoin.ts` — 3 functions implemented (conform to Nathan's contracts):
- `verifyBitcoinSignature(address, signature, challenge)` — real `bitcoinjs-message` verification. Legacy + SegWit (`checkSegwitAlways=true`). Returns `ApiResponse<boolean>`, never throws on bad input.
- `fetchWalletBalance(address)` — Mempool.space `GET /address/:address`, returns net balance in **sats** (confirmed + mempool). Handles 400/404 + network errors.
- `completeWalletVerification(address, signature, challenge)` — verifies signature first (offline), then fetches balance. Returns `ApiResponse<WalletVerification>` with `status: 'verified' | 'failed'`.
- `generateChallenge` + `formatBtcBalance` — kept as Nathan authored them.

#### `p2pesa/src/features/agents/WalletVerificationStub.tsx`
- Stub simulation removed; now calls the real `completeWalletVerification`.

#### Dependencies + config
- Added `bitcoinjs-message` + `buffer` to `package.json`.
- Added a **`Buffer` webpack polyfill** in `next.config.js` (webpack 5 / Next does not provide `Buffer` in the browser, which `bitcoinjs-message` needs).

### MVP decisions
- Address scope: **Legacy + SegWit** only (Taproot/BIP-322 out of scope).
- Signing UX: **manual copy-paste** (address + base64 signature).
- `npub` is embedded in the challenge string → binds signature to Nostr identity (anti-replay).

#### Acceptance Criteria (epics.md Story 1.2) — all wired:
- Logged-in via Nostr → profile → **Verify Wallet Ownership** ✓
- Challenge shown to sign in wallet ✓
- Signature verified client-side ✓
- Balance fetched via Mempool.space ✓
- UI shows **"Verified Balance: X BTC"** + **Active/Verified** ✓ (UI by Nathan, logic by Francis)

#### Env (`.env.local`, optional — defaults to mainnet):
```
NEXT_PUBLIC_MEMPOOL_API=https://mempool.space/api
```

#### Run:
```bash
cd p2pesa
npm install
npm run dev   # → http://localhost:3000
```

### Still TODO (Francis)
- Unit tests for `verifyBitcoinSignature` (known address/message/signature triple).
- Commit + push so Rico (Role 3) can build on verified data.

---

## 🏗️ Architecture Reference

See `bmad_output/planning-artifacts/architecture.md` for full details.

**Key patterns:**
- Feature-based structure: `src/features/{domain}/`
- Naming: `camelCase` vars, `PascalCase` types/components
- Response wrapper: `{ data: T | null, error: string | null }`
- TypeScript strict mode — no `any`
- All external APIs (Nostr relays, Mempool) encapsulated in `src/lib/`

**Relay config:**  
Pinned relay = `wss://relay.damus.io` (authoritative)  
Fallback = `wss://relay.nostr.band,wss://nos.lol,wss://relay.primal.net`

---

## 📁 Project File Map

```
p2pesa/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (NostrAuthProvider, Navbar, SEO)
│   │   ├── page.tsx            ← Landing/login page  [Nathan ✅]
│   │   ├── globals.css
│   │   └── profile/[npub]/
│   │       └── page.tsx        ← Agent profile page  [Nathan ✅]
│   ├── context/
│   │   └── NostrAuthContext.tsx ← Auth state machine  [Nathan ✅]
│   ├── features/
│   │   └── agents/
│   │       ├── NostrLoginButton.tsx       [Nathan ✅]
│   │       ├── AgentProfileCard.tsx       [Nathan ✅]
│   │       └── WalletVerificationStub.tsx [Francis 🔜 — implement TODOs]
│   ├── lib/
│   │   ├── nostr.ts            ← NDK + NIP-07 login  [Nathan ✅]
│   │   ├── nostrProfile.ts     ← Kind 0 fetch/parse  [Nathan ✅]
│   │   └── bitcoin.ts          ← BTC verification    [Francis 🔜 — implement TODOs]
│   ├── hooks/
│   │   └── useNostrAuth.ts     [Nathan ✅]
│   ├── types/
│   │   └── nostr.ts            ← Shared types        [Nathan ✅]
│   ├── components/
│   │   ├── ui/Badge.tsx        [Nathan ✅]
│   │   ├── ui/Avatar.tsx       [Nathan ✅]
│   │   └── shared/Navbar.tsx   [Nathan ✅]
│   └── __tests__/
│       ├── nostrProfile.test.ts   [Nathan ✅]
│       └── useNostrAuth.test.tsx  [Nathan ✅]
├── .env.local          ← Set relay URLs here
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── jest.config.ts
└── next.config.ts
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
- **NIP-57 (Zaps):** https://github.com/nostr-protocol/nips/blob/master/57.md (Rico — Story 2.1)

---
_Last updated: 2026-06-18 by Nathan (Story 1.1 complete — handoff to Francis)_
_Last updated: 2026-06-18 by Francis (Story 1.2 implemented — handoff to Rico)_
