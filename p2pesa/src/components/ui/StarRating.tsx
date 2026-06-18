'use client';

// src/components/ui/StarRating.tsx
// Daisy — Story 2.1

import React from 'react';
import { ReviewRating } from '@/types/nostr';

interface StarRatingProps {
  value: ReviewRating | 0;
  onChange?: (v: ReviewRating) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

const SIZE_MAP = { sm: 14, md: 20, lg: 28 };

export default function StarRating({ value, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const px = SIZE_MAP[size];
  return (
    <div className="flex items-center gap-0.5" role="group" aria-label={`Rating: ${value} out of 5`}>
      {([1, 2, 3, 4, 5] as ReviewRating[]).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 rounded`}
          aria-label={readonly ? undefined : `Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <svg width={px} height={px} viewBox="0 0 20 20" fill={star <= value ? '#f59e0b' : 'none'} stroke={star <= value ? '#f59e0b' : '#4b5563'} strokeWidth={1.5}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
