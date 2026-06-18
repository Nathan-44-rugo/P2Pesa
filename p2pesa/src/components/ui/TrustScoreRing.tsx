'use client';

// src/components/ui/TrustScoreRing.tsx
// Daisy — Story 2.1 / 3.1
// Signature design element: animated SVG ring with score breakdown tooltip

import React, { useEffect, useRef, useState } from 'react';
import { TrustScore } from '@/types/nostr';

interface TrustScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  breakdown?: TrustScore['breakdown'];
  animated?: boolean;
}

const SIZE_MAP = {
  sm: { ring: 48, stroke: 4, font: 13, label: 10 },
  md: { ring: 72, stroke: 5, font: 18, label: 10 },
  lg: { ring: 110, stroke: 7, font: 28, label: 12 },
};

function scoreToColor(score: number): string {
  if (score >= 85) return '#22c55e';   // green-500
  if (score >= 65) return '#f59e0b';   // amber-500
  if (score >= 40) return '#f97316';   // orange-500
  return '#ef4444';                     // red-500
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 40) return 'Fair';
  return 'New';
}

export default function TrustScoreRing({
  score,
  size = 'md',
  breakdown,
  animated = true,
}: TrustScoreRingProps) {
  const { ring, stroke, font, label } = SIZE_MAP[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = ring / 2;
  const cy = ring / 2;

  const [displayed, setDisplayed] = useState(animated ? 0 : score);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animated) { setDisplayed(score); return; }
    const start = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(eased * score));
      if (t < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [score, animated]);

  const offset = circumference - (displayed / 100) * circumference;
  const color = scoreToColor(score);

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        type="button"
        onClick={() => breakdown && setShowBreakdown((v) => !v)}
        className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full"
        aria-label={`Trust score ${score} — ${scoreLabel(score)}`}
      >
        <svg width={ring} height={ring} viewBox={`0 0 ${ring} ${ring}`} className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-gray-800"
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: animated ? 'none' : undefined }}
          />
        </svg>
        {/* Center text */}
        <span
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize: font, fontWeight: 700, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
        >
          {displayed}
          <span style={{ fontSize: label, fontWeight: 500, color: '#9ca3af', letterSpacing: '0.05em' }}>
            /100
          </span>
        </span>
      </button>

      {/* Score label */}
      {size !== 'sm' && (
        <span
          className="mt-1 text-xs font-semibold tracking-widest uppercase"
          style={{ color }}
        >
          {scoreLabel(score)}
        </span>
      )}

      {/* Breakdown tooltip */}
      {showBreakdown && breakdown && (
        <div className="absolute top-full mt-2 z-50 w-48 bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl text-xs text-gray-300">
          <p className="text-gray-400 mb-2 font-semibold uppercase tracking-wider text-[10px]">Score breakdown</p>
          {[
            { label: 'Wallet verification', val: breakdown.walletScore, max: 15 },
            { label: 'Zap reviews', val: breakdown.reviewScore, max: 60 },
            { label: 'Zap volume', val: breakdown.attestationScore, max: 25 },
          ].map(({ label, val, max }) => (
            <div key={label} className="flex items-center justify-between gap-2 mb-1">
              <span className="text-gray-400 truncate">{label}</span>
              <span className="text-gray-200 font-mono">
                {val > 0 ? '+' : ''}{val}
                {max > 0 && <span className="text-gray-600">/{max}</span>}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span style={{ color }}>
              {Object.values(breakdown).reduce((s, v) => s + v, 0)}/100
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
