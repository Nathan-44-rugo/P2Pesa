'use client';

import React, { useMemo, useState } from 'react';
import type { AgentReview, ReviewRating } from '@/types/nostr';
import {
  createUnsignedReviewEvent,
  parseReviewEvent,
  parseZapReceipt,
} from '@/lib/reputation';
import { signAndPublishReviewEvent } from '@/lib/reputationRelay';

interface ReviewSubmissionFormProps {
  agentPubkey: string;
  reviewerPubkey: string | null;
  onReviewSubmitted?: (review: AgentReview) => void;
}

export function ReviewSubmissionForm({
  agentPubkey,
  reviewerPubkey,
  onReviewSubmitted,
}: ReviewSubmissionFormProps) {
  const [rating, setRating] = useState<ReviewRating>(5);
  const [comment, setComment] = useState('');
  const [zapReceiptJson, setZapReceiptJson] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => Boolean(reviewerPubkey && comment.trim() && zapReceiptJson.trim()),
    [comment, reviewerPubkey, zapReceiptJson]
  );

  const submitReview = async () => {
    if (!reviewerPubkey) {
      setError('Log in with Nostr before submitting a verified review.');
      return;
    }

    setStatus('submitting');
    setError(null);

    const zapReceipt = parseZapReceipt(zapReceiptJson, agentPubkey);
    if (zapReceipt.error || !zapReceipt.data) {
      setError(zapReceipt.error ?? 'Invalid zap receipt.');
      setStatus('idle');
      return;
    }

    const unsignedEvent = createUnsignedReviewEvent({
      agentPubkey,
      reviewerPubkey,
      rating,
      comment,
      zapReceipt: zapReceipt.data,
    });
    if (unsignedEvent.error || !unsignedEvent.data) {
      setError(unsignedEvent.error ?? 'Could not create review event.');
      setStatus('idle');
      return;
    }

    const published = await signAndPublishReviewEvent(unsignedEvent.data);
    if (published.error || !published.data) {
      setError(published.error ?? 'Could not publish review event.');
      setStatus('idle');
      return;
    }

    const parsedReview = parseReviewEvent(published.data);
    if (parsedReview.data) {
      onReviewSubmitted?.(parsedReview.data);
    }

    setStatus('success');
    setComment('');
    setZapReceiptJson('');
  };

  return (
    <section className="rounded-2xl border border-brand-border bg-brand-surface/40 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-semibold">Verified Review</h2>
          <p className="text-brand-muted text-sm">
            Reviews count only when backed by a NIP-57 zap receipt.
          </p>
        </div>
        <span className="rounded-full border border-brand-teal/20 bg-brand-teal/10 px-2.5 py-1 text-xs font-semibold text-brand-teal">
          Zap-gated
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="review-rating" className="mb-1 block text-xs text-brand-muted">
            Rating
          </label>
          <select
            id="review-rating"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value) as ReviewRating)}
            className="w-full rounded-xl border border-brand-border bg-brand-dark px-3 py-2 text-sm text-white focus:border-brand-orange focus:outline-none"
          >
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Good</option>
            <option value={3}>3 - Fair</option>
            <option value={2}>2 - Poor</option>
            <option value={1}>1 - Risky</option>
          </select>
        </div>

        <div>
          <label htmlFor="review-comment" className="mb-1 block text-xs text-brand-muted">
            Comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Describe the completed trade..."
            className="w-full resize-none rounded-xl border border-brand-border bg-brand-dark px-3 py-2 text-sm text-white placeholder-brand-muted focus:border-brand-orange focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="zap-receipt" className="mb-1 block text-xs text-brand-muted">
            NIP-57 zap receipt JSON
          </label>
          <textarea
            id="zap-receipt"
            value={zapReceiptJson}
            onChange={(event) => setZapReceiptJson(event.target.value)}
            rows={4}
            placeholder='{"kind":9735,"tags":[["p","agent-pubkey"],["amount","1000"]],...}'
            className="w-full resize-none rounded-xl border border-brand-border bg-brand-dark px-3 py-2 font-mono text-xs text-white placeholder-brand-muted focus:border-brand-orange focus:outline-none"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {status === 'success' && (
          <p className="rounded-lg bg-brand-teal/10 px-3 py-2 text-sm font-semibold text-brand-teal">
            Review Submitted & Verified.
          </p>
        )}

        <button
          type="button"
          onClick={submitReview}
          disabled={!canSubmit || status === 'submitting'}
          className="w-full rounded-xl bg-brand-orange px-4 py-3 font-semibold text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit Verified Review'}
        </button>
      </div>
    </section>
  );
}
