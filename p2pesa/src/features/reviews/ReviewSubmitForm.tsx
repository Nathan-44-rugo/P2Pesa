'use client';

// src/features/reviews/ReviewSubmitForm.tsx
// Daisy — Story 2.1
// Zap-gated review submission. Zap verification logic wired to Rico's API (Story 2.1 hook)

import React, { useState } from 'react';
import { ReviewRating, ReviewSubmission } from '@/types/nostr';
import StarRating from '@/components/ui/StarRating';
import { useNostrAuth } from '@/hooks/useNostrAuth';
import { npubToPubkey } from '@/lib/nostr';
import { parseZapReceipt, createUnsignedReviewEvent } from '@/lib/reputation';
import { signAndPublishReviewEvent } from '@/lib/reputationRelay';

interface ReviewSubmitFormProps {
  agentNpub: string;
  agentName: string;
  onSubmitSuccess?: () => void;
}

type Step = 'compose' | 'zap' | 'submitting' | 'done' | 'error';

const ZAP_PRESETS = [500, 1000, 2100, 5000];

export default function ReviewSubmitForm({ agentNpub, agentName, onSubmitSuccess }: ReviewSubmitFormProps) {
  const { auth, demoMode } = useNostrAuth();
  const [step, setStep] = useState<Step>('compose');
  const [rating, setRating] = useState<ReviewRating | 0>(0);
  const [content, setContent] = useState('');
  const [zapAmount, setZapAmount] = useState(1000);
  const [customZap, setCustomZap] = useState('');
  const [zapReceiptJson, setZapReceiptJson] = useState('');
  const [error, setError] = useState('');

  const MIN_CONTENT = 20;
  const MIN_ZAP = 100;

  const canProceed = rating > 0 && content.trim().length >= MIN_CONTENT && zapReceiptJson.trim().length > 0;
  const finalZapAmount = customZap ? parseInt(customZap, 10) : zapAmount;

  function handleGenerateDemoZap() {
    const { data: agentPubkey } = npubToPubkey(agentNpub);
    if (!agentPubkey) return;

    const mockEvent = {
      id: `demo_zap_${Math.random().toString(36).substring(2, 11)}`,
      pubkey: auth.pubkey || 'demo_zap_sender_pubkey',
      created_at: Math.floor(Date.now() / 1000),
      kind: 9735,
      tags: [
        ['p', agentPubkey],
        ['amount', String(finalZapAmount * 1000)],
        ['P', auth.pubkey || '']
      ],
      content: ''
    };

    setZapReceiptJson(JSON.stringify(mockEvent, null, 2));
  }

  async function handleZapAndSubmit() {
    if (!auth.pubkey) {
      setError('Log in with Nostr before submitting a verified review.');
      setStep('error');
      return;
    }

    const { data: agentPubkey, error: decodeError } = npubToPubkey(agentNpub);
    if (decodeError || !agentPubkey) {
      setError(decodeError ?? 'Invalid agent npub.');
      setStep('error');
      return;
    }

    setStep('submitting');
    setError('');

    try {
      const zapReceiptResult = parseZapReceipt(zapReceiptJson, agentPubkey);
      if (zapReceiptResult.error || !zapReceiptResult.data) {
        setError(zapReceiptResult.error ?? 'Invalid zap receipt.');
        setStep('error');
        return;
      }

      const unsignedEventResult = createUnsignedReviewEvent({
        agentPubkey,
        reviewerPubkey: auth.pubkey,
        rating: rating as ReviewRating,
        comment: content.trim(),
        zapReceipt: zapReceiptResult.data,
      });

      if (unsignedEventResult.error || !unsignedEventResult.data) {
        setError(unsignedEventResult.error ?? 'Could not create review event.');
        setStep('error');
        return;
      }

      const publishResult = await signAndPublishReviewEvent(unsignedEventResult.data);
      if (publishResult.error || !publishResult.data) {
        setError(publishResult.error ?? 'Could not publish review event.');
        setStep('error');
        return;
      }

      setStep('done');
      onSubmitSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStep('error');
    }
  }

  if (step === 'done') {
    return (
      <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-6 text-center space-y-2">
        <div className="text-3xl">⚡</div>
        <h3 className="text-green-400 font-semibold text-lg">Review submitted</h3>
        <p className="text-gray-400 text-sm">
          Your {finalZapAmount.toLocaleString()} sat zap confirmed this review. It will appear on the Nostr relay shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
        <span className="text-orange-400">★</span>
        <h3 className="font-semibold text-gray-100 text-sm">Write a review for {agentName}</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Step 1: Compose */}
        {(step === 'compose' || step === 'zap' || step === 'submitting' || step === 'error') && (
          <>
            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your rating</label>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            {/* Review text */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Your experience
              </label>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-orange-500 transition-colors"
                rows={4}
                placeholder="Describe the trade. Was it smooth? How was communication? Would you trade again?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={1000}
                disabled={step === 'submitting'}
              />
              <div className="flex justify-between text-[11px] text-gray-600">
                <span>{content.length < MIN_CONTENT && content.length > 0 && `${MIN_CONTENT - content.length} more characters needed`}</span>
                <span>{content.length}/1000</span>
              </div>
            </div>

            {/* Zap amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Zap to verify</label>
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 cursor-help"
                  title="Zapping makes your review Sybil-resistant. A small Lightning payment ensures reviews can't be faked in bulk."
                >
                  ⚡ Why?
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {ZAP_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => { setZapAmount(preset); setCustomZap(''); }}
                    disabled={step === 'submitting'}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      zapAmount === preset && !customZap
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                        : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    ⚡ {preset.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Custom sats"
                  value={customZap}
                  onChange={(e) => { setCustomZap(e.target.value); }}
                  min={MIN_ZAP}
                  disabled={step === 'submitting'}
                />
                <span className="text-xs text-gray-600">Min. {MIN_ZAP} sats</span>
              </div>
            </div>

            {/* NIP-57 Zap Receipt JSON */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="zap-receipt" className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                  NIP-57 Zap Receipt JSON
                </label>
                {demoMode && (
                  <button
                    type="button"
                    onClick={handleGenerateDemoZap}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                  >
                    <span>⚡ Generate Demo Zap</span>
                  </button>
                )}
              </div>
              <textarea
                id="zap-receipt"
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 font-mono text-xs text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-orange-500 transition-colors"
                placeholder='{"kind":9735,"tags":[["p","agent-pubkey"],["amount","1000"]],...}'
                value={zapReceiptJson}
                onChange={(e) => setZapReceiptJson(e.target.value)}
                disabled={step === 'submitting'}
              />
            </div>

            {/* Error */}
            {(step === 'error' || error) && error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="button"
              disabled={!canProceed || step === 'submitting' || (finalZapAmount < MIN_ZAP)}
              onClick={handleZapAndSubmit}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-white disabled:text-gray-500 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {step === 'submitting' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending zap &amp; publishing…
                </>
              ) : (
                <>
                  ⚡ Zap {finalZapAmount.toLocaleString()} sats &amp; publish review
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-600 text-center">
              Review is published as a signed Nostr event. Your zap makes it Sybil-resistant.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
