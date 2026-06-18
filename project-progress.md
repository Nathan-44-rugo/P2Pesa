# P2Pesa — Project Progress

> **Hackathon:** Bitcoin++ Open Source Edition — Nairobi, Kenya  
> **Submission Deadline:** Thursday June 18, 2026 at 1:00 PM (GMT+03:00)  
> **Judging Expo:** 1:30 PM – 3:30 PM

---

## Development Order

| # | Role | Owner | Story | Status |
|---|------|-------|-------|--------|
| 1 | Nostr & Identity Lead ("The Soul") | **Nathan** | Story 1.1 — Nostr Authentication | ✅ **COMPLETE** |
| 2 | Bitcoin & Verification Lead ("The Trust") | **Francis** | Story 1.2 — Bitcoin Wallet Verification | 🔜 **READY FOR YOU** |
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

## 🔜 Story 1.2 — FOR FRANCIS (Bitcoin & Verification Lead)

**Your goal:** Implement the deferred Bitcoin wallet verification flow.

### What Nathan left for you

#### Files to implement (search for `TODO` comments):

1. **`p2pesa/src/lib/bitcoin.ts`** — Implement these 3 functions:
   - `verifyBitcoinSignature(address, signature, challenge)` — verify the Bitcoin message signature
   - `fetchWalletBalance(address)` — fetch balance from Mempool.space API
   - `completeWalletVerification(address, signature, challenge)` — orchestrates both above

2. **`p2pesa/src/features/agents/WalletVerificationStub.tsx`** — Replace the stub call in `handleSubmitSignature` with:
   ```ts
   import { completeWalletVerification } from '@/lib/bitcoin';
   const result = await completeWalletVerification(address, signature, challenge);
   ```

#### Install these extra libraries:
```bash
npm install bitcoinjs-message bitcoinjs-lib
# OR use the lighter alternative:
npm install @noble/secp256k1
```

#### Acceptance Criteria (from epics.md Story 1.2):
- Given logged-in via Nostr → User navigates to "Post My Liquidity" → clicks "Verify Wallet Ownership"
- App triggers Bitcoin wallet signature request  
- User signs the challenge message with their Bitcoin wallet
- App fetches balance via Mempool.space API
- Profile UI updates to show **"Verified Balance: X BTC"** + **"Active/Verified"** badge

#### Key architecture rules:
- All Bitcoin/Mempool logic stays in `src/lib/bitcoin.ts`  
- `completeWalletVerification` returns `ApiResponse<WalletVerification>` — types are already defined in `src/types/nostr.ts`
- Relay/Mempool URL is in `.env.local`: `NEXT_PUBLIC_MEMPOOL_API=https://mempool.space/api`

#### How to run the dev server:
```bash
cd p2pesa
npm run dev
# → http://localhost:3000
```

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
