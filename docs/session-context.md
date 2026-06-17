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
    *   Implement the "Deferred Verification" signature flow for agents.
    *   Verify Bitcoin wallet signatures cryptographically on the client side.
    *   Integrate the Mempool.space API to fetch real-time liquidity/balances.
    *   **Primary Story Coverage:** Story 1.2.

### 3. Reputation & Protocol Lead (The "Brain" - Value-Add) - Rico
*   **Focus:** Zap-Gating (NIP-57), Ingestion Worker, and Trust Score algorithm.
*   **Priority:** #3 — Builds on verified identities.
*   **Key Tasks:**
    *   Implement the "Invisible Zap-gate" (Lightning payment verification).
    *   Develop the "Lightweight Nostr Indexer" (Ingestion Worker) to sync authoritative data.
    *   Write the open-source Trust Score calculation logic.
    *   **Primary Story Coverage:** Story 2.1, 2.2.

### 4. Frontend & UI Lead (The "Shell" - Integration) - Daisy
*   **Focus:** Soapbox UI integration, search, and final polishing.
*   **Priority:** #4 — Orchestrates the final user journey by stitching the foundation and value-add components together.
*   **Key Tasks:**
    *   Build the reusable UI components.
    *   Build the Agent Profile Page + Review Submission UI.
    *   Build the Agent Search/Filter interface.
    *   **Primary Story Coverage:** Story 2.1, 3.1.

## Project Resources
*   **PRD:** `bmad_output/planning-artifacts/prd.md`
*   **Architecture:** `bmad_output/planning-artifacts/architecture.md`
*   **Stories:** `bmad_output/planning-artifacts/epics.md`
*   **Pitch:** `docs/chat-context.md`
