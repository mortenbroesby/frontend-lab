import { galleryHref } from '@lab/demo-kit/gallery-link';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { Button } from '@lab/ui/button';
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
  return /^[a-z0-9-]{1,24}$/.test(code) ? code : 'front-end-lab';
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
        'Requires WebRTC and localhost on each device or trusted HTTPS. Plain HTTP LAN addresses will not work.',
      );
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    let room: Room | undefined;
    setPeers(0);
    setCheers({ total: 0, emoji: '👋' });
    setStatus('Discovering peers… Open this demo on another device with the same code.');
    const timer = window.setTimeout(() => {
      if (!room || Object.keys(room.getPeers()).length === 0) {
        setStatus(
          'No peers yet. Check the code and internet. Signaling or WebRTC may be blocked; leave and try another network.',
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
            appId: 'mortenbroesby/front-end-lab/device-rally-v1',
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
              : 'Waiting for a device with the same room code.',
          );
          if (count) clearTimeout(timer);
        };
        room.onPeerJoin(updatePeers, { signal });
        room.onPeerLeave(updatePeers, { signal });
        room.onError(
          (error) => {
            clearTimeout(timer);
            setStatus(
              `Connection error (${error.code}). Check internet and room code. Restricted networks may need TURN (not configured). Leave and retry, or refresh both pages.`,
            );
          },
          { signal },
        );
        await room.ready;
      } catch {
        if (!signal.aborted) {
          clearTimeout(timer);
          setStatus('Cannot join. Check internet and browser support; leave and retry.');
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
        if (action.current === current) setStatus('Cheer failed. Check the connection and retry.');
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
          <Button disabled={!peers} aria-label="Send rocket" onClick={() => void cheer('🚀')}>
            🚀
          </Button>
          <Button disabled={!peers} aria-label="Send sparkle" onClick={() => void cheer('✨')}>
            ✨
          </Button>
          <Button disabled={!peers} aria-label="Send heart" onClick={() => void cheer('💜')}>
            💜
          </Button>
        </div>
        <p className="small">Live cheers, no saved history. Late arrivals start at zero.</p>
      </div>
      <div className="controls">
        <p className="eyebrow">Trystero / WebRTC</p>
        <h3>Find your people. Cheer together.</h3>
        <p>
          Open Device Rally on each device and use the same room code. Peers connect automatically.
          No host or backend setup.
        </p>
        <p>
          Public signaling needs internet; peers can use different networks. Use localhost or
          trusted HTTPS. A phone cannot reach another computer’s localhost.
        </p>
        <form onSubmit={join}>
          <Label htmlFor="rally-room">Room code</Label>
          <Input
            id="rally-room"
            value={roomCode}
            disabled={joined !== null}
            pattern={'[a-z0-9\\-]{1,24}'}
            maxLength={24}
            required
            onChange={(event) => setRoomCode(event.target.value.toLowerCase())}
          />
          <Button disabled={joined !== null} type="submit">
            Join room
          </Button>
        </form>
        <p className="small">Joining reloads the page with the room code in its URL.</p>
        <Button
          disabled={joined === null}
          type="button"
          onClick={() => {
            setJoined(null);
            setPeers(0);
            setStatus('Left the room. Choose a code to rejoin.');
          }}
        >
          Leave room
        </Button>
        <p role="status">{status}</p>
        <p className="small">
          Up to 12 people. Room codes are public labels, not passwords. Nostr relays carry
          signaling; WebRTC carries cheers. Send only playful signals.
        </p>
        {galleryHref('/track/modern-web/devices') && (
          <p>
            <a href={galleryHref('/track/modern-web/devices')}>
              Understand this · Try it in your project
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
