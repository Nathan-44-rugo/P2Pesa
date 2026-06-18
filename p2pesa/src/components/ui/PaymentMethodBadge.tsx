// src/components/ui/PaymentMethodBadge.tsx
// Daisy — Story 3.1

import React from 'react';
import { PaymentMethod } from '@/types/nostr';

const METHOD_CONFIG: Record<PaymentMethod, { label: string; color: string }> = {
  mpesa: { label: 'M-Pesa', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  airtel_money: { label: 'Airtel Money', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  bank_transfer: { label: 'Bank', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  cash: { label: 'Cash', color: 'bg-gray-700 text-gray-400 border-gray-600' },
};

export default function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const { label, color } = METHOD_CONFIG[method] ?? { label: method, color: 'bg-gray-700 text-gray-400 border-gray-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${color}`}>
      {label}
    </span>
  );
}
