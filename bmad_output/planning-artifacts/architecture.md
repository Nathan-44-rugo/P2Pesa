---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: ['bmad_output/planning-artifacts/prd.md', 'docs/chat-context.md']
workflowType: 'architecture'
project_name: 'P2Pesa'
user_name: 'Frarico'
date: '2026-06-17'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- Agent Profile: Nostr ID (NIP-07), verified BTC balance (Mempool API), Zap-backed reviews.
- Review Flow: Users submit review + Zap.
- Agent Search: Browse/filter agents by trust score and location.

**Non-Functional Requirements:**
- Performance: Fast lookup and rendering of reputation data is critical.
- Security: Cryptographic verification is the primary trust mechanism; minimize centralized data.
- Portability: Reputation data MUST reside on Nostr relays.

**Scale & Complexity:**
- Primary domain: Full-stack decentralized web application.
- Complexity level: Medium (Decentralized protocols + Lightning Network).
- Estimated architectural components: 4-5 (Frontend, Nostr Client, Bitcoin/Lightning Interface, Local Caching/Indexing service).

### Technical Constraints & Dependencies
- Soapbox Dependency: Utilize existing Soapbox open-source components for the social UI.
- Protocol Dependency: Nostr relays and Lightning Network (for Zaps).

### Cross-Cutting Concerns Identified
- Sybil Resistance: Ensuring the Zap-gate remains economically resistant is the highest priority concern.
- Data Consistency: Syncing reputation events across multiple Nostr relays.

### Architectural Direction
The proposed "Hybrid Reputation Model":
1. High-Confidence Data: Pinned to a dedicated, high-availability relay for consistency.
2. Transient Data: Broader social proof propagates normally.
3. Invisible Zap-gate: Abstracted Lightning payment within the Soapbox UI.

## Architectural Findings (Roundtable)

**System Architect Perspective (Winston):**
- **Strategy:** Define the "pinned" relay as the "Authoritative Feed" for the UI. Implement an ingestion worker to backfill it.
- **Consistency:** Explicitly adopt "eventual consistency" and communicate this to users via UI status badges (e.g., "Last updated X minutes ago") to ensure MVP resilience.

**Senior Software Engineer Perspective (Amelia):**
- **Starter Strategy:** Be ruthless with bundle size—use dynamic imports for heavy crypto libraries (`nostr-tools`).
- **Development:** Use established, lightweight wrappers for relay connectivity rather than building from scratch.

## Architectural Enhancement (via First Principles Analysis)

**The P2Pesa Ingestion Worker:**
- **Refinement:** Move from a "Custom Backend Worker" to a "Lightweight Nostr Indexer".
- **Logic:** Filter events on the network for Kind 1 (Reviews) + NIP-57 (Zap-receipts).
- **Result:** Instead of parsing and managing data in a custom DB, the indexer forwards validated events directly to the authoritative P2Pesa relay. This leverages the protocol natively rather than fighting it, drastically reducing MVP development complexity and maintenance.

## Architectural Mitigation (via Second-Order Thinking)

**Relay Centralization Risk (The "Authoritative Relay" bottleneck):**
- **Mitigation:** The UI must degrade gracefully. If the authoritative relay is unreachable, the client falls back to a pre-defined list of community-trusted relays, ensuring the app remains usable even if slower (UI explicitly marks "Eventual Consistency" state).

**Zap-Gate Exclusivity Risk (The "Pay-to-Play" reputation):**
- **Mitigation:** Keep the Zap amount microscopic (e.g., 1-5 sats). Allow "low-trust" vouches to exist in the feed without Zaps, but strictly exclude them from the algorithmic "Trust Score" until they are Zap-backed. This keeps the ecosystem inclusive while ensuring score integrity.

## Architectural Enhancement (via Cross-Functional War Room)

**Deferred Verification Pattern:**
- **Refinement:** Shift from "Sequential Auth" (Nostr login -> Wallet Sign) at login to "Deferred Verification".
- **Logic:** Nostr-only login creates an "Authenticated" state (instant). Bitcoin wallet signature is deferred until the agent explicitly performs a liquidity-sensitive action (e.g., "Post My Liquidity" or "Initiate Trade").
- **Result:** Eliminates high initial friction for mobile users. The profile UI clearly distinguishes between "Authenticated" (Nostr-verified) and "Active/Verified" (Nostr + Bitcoin-verified) agents, creating trust through transparency rather than mandatory upfront friction.

## Implementation Patterns & Consistency Rules

### Naming Patterns
- **Database/Backend:** `camelCase` for variables/properties, `PascalCase` for types/components, `snake_case` for database tables.
- **API Endpoints:** RESTful, plural (e.g., `/api/agents`).

### Structure Patterns
- **Project Organization:** Feature-based (`/src/features/{domain}/...`).
- **Testing:** Co-located (`.test.ts`).

### Format Patterns
- **Response Wrapper:** `{ data: T | null, error: string | null }`.
- **Error Handling:** Centralized `AppError` class.

### Enforcement Guidelines
- TypeScript (Strict Mode) is mandatory.
- All agents must follow these naming and structural patterns to ensure compatibility.

## Project Structure & Boundaries

### Complete Project Directory Structure
```text
p2pesa/
├── README.md
├── package.json
├── src/
│   ├── app/                # Next.js App Router (pages/layouts)
│   ├── components/         
│   │   ├── ui/             # Reusable primitives (Soapbox-style)
│   │   └── shared/         # Common layouts, nav
│   ├── features/
│   │   ├── agents/         # Profile, Liquidity Proof, Agent logic
│   │   ├── reviews/        # Review submission + Zap-gate validation
│   │   └── search/         # Agent discovery + Filtering
│   ├── lib/                # Core logic (Nostr NDK, BTC utils, Mempool API client)
│   ├── types/              # Shared TypeScript definitions
│   └── hooks/              # Shared client-side hooks
├── tests/                  # Co-located tests or /tests folder
└── public/
```

### Architectural Boundaries
- **API Boundary:** External interactions (Mempool API, Relays) are encapsulated in `src/lib/`.
- **State Boundary:** Complex state managed via React Context/Hooks within `src/features/`.
- **Data Boundary:** "Authoritative Relay" address and "Pinned" relay configurations managed via env variables, accessed only by `src/lib/nostr.ts`.

### Requirements to Structure Mapping
- **Agent Profile:** `src/features/agents/`
- **Review Flow:** `src/features/reviews/`
- **Agent Search:** `src/features/search/`
