'use client';

// src/features/reviews/ReviewCard.tsx
// Daisy — Story 2.1

import React from 'react';
import { Review } from '@/types/nostr';
import StarRating from '@/components/ui/StarRating';
import ZapBadge from '@/components/ui/ZapBadge';

interface ReviewCardProps {
  review: Review;
}

function timeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { reviewerProfile, rating, content, zapAmountSats, zapVerified, createdAt } = review;
  const name = reviewerProfile?.display_name || reviewerProfile?.name || 'Anonymous';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
            {reviewerProfile?.picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={reviewerProfile.picture} alt={name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-200 truncate">{name}</p>
            <p className="text-[11px] text-gray-500 font-mono truncate">
              {review.reviewerNpub.slice(0, 16)}…
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <StarRating value={rating} readonly size="sm" />
          <span className="text-[11px] text-gray-600">{timeAgo(createdAt)}</span>
        </div>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed">{content}</p>

      <div className="flex items-center gap-2 pt-0.5">
        {zapAmountSats != null && (
          <ZapBadge sats={zapAmountSats} verified={zapVerified} />
        )}
        {review.nostrEventId && (
          <span className="text-[11px] text-gray-600 font-mono">
            #{review.nostrEventId.slice(-6)}
          </span>
        )}
      </div>
    </div>
  );
}
