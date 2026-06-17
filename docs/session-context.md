# P2Pesa — Team Task Division & Session Context

**Date:** 2026-06-17
**Team Size:** 4 People
**Goal:** Deliver a functional P2Pesa MVP for the Bitcoin++ Hackathon.

## Development Division (4 Roles)

To maximize efficiency during the hackathon, the work is divided into four distinct technical domains. Each team member should lead one area:

### Role 1: Frontend & UI Lead (The "Shell")
*   **Focus:** Next.js App Router, Tailwind CSS, and Soapbox UI integration.
*   **Key Tasks:**
    *   Initialize the project from the `create-next-app` starter.
    *   Build the reusable "Soapbox-style" UI components (Buttons, Cards, Profile layouts).
    *   Manage overall app navigation and routing (Home, Profile, Search).
    *   **Primary Story Coverage:** UI elements of 1.1, 2.1, and 3.1.

### Role 2: Nostr & Identity Lead (The "Soul")
*   **Focus:** Nostr NDK, NIP-07 (Login), and Relay communication.
*   **Key Tasks:**
    *   Implement "Login with Nostr" using browser extensions (Alby).
    *   Handle profile metadata (Kind 0) fetching and display.
    *   Implement event publishing for Reviews (Kind 1) and metadata updates.
    *   **Primary Story Coverage:** Story 1.1, 2.1.

### Role 3: Bitcoin & Verification Lead (The "Trust")
*   **Focus:** `bitcoinjs-lib`, Bitcoin message signing, and Mempool.space API.
*   **Key Tasks:**
    *   Implement the "Deferred Verification" signature flow for agents.
    *   Verify Bitcoin wallet signatures cryptographically on the client side.
    *   Integrate the Mempool.space API to fetch real-time liquidity/balances.
    *   **Primary Story Coverage:** Story 1.2.

### Role 4: Reputation & Protocol Lead (The "Brain")
*   **Focus:** Zap-Gating (NIP-57), Ingestion Worker, and Trust Score algorithm.
*   **Key Tasks:**
    *   Implement the "Invisible Zap-gate" (Lightning payment verification).
    *   Develop the "Lightweight Nostr Indexer" (Ingestion Worker) to sync authoritative data.
    *   Write the open-source Trust Score calculation logic (Verified Trades + Zaps).
    *   **Primary Story Coverage:** Story 2.2, 3.1.

## Project Resources
*   **PRD:** `bmad_output/planning-artifacts/prd.md`
*   **Architecture:** `bmad_output/planning-artifacts/architecture.md`
*   **Stories:** `bmad_output/planning-artifacts/epics.md`
*   **Pitch:** `docs/chat-context.md`
