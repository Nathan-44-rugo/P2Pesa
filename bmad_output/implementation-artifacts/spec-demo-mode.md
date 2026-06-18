---
title: 'spec-demo-mode'
type: 'feature'
created: '2026-06-18'
status: 'done'
baseline_commit: 'e29c02be021e595f90ccdf027a18cd7bfdfcd268'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** When a user or judge logs in via Nostr, their profile is completely empty (0 trades, 0 reviews, 0 score). Furthermore, manually signing challenge messages in a Bitcoin wallet and constructing raw NIP-57 Zap Receipt JSON to write a review are high-friction operations that prevent quick evaluation during hackathon judging.

**Approach:** Introduce a global "Demo Mode" toggle in the Navbar that persists in local storage. When active, it seeds fallback profiles with realistic trade history and reviews, provides a one-click "Quick Verify (Demo)" button to mock Bitcoin wallet verification, and offers a "Generate Demo Zap" helper to auto-populate a valid Zap Receipt JSON.

## Boundaries & Constraints

**Always:**
- Keep all mock/seed bypasses at the component and state level. The underlying cryptographic libraries in `bitcoin.ts` and `reputation.ts` must remain untouched and correct.
- Persist the toggle value in `localStorage` so it survives navigation and page refreshes.
- Ensure that disabling Demo Mode immediately hides seeded mock data and restores clean/empty live profiles.

**Ask First:**
- None.

**Never:**
- Never disable or modify existing unit tests for cryptography or authentication.
- Never write mock data to Nostr relays.

</frozen-after-approval>

## Code Map

- `p2pesa/src/context/NostrAuthContext.tsx` -- Exposes global `demoMode` state and `toggleDemoMode` function.
- `p2pesa/src/components/shared/Navbar.tsx` -- Displays toggle switch / button in the nav header.
- `p2pesa/src/features/agents/AgentProfileFull.tsx` -- Feeds realistic reviews and stats to new/fallback profiles when Demo Mode is active.
- `p2pesa/src/features/agents/WalletVerificationStub.tsx` -- Adds a button to instantly bypass signing with a mock segment.
- `p2pesa/src/features/reviews/ReviewSubmitForm.tsx` -- Adds a button to populate valid NIP-57 Zap JSON for the target agent.

## Tasks & Acceptance

**Execution:**
- [x] `p2pesa/src/context/NostrAuthContext.tsx` -- Add `demoMode: boolean` and `toggleDemoMode: () => void` to context value, load/save from `localStorage` under `p2pesa_demo_mode`.
- [x] `p2pesa/src/components/shared/Navbar.tsx` -- Add a clean visual toggle button in the Navbar that switches global Demo Mode.
- [x] `p2pesa/src/features/agents/AgentProfileFull.tsx` -- Inject mock reviews and initial trust score attributes for fallback agents (who are not in the predefined `MOCK_AGENTS` list) when `demoMode` is enabled.
- [x] `p2pesa/src/features/agents/WalletVerificationStub.tsx` -- Add a "Fill Demo Wallet & Signature" button when `demoMode` is enabled that fills standard demo inputs and triggers successful verification.
- [x] `p2pesa/src/features/reviews/ReviewSubmitForm.tsx` -- Add a "Generate Demo Zap Receipt JSON" button when `demoMode` is enabled that generates a valid NIP-57 Kind 9735 receipt matching the target agent.

**Acceptance Criteria:**
- Given I am on the home page, when I toggle Demo Mode ON, then the app state persists across refreshes.
- Given I log in as a new user, when Demo Mode is ON, then my profile displays seeded mock reviews, a non-zero trade count, and a calculated trust score.
- Given Demo Mode is ON and I view the Wallet Verification section, when I click "Fill Demo Wallet & Signature", then a valid mock signature and address are populated, and clicking submit successfully activates verified status.
- Given Demo Mode is ON and I write a review, when I click "Generate Demo Zap Receipt JSON", then a correctly formatted NIP-57 receipt is inserted into the text field, and submission succeeds.

## Design Notes

The Demo Mode Navbar button will display a custom Lightning icon and colored border:
- ON: Orange border and icon, active badge text: "Demo Mode Active"
- OFF: Normal gray border/text.

Mock reviews to seed for fallback agent in Demo Mode:
```typescript
const SEED_DEMO_REVIEWS = (agentNpub: string) => [
  {
    id: 'demo_rev_1',
    agentNpub,
    reviewerNpub: 'npub1reviewer999',
    reviewerProfile: { npub: 'npub1reviewer999', pubkey: 'reviewer999', display_name: 'Alice K.' },
    rating: 5,
    content: 'Excellent transaction. Quick response time and verified balance was correct.',
    zapAmountSats: 2100,
    zapVerified: true,
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'demo_rev_2',
    agentNpub,
    reviewerNpub: 'npub1reviewer888',
    reviewerProfile: { npub: 'npub1reviewer888', pubkey: 'reviewer888', display_name: 'Ben M.' },
    rating: 4,
    content: 'Reliable mobile money swap. Slight delay but very honest.',
    zapAmountSats: 1000,
    zapVerified: true,
    createdAt: Date.now() - 3600000 * 12,
  }
];
```

## Verification

**Commands:**
- `npm run build` -- expected: successful next.js compile.
- `npm test` -- expected: all 20 tests pass.
