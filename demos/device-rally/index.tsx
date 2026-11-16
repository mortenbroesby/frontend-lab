import { useEffect, useRef, useState } from 'react';
import type { MessageAction, Room } from 'trystero';
import './device-rally.css';

// A route remount must wait for Trystero to release the previous room registration.
let leaving = Promise.resolve();

function supportsPeerConnections() {
  return (
    window.isSecureContext &&
    Boolean(globalThis.crypto?.subtle) &&
    typeof RTCPeerConnection === 'function'
  );
}

function initialRoomCode() {
  const code = new URLSearchParams(location.search).get('rallyRoom') ?? '';
  return /^[a-z0-9-]{1,24}$/.test(code) ? code : 'friday-lab';
}

export default function DeviceRally() {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [joined, setJoined] = useState<string | null>(initialRoomCode);
  const [status, setStatus] = useState('Discovering peers…');
  const [peers, setPeers] = useState(0);
  const [cheers, setCheers] = useState({ total: 0, emoji: '👋' });
  const action = useRef<MessageAction<string> | null>(null);
  const supported = supportsPeerConnections();

  useEffect(() => {
    if (joined === null) return;
    if (!supported) {
      setStatus(
        'This demo needs WebRTC and a secure page. Use localhost on each computer or trusted HTTPS; plain HTTP LAN addresses do not work.',
      );
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    let room: Room | undefined;
    setPeers(0);
    setCheers({ total: 0, emoji: '👋' });
    setStatus('Discovering peers… Open this demo on another computer using the same room code.');
    const timer = window.setTimeout(() => {
      if (!room || Object.keys(room.getPeers()).length === 0) {
        setStatus(
          'Still alone. Check the room code and internet access. Public signaling or WebRTC may be blocked; leave and retry on another network.',
        );
      }
    }, 20000);

    async function connect() {
      try {
        const { joinRoom } = await import('trystero');
        await leaving;
        if (signal.aborted) return;
        room = joinRoom(
          {
            appId: 'mortenbroesby/frontend-chapter-day/device-rally-v1',
            identity: 'none',
            maxUsers: 12,
            maxReceiveBytes: 65536,
          },
          joined!,
        );
        action.current = room.makeAction<string>('cheer');
        action.current.onMessage(
          (emoji) => {
            if (['🚀', '✨', '💜'].includes(emoji))
              setCheers((previous) => ({ total: previous.total + 1, emoji }));
          },
          { signal },
        );
        const updatePeers = () => {
          const count = Object.keys(room!.getPeers()).length;
          setPeers(count);
          setStatus(
            count
              ? `Connected to ${count} other ${count === 1 ? 'device' : 'devices'}. Send a cheer!`
              : 'Waiting for another device. Keep the same room code on both screens.',
          );
          if (count) clearTimeout(timer);
        };
        room.onPeerJoin(updatePeers, { signal });
        room.onPeerLeave(updatePeers, { signal });
        room.onError(
          (error) => {
            clearTimeout(timer);
            setStatus(
              `Connection problem (${error.code}). Check internet and room code; restrictive networks may need TURN, which this demo does not configure. Leave and retry, or refresh both pages.`,
            );
          },
          { signal },
        );
        await room.ready;
      } catch {
        if (!signal.aborted) {
          clearTimeout(timer);
          setStatus(
            'Could not join. Check internet access and browser support, then leave and retry.',
          );
        }
      }
    }
    void connect();
    return () => {
      controller.abort();
      clearTimeout(timer);
      action.current = null;
      leaving = room?.leave().catch(() => {}) ?? leaving;
    };
  }, [joined, supported]);

  function join(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = new URL(location.href);
    url.searchParams.set('rallyRoom', roomCode);
    history.replaceState(null, '', url);
    // shortcut: a fresh Trystero endpoint avoids failed immediate rejoin; revisit on library upgrade.
    location.reload();
  }

  function cheer(emoji: string) {
    const current = action.current;
    if (!current || !peers) return;
    void current.send(emoji).then(
      () => {
        if (action.current === current)
          setCheers((previous) => ({ total: previous.total + 1, emoji }));
      },
      () => {
        if (action.current === current)
          setStatus('The cheer could not be sent. Check the connection and try again.');
      },
    );
  }

  return (
    <div className="experiment-grid device-rally">
      <div className="rally-stage">
        <div
          key={cheers.total}
          className="rally-emoji"
          data-testid="rally-emoji"
          role="img"
          aria-label={
            { '👋': 'Wave', '🚀': 'Rocket', '✨': 'Sparkle', '💜': 'Heart' }[cheers.emoji] ??
            'Cheer'
          }
        >
          {cheers.emoji}
        </div>
        <p className="rally-total" aria-live="polite" data-testid="rally-total">
          {cheers.total} cheers seen here
        </p>
        <p data-testid="rally-peers">{peers} other devices connected</p>
        <div className="rally-buttons">
          <button disabled={!peers} aria-label="Send rocket" onClick={() => void cheer('🚀')}>
            🚀
          </button>
          <button disabled={!peers} aria-label="Send sparkle" onClick={() => void cheer('✨')}>
            ✨
          </button>
          <button disabled={!peers} aria-label="Send heart" onClick={() => void cheer('💜')}>
            💜
          </button>
        </div>
        <p className="small">Live cheers, no saved history. Late arrivals start at zero.</p>
      </div>
      <div className="controls">
        <p className="eyebrow">Trystero / WebRTC</p>
        <h3>Find your people. Cheer together.</h3>
        <p>
          Run the gallery on each computer and open Device rally. Everyone in{' '}
          <strong>friday-lab</strong> discovers each other automatically. No host or backend to
          start.
        </p>
        <p>
          Internet access is required for public signaling. Peers can be on different networks. Use
          localhost or trusted HTTPS; a phone cannot use another computer’s localhost address.
        </p>
        <form onSubmit={join}>
          <label htmlFor="rally-room">Room code</label>
          <input
            id="rally-room"
            value={roomCode}
            disabled={joined !== null}
            pattern="[a-z0-9-]{1,24}"
            maxLength={24}
            required
            onChange={(event) => setRoomCode(event.target.value.toLowerCase())}
          />
          <button disabled={joined !== null} type="submit">
            Join room
          </button>
        </form>
        <p className="small">Joining refreshes this page with the selected room in its URL.</p>
        <button
          disabled={joined === null}
          type="button"
          onClick={() => {
            setJoined(null);
            setPeers(0);
            setStatus('You left the room. Choose a code and join again.');
          }}
        >
          Leave room
        </button>
        <p role="status">{status}</p>
        <p className="small">
          Up to 12 participants. Room codes are public grouping labels, not passwords. Public Nostr
          relays carry signaling; cheers travel over WebRTC. Only use playful signals.
        </p>
        <p className="source">
          Setup and remix: <code>gallery/docs/DEVICE-RALLY.md</code>
        </p>
      </div>
    </div>
  );
}
