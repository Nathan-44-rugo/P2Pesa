'use client';

import React, { useState } from 'react';
import type { WalletVerification } from '@/types/nostr';
import { generateChallenge, completeWalletVerification } from '@/lib/bitcoin';
import { FiCheckCircle, FiLoader, FiLock, FiInfo, FiCopy, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { SiBitcoin } from 'react-icons/si';

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
  
  const [showGuide, setShowGuide] = useState(false);
  const [copiedChallenge, setCopiedChallenge] = useState(false);

  const handleStartVerification = () => {
    setStep('challenge');
    setError(null);
  };

  const handleCopyChallenge = () => {
    navigator.clipboard.writeText(challenge);
    setCopiedChallenge(true);
    setTimeout(() => setCopiedChallenge(false), 2000);
  };

  const handleSubmitSignature = async () => {
    if (!address.trim() || !signature.trim()) {
      setError('Please provide both your wallet address and signature.');
      return;
    }

    setStep('signing');
    setError(null);

    try {
      const result = await completeWalletVerification(
        address.trim(),
        signature.trim(),
        challenge
      );

      if (result.error || !result.data || result.data.status !== 'verified') {
        setError(result.error ?? 'Verification failed.');
        setStep('challenge');
        return;
      }

      onVerified?.(result.data);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setStep('challenge');
    }
  };

  if (step === 'done') {
    return (
      <div className={`rounded bg-brand-teal/5 border border-brand-teal/20 p-4.5 ${className}`}>
        <div className="flex items-start gap-3">
          <FiCheckCircle className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
          <div>
            <p className="text-brand-teal font-bold text-sm tracking-tight">Wallet Ownership Confirmed</p>
            <p className="text-brand-muted text-xs leading-relaxed mt-0.5">
              Your cryptographic proof has been successfully verified against your active identity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded border border-brand-border bg-brand-surface/40 p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <SiBitcoin className="w-4 h-4 text-brand-orange" />
        <h3 className="text-white font-semibold text-sm tracking-tight uppercase font-mono-tech">Verify Wallet Ownership</h3>
        <span className="ml-auto text-[9px] font-mono-tech text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-2 py-0.5 rounded">
          STORY 1.2 — FRANCIS
        </span>
      </div>

      <p className="text-brand-muted text-xs leading-relaxed mb-5">
        Prove ownership of a Bitcoin wallet to transition to &quot;Active/Verified&quot; status, showing cryptographic liquidity to traders on the platform.
      </p>

      {step === 'idle' && (
        <button
          id="verify-wallet-btn"
          onClick={handleStartVerification}
          className="w-full py-3 px-4 rounded border border-brand-orange/30 bg-brand-orange/5 text-brand-orange font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-brand-orange/15 transition-colors"
        >
          Verify Wallet Ownership
        </button>
      )}

      {(step === 'challenge' || step === 'signing') && (
        <div className="space-y-4 font-mono-tech text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-brand-muted text-[10px] uppercase font-bold tracking-wider block">
                Message to Sign
              </label>
              <button
                onClick={handleCopyChallenge}
                className="text-brand-orange hover:text-white transition-colors flex items-center gap-1 text-[10px]"
              >
                {copiedChallenge ? (
                  <>
                    <FiCheck className="w-3 h-3 text-brand-teal" />
                    <span className="text-brand-teal">Copied</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-brand-dark/50 border border-brand-border rounded p-3 text-brand-light break-all select-all leading-relaxed">
              {challenge}
            </div>
          </div>

          <div className="border border-brand-border bg-brand-dark/20 rounded overflow-hidden">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-brand-surface/45 transition-colors"
            >
              <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-zinc-400">
                <FiInfo className="w-3.5 h-3.5 text-brand-orange" />
                <span>How to sign this challenge?</span>
              </span>
              {showGuide ? <FiChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <FiChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
            </button>
            
            {showGuide && (
              <div className="px-3 pb-3 border-t border-brand-border/40 text-[11px] leading-relaxed text-brand-muted space-y-2 mt-2">
                <p>1. Copy the <span className="text-white font-semibold">Message to Sign</span> above.</p>
                <p>2. Open any standard Bitcoin Wallet (e.g., Sparrow, BlueWallet, Electrum, or Alby).</p>
                <p>3. Go to <span className="text-white font-semibold">Tools / Sign Message</span>. Paste this challenge text, select your address, and click <span className="text-white font-semibold">Sign</span>.</p>
                <p>4. Copy the resulting base64 signature string and paste it along with your address below.</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="wallet-address" className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-1 block">
              Bitcoin Address
            </label>
            <input
              id="wallet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="bc1q... or 1Abc... or 3Xyz..."
              className="w-full bg-brand-dark border border-brand-border rounded px-3 py-2 text-white text-xs placeholder-brand-border focus:outline-none focus:border-brand-orange/50 transition-colors font-mono-tech"
            />
          </div>

          <div>
            <label htmlFor="wallet-signature" className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-1 block">
              Signature (base64)
            </label>
            <textarea
              id="wallet-signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Paste base64 signature string..."
              rows={2}
              className="w-full bg-brand-dark border border-brand-border rounded px-3 py-2 text-white text-xs placeholder-brand-border focus:outline-none focus:border-brand-orange/50 transition-colors resize-none leading-relaxed font-mono-tech"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-950/25 border border-red-900/30 rounded p-3">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmitSignature}
            disabled={step === 'signing'}
            className="w-full py-3 px-4 rounded bg-brand-orange text-white font-mono-tech font-bold text-xs uppercase tracking-wider hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {step === 'signing' ? (
              <>
                <FiLoader className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <FiLock className="w-3.5 h-3.5" />
                <span>Submit & Verify</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
