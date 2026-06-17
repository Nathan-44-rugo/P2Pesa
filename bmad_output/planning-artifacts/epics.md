---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['bmad_output/planning-artifacts/prd.md', 'bmad_output/planning-artifacts/architecture.md', 'docs/chat-context.md', 'docs/hackathon-context.txt']
---

# P2Pesa - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for P2Pesa, decomposing the requirements from the PRD, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User authentication via Nostr keypair (NIP-07).
FR2: Agent Bitcoin wallet ownership verification via cryptographic signature.
FR3: Submit review + Zap (Zap-Gated reputation).
FR4: Display Trust Score (composite of wallet activity, reviews, and swap attestations).
FR5: Search/filter agents by trust score and location.

### NonFunctional Requirements

NFR1: Portability (Reputation data resides on Nostr relays).
NFR2: Performance (Fast lookup and rendering of reputation data).
NFR3: Security (Minimize centralized data).
NFR4: Eventual Consistency (Display reputation badges e.g., "Last updated X minutes ago").

### Additional Requirements

- Starter Template: Next.js + TypeScript + Tailwind.
- Ingestion Worker: Lightweight Nostr Indexer (filters Kind 1 + NIP-57).
- Auth Flow: Deferred Verification (Nostr Login first, BTC wallet signature triggered only on liquidity action).
- Relay Strategy: "Pinned" authoritative relay for UI, fallback to community relays if offline.
- UX Requirement: "Invisible Zap-gate" (abstracted Lightning payment).

### UX Design Requirements

UX-DR1: Agent profile page showing Nostr ID, verified BTC balance, and reviews.
UX-DR2: Intuitive review submission flow.
UX-DR3: Unified "Secure Access & Verify Liquidity" button flow (sequential auto-popups with visual feedback).

### FR Coverage Map

FR1: Epic 1 - Identity setup
FR2: Epic 1 - Identity setup
FR3: Epic 2 - Reputation
FR4: Epic 2 - Reputation
FR5: Epic 3 - Discovery

## Epic List

### Epic 1: Identity & Profile Foundation
Enable agents to establish a verifiable P2Pesa presence via Nostr and prove liquidity via Bitcoin wallet signing.
**FRs covered:** FR1, FR2

### Story 1.1: Nostr Authentication
As an agent, I want to log in using my Nostr keypair, so that I can establish a self-sovereign identity on P2Pesa.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Log in with Nostr" (using NIP-07)
**Then** the app retrieves my Nostr public key
**And** my profile information is fetched from the Nostr relay
**And** I am redirected to my profile page.

### Story 1.2: Bitcoin Wallet Verification
As an agent, I want to sign a challenge message with my Bitcoin wallet, so that I can cryptographically prove I own the funds I'm listing for trade.

**Acceptance Criteria:**

**Given** I have successfully logged in via Nostr
**When** I navigate to "Post My Liquidity"
**And** I click "Verify Wallet Ownership"
**Then** the app triggers a Bitcoin wallet signature request
**When** I successfully sign the challenge message
**Then** the app fetches the balance of the signed address via Mempool.space API
**And** my profile UI is updated to show "Verified Balance: X BTC" and an "Active/Verified" badge.

### Epic 2: Reputation & Trust Layer
Enable community-driven, economically-anchored trust via Zap-Gated reviews.
**FRs covered:** FR3, FR4

### Story 2.1: Zap-Gated Review Submission
As a trader, I want to submit a 5-star review for an agent along with a small Lightning payment (Zap), so that my review is officially "Verified" and counts toward their trust score.

**Acceptance Criteria:**

**Given** I have completed a trade with an agent
**When** I navigate to the agent's profile and click "Review"
**Then** the UI prompts for a rating and comment
**When** I confirm the review and send the required Zap (Lightning payment)
**Then** the app signs and publishes a Nostr event containing both the review and the Zap-receipt (NIP-57)
**And** the UI indicates "Review Submitted & Verified."

### Story 2.2: Trust Score Calculation (Ingestion Worker)
As a trader, I want to see an agent's trust score calculated in real-time based on their verified wallet history and Zap-gated reviews, so that I can make a data-driven decision.

**Acceptance Criteria:**

**Given** the "Ingestion Worker" (Nostr Indexer) is running
**When** it detects a new review event with a valid Zap-receipt (NIP-57) on the network
**Then** it validates the Zap payment and authoritatively updates the agent's profile event on the pinned relay
**When** I load an agent's profile page
**Then** the UI fetches the agent's profile data from the pinned relay
**And** the trust score is calculated based on: (Verified Trade Count + Zap-backed Reviews)
**And** the trust score is displayed prominently on the profile.

### Epic 3: Discovery & Search
Enable users to find and compare agents by trust score.
**FRs covered:** FR5

### Story 3.1: Agent Search & Filtering
As a trader, I want to search and filter agents by location and trust score, so that I can find the most reliable and convenient agent for my trade.

**Acceptance Criteria:**

**Given** I am on the agent search page
**When** I enter my location or browse the agent list
**Then** the app displays agents sorted by their Trust Score
**When** I apply filters (e.g., "Minimum 4.0 Rating" or "Liquidity > 0.1 BTC")
**Then** the agent list is updated to show only those who meet my criteria.
