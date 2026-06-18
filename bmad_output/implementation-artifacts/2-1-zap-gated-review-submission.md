---
baseline_commit: NO_VCS_SAFE_DIRECTORY_BLOCKED
---

# Story 2.1: Zap-Gated Review Submission

**Story Key:** 2-1-zap-gated-review-submission
**Epic:** Epic 2 - Reputation & Trust Layer
**Role Owner:** Rico (Reputation & Protocol Lead - "The Brain")
**Status:** review

---

## Story

As a trader, I want to submit a 5-star review for an agent along with a small Lightning payment (Zap), so that my review is officially "Verified" and counts toward their trust score.

---

## Acceptance Criteria

- **AC1:** Given I have completed a trade with an agent, when I navigate to the agent's profile and click "Review", then the UI prompts for a rating and comment.
- **AC2:** When I confirm the review and send the required Zap, then the app validates a NIP-57 zap receipt for that agent.
- **AC3:** Then the app signs and publishes a Nostr review event containing the review content and a reference to the zap receipt.
- **AC4:** And the UI indicates "Review Submitted & Verified."

---

## Tasks/Subtasks

- [x] **Task 1: Define reputation and review data contracts** (AC: 2, 3)
  - [x] Add typed review, zap receipt, Nostr event, and trust score models to shared types.
  - [x] Keep contracts compatible with the existing `ApiResponse<T>` wrapper.

- [x] **Task 2: Implement zap receipt validation and review event creation** (AC: 2, 3)
  - [x] Parse NIP-57 kind `9735` zap receipt JSON.
  - [x] Verify the receipt targets the reviewed agent via the `p` tag.
  - [x] Require at least 1 sat (`1000` millisats) before a review can count.
  - [x] Create a P2Pesa review event with rating, comment, zap receipt ID, zap amount, and receipt payload.

- [x] **Task 3: Build review submission UI** (AC: 1, 4)
  - [x] Add a profile-page review form for authenticated traders viewing another agent.
  - [x] Capture rating, comment, and NIP-57 zap receipt JSON.
  - [x] Show validation errors and the "Review Submitted & Verified." success state.

- [x] **Task 4: Sign and publish review events** (AC: 3)
  - [x] Use NIP-07 `window.nostr.signEvent` for user signing.
  - [x] Publish signed review events to configured P2Pesa relays with WebSocket `EVENT`.
  - [x] Treat success on any configured relay as accepted for MVP resilience.

- [x] **Task 5: Add tests** (AC: 2, 3)
  - [x] Test valid zap receipt parsing.
  - [x] Test rejection of wrong-agent and wrong-kind receipts.
  - [x] Test review event creation and parsing.

---

## Dev Notes

### Architecture Context

- Followed existing feature-based structure: `src/features/reviews/` for UI, `src/lib/` for protocol logic, `src/types/` for shared contracts.
- Existing Nostr relay configuration remains authoritative in `src/lib/nostr.ts`; review publishing reuses `RELAY_URLS`.
- Existing NIP-07 login remains unchanged. Review signing uses the same browser signer surface.
- No new dependencies were added.

### Protocol Notes

- NIP-57 defines zap receipts as kind `9735`; receipts include the zap recipient in the `p` tag and may include amount directly or in the zap request description.
- P2Pesa MVP does not implement LNURL invoice creation. The user provides the zap receipt JSON after paying through a Lightning wallet/client.
- Review events use P2Pesa app-specific kind `1985` for hackathon MVP isolation.

### Project Structure Notes

- New files:
  - `p2pesa/src/lib/reputation.ts`
  - `p2pesa/src/lib/reputationRelay.ts`
  - `p2pesa/src/features/reviews/ReviewSubmissionForm.tsx`
  - `p2pesa/src/__tests__/reputation.test.ts`
- Updated files:
  - `p2pesa/src/types/nostr.ts`
  - `p2pesa/src/app/profile/[npub]/page.tsx`

### References

- `bmad_output/planning-artifacts/epics.md` - Story 2.1 acceptance criteria.
- `bmad_output/planning-artifacts/architecture.md` - relay strategy, feature structure, Nostr portability constraints.
- NIP-57 official spec: https://github.com/nostr-protocol/nips/blob/master/57.md
- NIP-07 official spec: https://github.com/nostr-protocol/nips/blob/master/07.md

---

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm.cmd test -- --runInBand` passed.
- `npm.cmd run build` passed.
- `npm.ps1` was blocked by local PowerShell execution policy; reran with `npm.cmd`.
- Initial `npm install` needed elevated execution because dependencies and npm cache were unavailable in the sandbox.
- Git baseline capture was blocked by safe-directory ownership; `baseline_commit` records that condition.

### Completion Notes List

- Implemented zap-gated review parsing, validation, unsigned event creation, NIP-07 signing, and relay publishing.
- Added a profile review form visible to authenticated users reviewing another agent.
- Added tests for zap receipt validation and review event creation/parsing.
- Kept LNURL zap initiation out of scope; the MVP accepts a NIP-57 receipt JSON as proof after payment.

### File List

```
p2pesa/src/app/profile/[npub]/page.tsx
p2pesa/src/features/reviews/ReviewSubmissionForm.tsx
p2pesa/src/lib/reputation.ts
p2pesa/src/lib/reputationRelay.ts
p2pesa/src/types/nostr.ts
p2pesa/src/__tests__/reputation.test.ts
```

---

## Change Log

| Date | Change |
|------|--------|
| 2026-06-18 | Story 2.1 implemented by Rico - zap-gated review submission, NIP-57 receipt validation, NIP-07 signing, relay publishing, tests |

---

## Status

review
