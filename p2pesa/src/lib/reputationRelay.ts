import type { ApiResponse, NostrEvent } from '@/types/nostr';
import { RELAY_URLS } from '@/lib/nostr';
import { P2PESA_REVIEW_KIND } from '@/lib/reputation';

export async function signAndPublishReviewEvent(
  unsignedEvent: NostrEvent
): Promise<ApiResponse<NostrEvent>> {
  if (typeof window === 'undefined' || !window.nostr) {
    return {
      data: null,
      error: 'No NIP-07 extension found. Please install Alby or a compatible signer.',
    };
  }

  try {
    const signedFields = await window.nostr.signEvent(unsignedEvent);
    const signedEvent = { ...unsignedEvent, ...signedFields } as NostrEvent;
    const publishResult = await publishEventToRelays(signedEvent);

    if (publishResult.error) {
      return { data: null, error: publishResult.error };
    }

    return { data: signedEvent, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Could not sign review event.',
    };
  }
}

export async function fetchAgentReviewEvents(
  agentPubkey: string
): Promise<ApiResponse<NostrEvent[]>> {
  const events = await Promise.all(
    RELAY_URLS.map((relayUrl) => fetchReviewsFromRelay(relayUrl, agentPubkey))
  );
  const successful = events.flatMap((result) => result.data ?? []);
  const deduped = new Map<string, NostrEvent>();

  for (const event of successful) {
    if (event.id) {
      deduped.set(event.id, event);
    }
  }

  if (deduped.size > 0) {
    return { data: Array.from(deduped.values()), error: null };
  }

  const firstError = events.find((result) => result.error)?.error;
  return { data: [], error: firstError ?? null };
}

async function publishEventToRelays(event: NostrEvent): Promise<ApiResponse<boolean>> {
  const results = await Promise.all(
    RELAY_URLS.map((relayUrl) => publishEventToRelay(relayUrl, event))
  );

  if (results.some((result) => result.data)) {
    return { data: true, error: null };
  }

  return {
    data: null,
    error: results.find((result) => result.error)?.error ?? 'No relay accepted the review.',
  };
}

function publishEventToRelay(relayUrl: string, event: NostrEvent): Promise<ApiResponse<boolean>> {
  return new Promise((resolve) => {
    const socket = new WebSocket(relayUrl);
    const timeout = window.setTimeout(() => {
      socket.close();
      resolve({ data: null, error: `Relay timed out: ${relayUrl}` });
    }, 3000);

    socket.onopen = () => {
      socket.send(JSON.stringify(['EVENT', event]));
    };

    socket.onmessage = (message) => {
      const payload = safeJson(message.data);
      if (Array.isArray(payload) && payload[0] === 'OK' && payload[1] === event.id) {
        window.clearTimeout(timeout);
        socket.close();
        resolve({
          data: payload[2] === true,
          error: payload[2] === true ? null : String(payload[3] ?? 'Relay rejected event.'),
        });
      }
    };

    socket.onerror = () => {
      window.clearTimeout(timeout);
      socket.close();
      resolve({ data: null, error: `Could not publish to relay: ${relayUrl}` });
    };
  });
}

function fetchReviewsFromRelay(
  relayUrl: string,
  agentPubkey: string
): Promise<ApiResponse<NostrEvent[]>> {
  return new Promise((resolve) => {
    const socket = new WebSocket(relayUrl);
    const subscriptionId = `p2pesa-reviews-${Date.now()}`;
    const events: NostrEvent[] = [];
    const timeout = window.setTimeout(() => {
      socket.close();
      resolve({ data: events, error: events.length ? null : `Relay timed out: ${relayUrl}` });
    }, 2500);

    socket.onopen = () => {
      socket.send(
        JSON.stringify([
          'REQ',
          subscriptionId,
          {
            kinds: [P2PESA_REVIEW_KIND],
            '#p': [agentPubkey],
            limit: 50,
          },
        ])
      );
    };

    socket.onmessage = (message) => {
      const payload = safeJson(message.data);
      if (!Array.isArray(payload)) {
        return;
      }

      if (payload[0] === 'EVENT' && payload[1] === subscriptionId) {
        events.push(payload[2] as NostrEvent);
      }

      if (payload[0] === 'EOSE' && payload[1] === subscriptionId) {
        window.clearTimeout(timeout);
        socket.send(JSON.stringify(['CLOSE', subscriptionId]));
        socket.close();
        resolve({ data: events, error: null });
      }
    };

    socket.onerror = () => {
      window.clearTimeout(timeout);
      socket.close();
      resolve({ data: [], error: `Could not fetch reviews from relay: ${relayUrl}` });
    };
  });
}

function safeJson(raw: unknown): unknown {
  if (typeof raw !== 'string') {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
