import type { Metadata } from 'next';
import './globals.css';
import { NostrAuthProvider } from '@/context/NostrAuthContext';
import { Navbar } from '@/components/shared/Navbar';

export const metadata: Metadata = {
  title: 'P2Pesa — Decentralized Reputation for Bitcoin Agents',
  description:
    'P2Pesa is a trustless reputation layer for Bitcoin and mobile money agents in Kenya. Verify identity via Nostr, prove liquidity via Bitcoin wallet signatures, and earn community trust through Zap-backed reviews.',
  keywords: [
    'Bitcoin',
    'Nostr',
    'P2P',
    'reputation',
    'Kenya',
    'mobile money',
    'agent',
    'trust score',
    'Lightning',
  ],
  openGraph: {
    title: 'P2Pesa — Bitcoin Agent Reputation',
    description: '"Bitcoin is trustless. But the people who onboard you to Bitcoin shouldn\'t have to be."',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-brand-dark antialiased">
        <NostrAuthProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </NostrAuthProvider>
      </body>
    </html>
  );
}
