import type { Metadata } from 'next';
import './globals.css';
import { NostrAuthProvider } from '@/context/NostrAuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { RelayStatus } from '@/components/shared/RelayStatus';

export const metadata: Metadata = {
  title: 'P2Pesa — Decentralized Reputation for Bitcoin Agents',
  description:
    'P2Pesa is a trustless reputation layer for Bitcoin and mobile money agents in Kenya. Verify identity via Nostr, prove liquidity via Bitcoin wallet signatures, and earn community trust through Zap-backed reviews.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-brand-dark antialiased flex flex-col">
        <NostrAuthProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 py-12 w-full">
            {children}
          </main>
          <footer className="max-w-5xl mx-auto px-4 sm:px-8 py-6 w-full border-t border-brand-border/40 flex justify-between items-center">
            <span className="text-[10px] font-mono-tech text-brand-muted uppercase">P2Pesa — Bitcoin++ 2026</span>
            <RelayStatus />
          </footer>
        </NostrAuthProvider>
      </body>
    </html>
  );
}
