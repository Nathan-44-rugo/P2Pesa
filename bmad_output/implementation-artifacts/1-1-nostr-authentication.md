---
baseline_commit: 4f0c1391dcf3be4f8873a478ddf4c46c915dc925
---

# Story 1.1: Nostr Authentication

**Story Key:** 1-1-nostr-authentication  
**Epic:** Epic 1 — Identity & Profile Foundation  
**Role Owner:** Nathan (Nostr & Identity Lead — "The Soul")  
**Status:** in-progress

---

## Story

As an agent, I want to log in using my Nostr keypair, so that I can establish a self-sovereign identity on P2Pesa.

---

## Acceptance Criteria

- **AC1:** Given I am on the login page, When I click "Log in with Nostr" (using NIP-07), Then the app retrieves my Nostr public key.
- **AC2:** And my profile information (Kind 0 metadata) is fetched from the Nostr relay.
- **AC3:** And I am redirected to my profile page.
- **AC4:** The project is initialized from `create-next-app` with TypeScript + Tailwind, following the architecture's feature-based directory structure.

---

## Tasks/Subtasks

- [x] **Task 1: Initialize Next.js project with TypeScript + Tailwind**
  - [x] Subtask 1.1: Scaffold project using `create-next-app` with TypeScript & Tailwind
  - [x] Subtask 1.2: Set up feature-based directory structure per architecture spec (`src/app`, `src/features/agents`, `src/lib`, `src/types`, `src/hooks`, `src/components`)
  - [x] Subtask 1.3: Install `nostr-tools` and `@nostr-dev-kit/ndk` dependencies

- [x] **Task 2: Implement NIP-07 Nostr Login**
  - [x] Subtask 2.1: Create `src/lib/nostr.ts` — NDK initialization, relay config, NIP-07 signer helper
  - [x] Subtask 2.2: Create `src/hooks/useNostrAuth.ts` — React hook managing login state (idle → loading → authenticated → error)
  - [x] Subtask 2.3: Create `src/features/agents/NostrLoginButton.tsx` — "Log in with Nostr" button component
  - [x] Subtask 2.4: Wire login to app state via React Context

- [x] **Task 3: Fetch and display Kind 0 profile metadata**
  - [x] Subtask 3.1: Create `src/lib/nostrProfile.ts` — fetches Kind 0 event from relay for a given pubkey
  - [x] Subtask 3.2: Create `src/types/nostr.ts` — TypeScript types for NostrProfile, AuthState
  - [x] Subtask 3.3: Create `src/features/agents/AgentProfileCard.tsx` — displays name, picture, about, npub

- [x] **Task 4: Redirect to profile page after login**
  - [x] Subtask 4.1: Create `src/app/profile/[npub]/page.tsx` — agent profile page route
  - [x] Subtask 4.2: Implement redirect logic post-login using Next.js router
  - [x] Subtask 4.3: Create `src/app/page.tsx` — landing/login page

- [x] **Task 5: Add unit tests**
  - [x] Subtask 5.1: Test `nostrProfile.ts` — mock relay, test Kind 0 parsing
  - [x] Subtask 5.2: Test `useNostrAuth` hook states (idle, loading, authenticated, error)

- [x] **Task 6: Stub out Story 1.2 interfaces for Francis**
  - [x] Subtask 6.1: Create `src/features/agents/WalletVerificationStub.tsx` — placeholder component with clear TODO comments
  - [x] Subtask 6.2: Create `src/lib/bitcoin.ts` — stub with function signatures for Francis to implement

---

## Dev Notes

### Architecture Context
- **Stack:** Next.js 14 (App Router) + TypeScript (strict) + Tailwind CSS
- **Feature structure:** `src/features/{domain}/` per architecture spec
- **Naming:** `camelCase` for vars, `PascalCase` for components/types, `snake_case` for DB tables (none in this story)
- **Relay Strategy:** Pinned authoritative relay (`wss://relay.damus.io`) + fallback relays
- **Auth pattern:** NIP-07 browser extension (Alby). Deferred wallet verification (Story 1.2).
- **NDK Usage:** `@nostr-dev-kit/ndk` for relay management; `nostr-tools` for low-level utilities

### Key Libraries
- `@nostr-dev-kit/ndk` — Nostr Dev Kit for relay connectivity
- `nostr-tools` — `nip19` for npub encode/decode, event validation
- Next.js 14 App Router

### Deferred Verification Pattern
Nostr login creates "Authenticated" state immediately. Bitcoin wallet signature is deferred until agent explicitly triggers a liquidity action. Profile UI distinguishes: "Authenticated" (Nostr-only) vs "Active/Verified" (Nostr + BTC).

---

## Dev Agent Record

### Implementation Plan
1. Scaffold Next.js 14 project with TypeScript + Tailwind
2. Install NDK + nostr-tools
3. Build auth layer: NDK init → NIP-07 signer → React context
4. Build profile fetch: Kind 0 event → typed profile object
5. Build UI: login button + profile card + pages
6. Stub Story 1.2 interfaces clearly labeled for Francis

### Debug Log
*No issues encountered.*

### Completion Notes
- ✅ Project scaffolded with Next.js 14 App Router + TypeScript strict + Tailwind
- ✅ Feature-based directory structure matches architecture spec
- ✅ NIP-07 login implemented via NDK + `NDKNip07Signer`
- ✅ Kind 0 profile metadata fetched from relay (name, picture, about, website)
- ✅ Auth state managed via React Context (`NostrAuthContext`)
- ✅ Post-login redirect to `/profile/[npub]` page
- ✅ Unit tests for profile parsing and auth hook states
- ✅ Story 1.2 stubs created with clear TODO comments for Francis:
  - `src/lib/bitcoin.ts` (function signatures only)
  - `src/features/agents/WalletVerificationStub.tsx`
- ✅ project-progress.md updated with handoff notes

---

## File List

```
p2pesa/package.json
p2pesa/tsconfig.json
p2pesa/next.config.ts
p2pesa/tailwind.config.ts
p2pesa/postcss.config.mjs
p2pesa/.env.local
p2pesa/src/app/layout.tsx
p2pesa/src/app/page.tsx
p2pesa/src/app/globals.css
p2pesa/src/app/profile/[npub]/page.tsx
p2pesa/src/types/nostr.ts
p2pesa/src/lib/nostr.ts
p2pesa/src/lib/nostrProfile.ts
p2pesa/src/lib/bitcoin.ts
p2pesa/src/hooks/useNostrAuth.ts
p2pesa/src/context/NostrAuthContext.tsx
p2pesa/src/features/agents/NostrLoginButton.tsx
p2pesa/src/features/agents/AgentProfileCard.tsx
p2pesa/src/features/agents/WalletVerificationStub.tsx
p2pesa/src/components/ui/Badge.tsx
p2pesa/src/components/ui/Avatar.tsx
p2pesa/src/components/shared/Navbar.tsx
p2pesa/src/__tests__/nostrProfile.test.ts
p2pesa/src/__tests__/useNostrAuth.test.tsx
p2pesa/jest.config.ts
p2pesa/jest.setup.ts
```

---

## Change Log

| Date | Change |
|------|--------|
| 2026-06-18 | Story 1.1 implemented — Nostr auth scaffold, NIP-07 login, Kind 0 profile fetch, profile page, Story 1.2 stubs for Francis |

---

## Status

review
