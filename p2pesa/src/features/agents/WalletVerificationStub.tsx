'use client';

/**
 * src/features/agents/WalletVerificationStub.tsx
 *
 * ============================================================
 * STORY 1.2 — FOR FRANCIS (Bitcoin & Verification Lead)
 * ============================================================
 *
 * This component implements the "Deferred Verification" UX pattern:
 * - Nathan built: Nostr login → "Authenticated" state
 * - Francis builds: BTC wallet signing → "Active/Verified" state
 *
 * HOW TO IMPLEMENT (Francis):
 *
 * 1. When user clicks "Verify Wallet Ownership":
 *    a. Generate a challenge: `generateChallenge(npub)` from src/lib/bitcoin.ts
 *    b. Show the user the challenge message to sign in their Bitcoin wallet
 *    c. Accept the wallet address + signature as input
 *    d. Call `completeWalletVerification(address, signature, challenge)` from src/lib/bitcoin.ts
 *    e. On success, update the parent's WalletVerification state
 *
 * 2. You can use any of these for the signing UI:
 *    - A simple text input for the signature (simplest for hackathon)
 *    - Browser-based Bitcoin wallet (Sparrow/Nunchuk web if available)
 *    - WIF key import for demo purposes
 *
 * 3. After verification, call `fetchWalletBalance(address)` and display the balance.
 *
 * See: src/lib/bitcoin.ts for all function signatures.
 */

import React, { useState } from 'react';
import type { WalletVerification } from '@/types/nostr';
import { generateChallenge } from '@/lib/bitcoin';

interface WalletVerificationStubProps {
  npub: string;
  onVerified?: (verification: WalletVerification) => void;
  className?: string;
}

export function WalletVerificationStub({
  npub,
  onVerified,
  className = '',
}: WalletVerificationStubProps) {
  const [step, setStep] = useState<'idle' | 'challenge' | 'signing' | 'done'>(
    'idle'
  );
  const [challenge] = useState(() => generateChallenge(npub));
  const [address, setAddress] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStartVerification = () => {
    setStep('challenge');
    setError(null);
  };

  const handleSubmitSignature = async () => {
    if (!address.trim() || !signature.trim()) {
      setError('Please provide both your wallet address and signature.');
      return;
    }

    setStep('signing');
    setError(null);

    try {
      // TODO (Francis): Replace this stub call with actual verification
      // import { completeWalletVerification } from '@/lib/bitcoin';
      // const result = await completeWalletVerification(address, signature, challenge);
      // if (result.error) { setError(result.error); setStep('challenge'); return; }
      // onVerified?.(result.data!);

      // STUB: Simulate success for demo
      await new Promise((r) => setTimeout(r, 1500));
      const stubVerification: WalletVerification = {
        status: 'verified',
        address,
        balanceSats: 210_000, // stub 0.0021 BTC
        signature,
        verifiedAt: Date.now(),
      };
      onVerified?.(stubVerification);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setStep('challenge');
    }
  };

  if (step === 'done') {
    return (
      <div className={`rounded-2xl bg-brand-teal/10 border border-brand-teal/30 p-4 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-brand-teal font-bold">Wallet Verified!</p>
            <p className="text-brand-muted text-sm">
              Your Bitcoin wallet ownership has been confirmed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-brand-border bg-brand-surface/50 p-5 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">₿</span>
        <h3 className="text-white font-semibold">Verify Wallet Ownership</h3>
        <span className="ml-auto text-xs text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full border border-brand-orange/20">
          Story 1.2 — Francis
        </span>
      </div>

      <p className="text-brand-muted text-sm mb-4">
        Prove you own a Bitcoin wallet to unlock &quot;Active/Verified&quot; status and
        display your liquidity to traders.
      </p>

      {step === 'idle' && (
        <button
          id="verify-wallet-btn"
          onClick={handleStartVerification}
          className="w-full py-3 px-4 rounded-xl bg-brand-orange/20 border border-brand-orange/30 text-brand-orange font-semibold hover:bg-brand-orange/30 transition-all"
        >
          ⚡ Verify Wallet Ownership
        </button>
      )}

      {(step === 'challenge' || step === 'signing') && (
        <div className="space-y-4">
          {/* Challenge message */}
          <div>
            <label className="text-brand-muted text-xs mb-1 block">
              Sign this message with your Bitcoin wallet:
            </label>
            <div className="bg-brand-dark rounded-xl p-3 font-mono text-xs text-brand-light break-all">
              {challenge}
            </div>
          </div>

          {/* Address input */}
          <div>
            <label
              htmlFor="wallet-address"
              className="text-brand-muted text-xs mb-1 block"
            >
              Your Bitcoin address
            </label>
            <input
              id="wallet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="bc1q... or 1Abc... or 3Xyz..."
              className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-white text-sm font-mono placeholder-brand-muted focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          {/* Signature input */}
          <div>
            <label
              htmlFor="wallet-signature"
              className="text-brand-muted text-xs mb-1 block"
            >
              Signature (base64)
            </label>
            <textarea
              id="wallet-signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Paste your base64-encoded signature here..."
              rows={3}
              className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-white text-sm font-mono placeholder-brand-muted focus:outline-none focus:border-brand-orange transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmitSignature}
            disabled={step === 'signing'}
            className="w-full py-3 px-4 rounded-xl bg-brand-orange text-white font-semibold hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {step === 'signing' ? '⏳ Verifying...' : '✓ Submit & Verify'}
          </button>
        </div>
      )}
    </div>
  );
}
