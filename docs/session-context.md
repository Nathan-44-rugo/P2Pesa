# P2Pesa — Team Task Division & Session Context

**Date:** 2026-06-17
**Team Size:** 4 People
**Goal:** Deliver a functional P2Pesa MVP for the Bitcoin++ Hackathon.

## Chronological Development Division

To ensure a smooth dependency flow, team members should tackle work in this order:

### 1. Nostr & Identity Lead (The "Soul" - Foundation) - Nathan
*   **Focus:** Nostr NDK, NIP-07 (Login), and Relay communication.
*   **Priority:** #1 (Highest) — You cannot build the rest without identity.
*   **Key Tasks:**
    *   Initialize the project from the `create-next-app` starter.
    *   Implement "Login with Nostr" using browser extensions (Alby).
    *   Handle profile metadata (Kind 0) fetching and display.
    *   **Primary Story Coverage:** Story 1.1.

### 2. Bitcoin & Verification Lead (The "Trust" - Foundation) - Francis
*   **Focus:** `bitcoinjs-lib`, Bitcoin message signing, and Mempool.space API.
*   **Priority:** #2 — Necessary to verify the identities registered in Phase 1.
*   **Key Tasks:**
    *   Build out the backend/mock architecture for the "Deferred Verification" signature flow.
    *   Integrate simulated Mempool.space API logic to fetch demo balances.
    *   **Primary Story Coverage:** Story 1.2 (Currently stubbed for hackathon demo).

### 3. Reputation & Protocol Lead (The "Brain" - Value-Add) - Rico
*   **Focus:** Zap-Gating (NIP-57) and Trust Score algorithm.
*   **Priority:** #3 — Deferred to post-hackathon roadmap.
*   **Key Tasks:**
    *   Designed the trust score algorithm architecture.
    *   **Primary Story Coverage:** Story 2.1, 2.2 (Architectural design only for MVP).

### 4. Frontend & UI Lead (The "Shell" - Integration) - Daisy
*   **Focus:** Premium Btrust styling and UI integration.
*   **Priority:** #4 — Orchestrates the final presentation.
*   **Key Tasks:**
    *   Implement premium UI overhaul based on `btrust.tech`.
    *   Build the Agent Profile Page + Wallet Verification Stub UI.
    *   **Primary Story Coverage:** UI/UX final touches.

## Project Resources
*   **PRD:** `bmad_output/planning-artifacts/prd.md`
*   **Architecture:** `bmad_output/planning-artifacts/architecture.md`
*   **Stories:** `bmad_output/planning-artifacts/epics.md`
*   **Pitch:** `docs/chat-context.md`
