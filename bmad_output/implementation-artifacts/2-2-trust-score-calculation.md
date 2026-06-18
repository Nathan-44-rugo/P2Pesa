---
baseline_commit: NO_VCS_SAFE_DIRECTORY_BLOCKED
---

# Story 2.2: Trust Score Calculation (Ingestion Worker)

**Story Key:** 2-2-trust-score-calculation
**Epic:** Epic 2 - Reputation & Trust Layer
**Role Owner:** Rico (Reputation & Protocol Lead - "The Brain")
**Status:** review

---

## Story

As a trader, I want to see an agent's trust score calculated in real time based on their verified wallet history and Zap-gated reviews, so that I can make a data-driven decision.

---

## Acceptance Criteria

- **AC1:** Given the lightweight Nostr indexer is running, when it detects a new review event with a valid NIP-57 zap receipt, then it validates the Zap payment signal.
- **AC2:** When I load an agent's profile page, then the UI fetches review events from the configured pinned/fallback relays.
- **AC3:** And the trust score is calculated based on verified trade count plus Zap-backed reviews.
- **AC4:** And the trust score is displayed prominently on the profile.

---

## Tasks/Subtasks

- [x] **Task 1: Implement trust score calculation logic** (AC: 1, 3)
  - [x] Count verified wallet state as one verified trade signal.
  - [x] Count only reviews with at least 1 sat of zap backing.
  - [x] Calculate average rating, total zap sats, and a bounded score from 0-100.
  - [x] Track last updated time from reviews or wallet verification.

- [x] **Task 2: Implement lightweight relay indexer behavior in the client** (AC: 1, 2)
  - [x] Fetch P2Pesa review events by agent `p` tag from pinned/fallback relays.
  - [x] Deduplicate events by event ID.
  - [x] Parse events through the same validation contracts used by review submission.
  - [x] Surface relay fallback/errors without blocking the profile page.

- [x] **Task 3: Display trust score on the agent profile** (AC: 3, 4)
  - [x] Replace Rico placeholder card with a live trust score panel.
  - [x] Show score, verified trade count, zap-backed review count, average rating, zap sats, and last updated timestamp.
  - [x] Keep eventual consistency messaging visible for relay-backed data.

- [x] **Task 4: Add tests** (AC: 1, 3)
  - [x] Test that only zap-backed reviews count.
  - [x] Test that verified wallet status contributes to the score.
  - [x] Test score summary fields for Daisy's UI integration.

---

## Dev Notes

### Architecture Context

- The architecture calls for a lightweight Nostr indexer that filters review events and uses a pinned relay as the authoritative UI source.
- For hackathon scope, this implementation runs the indexer behavior client-side by querying configured relays for P2Pesa review events.
- The design remains portable: reputation data lives in signed Nostr events, not in a centralized database.
- No backend service or database was introduced.

### Trust Score Formula

- `verifiedTradeCount`: `1` when current wallet state is `verified`, otherwise `0`.
- `zapBackedReviewCount`: count of reviews with `zapAmountMsats >= 1000`.
- `averageRating`: mean rating across zap-backed reviews only.
- `totalZapSats`: total zap backing converted from millisats.
- `score`: bounded 0-100 composite of wallet verification, average rating, and zap volume.

### Project Structure Notes

- New files:
  - `p2pesa/src/features/reviews/TrustScorePanel.tsx`
  - `p2pesa/src/lib/reputation.ts`
  - `p2pesa/src/lib/reputationRelay.ts`
  - `p2pesa/src/__tests__/reputation.test.ts`
- Updated files:
  - `p2pesa/src/types/nostr.ts`
  - `p2pesa/src/app/profile/[npub]/page.tsx`

### References

- `bmad_output/planning-artifacts/epics.md` - Story 2.2 acceptance criteria.
- `bmad_output/planning-artifacts/architecture.md` - lightweight Nostr indexer, pinned relay, fallback relay, eventual consistency.
- NIP-57 official spec: https://github.com/nostr-protocol/nips/blob/master/57.md
- NIP-01 official spec: https://github.com/nostr-protocol/nips/blob/master/01.md

---

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd test -- --runInBand` passed.
- `npm.cmd run build` passed.
- Fixed build-time type conflict by using the existing NIP-07 `window.nostr` type instead of redeclaring it.
- Git baseline capture was blocked by safe-directory ownership; `baseline_commit` records that condition.

### Completion Notes List

- Implemented reusable trust score calculation and review event parsing.
- Implemented client-side lightweight relay indexing for P2Pesa review events.
- Replaced the profile placeholder with a live trust score panel.
- Added tests proving zap-backed-only scoring and verified-wallet contribution.

### File List

```
p2pesa/src/app/profile/[npub]/page.tsx
p2pesa/src/features/reviews/TrustScorePanel.tsx
p2pesa/src/lib/reputation.ts
p2pesa/src/lib/reputationRelay.ts
p2pesa/src/types/nostr.ts
p2pesa/src/__tests__/reputation.test.ts
```

---

## Change Log

| Date | Change |
|------|--------|
| 2026-06-18 | Story 2.2 implemented by Rico - trust score algorithm, client relay indexing, profile score panel, tests |

---

## Status

review
