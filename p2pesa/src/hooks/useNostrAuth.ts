'use client';

/**
 * src/hooks/useNostrAuth.ts
 *
 * Convenience hook: wraps NostrAuthContext for easy consumption in components.
 * Usage: const { auth, login, logout } = useNostrAuth();
 */

export { useNostrAuthContext as useNostrAuth } from '@/context/NostrAuthContext';
