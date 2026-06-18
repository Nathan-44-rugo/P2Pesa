/**
 * src/lib/bitcoin.ts
 *
 * ============================================================
 * STORY 1.2 — FOR FRANCIS (Bitcoin & Verification Lead)
 * ============================================================
 *
 * This file provides the function signatures and architecture
 * boundaries for Bitcoin wallet verification.
 *
 * Nathan has set up:
 *   - The AuthState types (src/types/nostr.ts)
 *   - The WalletVerification type (src/types/nostr.ts)
 *   - The WalletVerificationStub component (src/features/agents/WalletVerificationStub.tsx)
 *   - This file with all function signatures ready for implementation
 *
 * Francis: implement the TODOs below to complete Story 1.2.
 * See architecture.md "Deferred Verification Pattern" for context.
 *
 * Dependencies to install:
 *   npm install bitcoinjs-message bitcoinjs-lib
 *   (or use the browser-compatible `@noble/secp256k1` + message signing)
 *
 * Key References:
 *   - Mempool.space API: https://mempool.space/api
 *   - Bitcoin message signing: https://github.com/bitcoinjs/bitcoinjs-message
 */

import type { ApiResponse, WalletVerification } from '@/types/nostr';

const MEMPOOL_API =
  process.env.NEXT_PUBLIC_MEMPOOL_API ?? 'https://mempool.space/api';

// ============================================================
// STEP 1: Generate a challenge message for the agent to sign
// ============================================================

/**
 * Generates a unique challenge message for wallet ownership verification.
 * The agent must sign this message with their Bitcoin private key.
 *
 * @param npub - The agent's Nostr public key (npub format) to bind the challenge
 * @returns A challenge string like: "P2Pesa:verify:npub1abc...:1718000000000"
 */
export function generateChallenge(npub: string): string {
  const timestamp = Date.now();
  return `P2Pesa:verify:${npub}:${timestamp}`;
}

// ============================================================
// STEP 2: Verify a Bitcoin message signature (client-side)
// ============================================================

/**
 * TODO (Francis - Story 1.2):
 * Verifies that a Bitcoin wallet signature is valid for the given challenge.
 *
 * Implementation guide:
 * 1. Use `bitcoinjs-message` or `@noble/secp256k1` to verify the signature
 * 2. Confirm the signature was produced by `address`
 * 3. Return { data: true, error: null } on success
 *
 * @param address - The Bitcoin wallet address (e.g. bc1q... or 1Abc... or 3Xyz...)
 * @param signature - Base64-encoded signature from the wallet
 * @param challenge - The original challenge message that was signed
 */
export async function verifyBitcoinSignature(
  address: string,
  signature: string,
  challenge: string
): Promise<ApiResponse<boolean>> {
  // TODO: Implement signature verification
  // Example with bitcoinjs-message:
  //   import bitcoinMessage from 'bitcoinjs-message';
  //   const valid = bitcoinMessage.verify(challenge, address, signature);
  //   return { data: valid, error: null };
  console.warn('verifyBitcoinSignature: NOT YET IMPLEMENTED', {
    address,
    challenge,
    signatureLength: signature.length,
  });
  return { data: null, error: 'Not implemented — see Story 1.2' };
}

// ============================================================
// STEP 3: Fetch wallet balance from Mempool.space
// ============================================================

/**
 * TODO (Francis - Story 1.2):
 * Fetches the confirmed balance of a Bitcoin address via Mempool.space API.
 *
 * Implementation guide:
 * 1. GET `${MEMPOOL_API}/address/${address}`
 * 2. Parse response.chain_stats.funded_txo_sum - response.chain_stats.spent_txo_sum
 * 3. Return balance in satoshis
 *
 * API docs: https://mempool.space/api/address/:address
 *
 * @param address - The verified Bitcoin wallet address
 * @returns Balance in satoshis
 */
export async function fetchWalletBalance(
  address: string
): Promise<ApiResponse<number>> {
  // TODO: Implement Mempool.space API call
  // Example:
  //   const res = await fetch(`${MEMPOOL_API}/address/${address}`);
  //   const data = await res.json();
  //   const balanceSats = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
  //   return { data: balanceSats, error: null };
  console.warn('fetchWalletBalance: NOT YET IMPLEMENTED', { address });
  return { data: null, error: 'Not implemented — see Story 1.2' };
}

// ============================================================
// STEP 4: Full verification flow (orchestrates steps 2 + 3)
// ============================================================

/**
 * TODO (Francis - Story 1.2):
 * Orchestrates the full deferred wallet verification flow:
 * 1. Verify the signature (step 2)
 * 2. If valid, fetch the balance (step 3)
 * 3. Return a complete WalletVerification object
 *
 * Called by the WalletVerificationStub component when the user
 * completes the signing step.
 */
export async function completeWalletVerification(
  address: string,
  signature: string,
  challenge: string
): Promise<ApiResponse<WalletVerification>> {
  // TODO: Wire together verifyBitcoinSignature + fetchWalletBalance
  // Then return:
  //   { data: { status: 'verified', address, balanceSats, signature, verifiedAt: Date.now() }, error: null }
  console.warn('completeWalletVerification: NOT YET IMPLEMENTED');
  return {
    data: {
      status: 'unverified',
    },
    error: 'Not implemented — see Story 1.2 for Francis',
  };
}

/**
 * Formats a satoshi balance as a human-readable BTC string.
 * Used in the UI to display "Verified Balance: 0.021 BTC"
 */
export function formatBtcBalance(balanceSats: number): string {
  const btc = balanceSats / 100_000_000;
  return `${btc.toFixed(8)} BTC`;
}
