'use client';

import React, { useEffect, useState } from 'react';
import { getNdk } from '@/lib/nostr';
import { FiActivity } from 'react-icons/fi';

export function RelayStatus() {
  const [activeRelays, setActiveRelays] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ndk = getNdk();
      if (ndk?.pool) {
        const connected = Array.from(ndk.pool.relays.values())
          .filter((relay) => relay.status === 2 || relay.status === 1)
          .map((relay) => relay.url.replace('wss://', ''));
        setActiveRelays(connected);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-[10px] font-mono-tech text-brand-muted tracking-wide">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-teal"></span>
      </span>
      <div className="flex items-center gap-1">
        <FiActivity className="w-3 h-3 text-brand-teal" />
        <span>
          {activeRelays.length > 0 
            ? `CONNECTED: ${activeRelays[0]}` 
            : 'RESOLVING RELAYS...'}
        </span>
        {activeRelays.length > 1 && (
          <span className="opacity-60">(+{activeRelays.length - 1} more)</span>
        )}
      </div>
    </div>
  );
}
