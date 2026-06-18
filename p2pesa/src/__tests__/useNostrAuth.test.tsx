/**
 * src/__tests__/useNostrAuth.test.tsx
 *
 * Unit tests for NostrAuthContext — auth state transitions.
 * Tests the hook's behavior across idle/loading/authenticated/error states.
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NostrAuthProvider, useNostrAuthContext } from '@/context/NostrAuthContext';

// Mock the nostr lib
jest.mock('@/lib/nostr', () => ({
  loginWithNip07: jest.fn(),
  signOut: jest.fn(),
  pubkeyToNpub: (key: string) => `npub1${key.slice(0, 8)}`,
}));

// Mock nostrProfile lib
jest.mock('@/lib/nostrProfile', () => ({
  fetchNostrProfile: jest.fn(),
}));

import { loginWithNip07 } from '@/lib/nostr';
import { fetchNostrProfile } from '@/lib/nostrProfile';

const mockLoginWithNip07 = loginWithNip07 as jest.Mock;
const mockFetchProfile = fetchNostrProfile as jest.Mock;

// --- Test component that exercises the hook ---
function TestComponent({ onStateChange }: { onStateChange?: (status: string) => void }) {
  const { auth, login, logout } = useNostrAuthContext();

  onStateChange?.(auth.status);

  return (
    <div>
      <span data-testid="status">{auth.status}</span>
      <span data-testid="pubkey">{auth.pubkey ?? 'none'}</span>
      <span data-testid="error">{auth.error ?? 'none'}</span>
      <button onClick={login} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

function renderWithProvider(ui: React.ReactNode) {
  return render(<NostrAuthProvider>{ui}</NostrAuthProvider>);
}

describe('NostrAuthContext', () => {
  const MOCK_PUBKEY = 'abcdef1234567890abcdef1234567890';
  const MOCK_NPUB = 'npub1abcdef12';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts in idle state', () => {
    renderWithProvider(<TestComponent />);
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('pubkey')).toHaveTextContent('none');
    expect(screen.getByTestId('error')).toHaveTextContent('none');
  });

  it('transitions idle → loading → authenticated on successful login', async () => {
    const user = userEvent.setup();

    mockLoginWithNip07.mockResolvedValueOnce({
      pubkey: MOCK_PUBKEY,
      npub: MOCK_NPUB,
      ndkUser: {},
    });

    mockFetchProfile.mockResolvedValueOnce({
      data: {
        pubkey: MOCK_PUBKEY,
        npub: MOCK_NPUB,
        name: 'Alice',
      },
      error: null,
    });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated');
    });

    expect(screen.getByTestId('pubkey')).toHaveTextContent(MOCK_PUBKEY);
  });

  it('transitions to error state on NIP-07 failure', async () => {
    const user = userEvent.setup();

    mockLoginWithNip07.mockRejectedValueOnce(
      new Error('No NIP-07 extension found')
    );

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error');
    });

    expect(screen.getByTestId('error')).toHaveTextContent(
      'No NIP-07 extension found'
    );
  });

  it('resets to idle on logout', async () => {
    const user = userEvent.setup();

    mockLoginWithNip07.mockResolvedValueOnce({
      pubkey: MOCK_PUBKEY,
      npub: MOCK_NPUB,
      ndkUser: {},
    });

    mockFetchProfile.mockResolvedValueOnce({
      data: { pubkey: MOCK_PUBKEY, npub: MOCK_NPUB },
      error: null,
    });

    renderWithProvider(<TestComponent />);

    await user.click(screen.getByTestId('login-btn'));
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    );

    await user.click(screen.getByTestId('logout-btn'));
    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(screen.getByTestId('pubkey')).toHaveTextContent('none');
  });

  it('throws when used outside NostrAuthProvider', () => {
    // Suppress React error boundary console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useNostrAuthContext must be used within NostrAuthProvider');

    consoleSpy.mockRestore();
  });
});
