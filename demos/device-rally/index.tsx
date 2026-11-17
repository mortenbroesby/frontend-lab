import { galleryHref } from '@lab/demo-kit/gallery-link';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { Button } from '@lab/ui/button';
import { useState } from 'react';
import { useRallyRoom } from './use-rally-room';
import './device-rally.css';

function initialRoomCode() {
  const code = new URLSearchParams(location.search).get('rallyRoom') ?? '';
  return /^[a-z0-9-]{1,24}$/.test(code) ? code : 'front-end-lab';
}

export default function DeviceRally() {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [joined, setJoined] = useState<string | null>(initialRoomCode);
  const { status, peers, cheers, cheer, leave } = useRallyRoom(joined);

  function join(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = new URL(location.href);
    url.searchParams.set('rallyRoom', roomCode);
    history.replaceState(null, '', url);
    // shortcut: a fresh Trystero endpoint avoids failed immediate rejoin; revisit on library upgrade.
    location.reload();
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
            leave();
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
