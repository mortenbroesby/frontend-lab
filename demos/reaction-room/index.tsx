import { galleryHref } from '@lab/demo-kit/gallery-link';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { Button } from '@lab/ui/button';
import { useState } from 'react';
import { useReactionRoom } from './use-reaction-room';
import './reaction-room.css';

function initialRoomCode() {
  const code = new URLSearchParams(location.search).get('reactionRoom') ?? '';
  return /^[a-z0-9-]{1,24}$/.test(code) ? code : 'front-end-lab';
}

export default function ReactionRoom() {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [joined, setJoined] = useState<string | null>(initialRoomCode);
  const room = useReactionRoom(joined);
  const { status, leave } = room;

  function join(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = new URL(location.href);
    url.searchParams.set('reactionRoom', roomCode);
    history.replaceState(null, '', url);
    // shortcut: a fresh Trystero endpoint avoids failed immediate rejoin; revisit on library upgrade.
    location.reload();
  }

  const guide = galleryHref('/track/modern-web/devices');
  return (
    <div className="reaction-room">
      <ReactionStage room={room} joined={joined !== null} />
      <aside className="reaction-room-panel" aria-labelledby="room-heading">
        <div>
          <p className="eyebrow">Trystero / WebRTC</p>
          <h2 id="room-heading">Your room</h2>
          <p>Same code. Connected screens.</p>
        </div>
        {joined ? (
          <div className="reaction-room-code">
            <span>Room code</span>
            <strong>{joined}</strong>
            <p>Use this code on each device.</p>
          </div>
        ) : (
          <form className="reaction-room-form" onSubmit={join}>
            <Label htmlFor="reaction-room">Room code</Label>
            <Input
              id="reaction-room"
              value={roomCode}
              pattern={'[a-z0-9\\-]{1,24}'}
              maxLength={24}
              required
              name="room"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="room-format"
              onChange={(event) => setRoomCode(event.target.value.toLowerCase())}
            />
            <p id="room-format">1–24 lowercase letters, numbers or hyphens.</p>
            <Button type="submit">Join room</Button>
          </form>
        )}
        <p className="reaction-connection" role="status">
          {status}
        </p>
        {joined && (
          <Button
            variant="outline"
            onClick={() => {
              setJoined(null);
              leave();
            }}
          >
            Leave room
          </Button>
        )}
      </aside>
      <footer className="reaction-footnote">
        <div className="reaction-room-help">
          <h3>Bring another screen</h3>
          <p>
            Use the hosted demo on your phone, or two localhost windows on this computer. Devices
            need internet and trusted HTTPS; plain HTTP over LAN will not connect.
          </p>
          {guide && <a href={guide}>How do browsers connect? →</a>}
        </div>
        <p>Up to 12 people · Live reactions, no saved history · Late arrivals start at zero.</p>
        <p>
          Room codes are public labels, not passwords. Nostr relays handle discovery; WebRTC carries
          reactions. Some networks block connections.
        </p>
      </footer>
    </div>
  );
}

function roomView(supported: boolean, joined: boolean, peers: number) {
  if (!supported)
    return {
      status: 'Connection unavailable',
      title: 'A secure connection is needed.',
      hint: 'Use localhost or open the hosted demo over HTTPS.',
    };
  if (!joined)
    return {
      status: 'Not in a room',
      title: 'Start with a room.',
      hint: 'Choose a room code to connect.',
    };
  if (peers)
    return {
      status: 'Connected',
      title: 'Send a little hello.',
      hint: 'Pick a reaction. Watch it arrive on the other screens.',
    };
  return {
    status: 'Waiting for company',
    title: 'Better with another screen.',
    hint: 'Open this demo in another browser and use the same room code.',
  };
}

function ReactionStage({
  room,
  joined,
}: {
  room: ReturnType<typeof useReactionRoom>;
  joined: boolean;
}) {
  const { supported, peers, cheers, cheer } = room;
  const view = roomView(supported, joined, peers);
  const reactions = [
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '✨', label: 'Sparkle' },
    { emoji: '💜', label: 'Heart' },
  ];
  return (
    <section className="reaction-stage" aria-label="Live reactions">
      <header className="reaction-stage-header">
        <span className="reaction-status" data-connected={peers > 0}>
          <span aria-hidden="true" />
          {view.status}
        </span>
        <span className="reaction-count" data-testid="reaction-peers">
          Other devices: {peers}
        </span>
      </header>
      <div className="reaction-display">
        <div className="reaction-orbit">
          <div
            key={cheers.total}
            className="reaction-emoji"
            data-testid="reaction-emoji"
            role="img"
            aria-label={
              reactions.find((reaction) => reaction.emoji === cheers.emoji)?.label ?? 'Wave'
            }
          >
            {cheers.emoji}
          </div>
        </div>
        <h2>{view.title}</h2>
        <p>{view.hint}</p>
      </div>
      <div className="reaction-actions" aria-label="Send a reaction">
        {reactions.map(({ emoji, label }) => (
          <Button
            key={emoji}
            variant="outline"
            disabled={!peers}
            aria-label={`Send ${label.toLowerCase()}`}
            onClick={() => cheer(emoji)}
          >
            <span className="reaction-action-emoji" aria-hidden="true">
              {emoji}
            </span>
            {label}
          </Button>
        ))}
      </div>
      <p className="reaction-total" aria-live="polite" data-testid="reaction-total">
        <strong>{cheers.total}</strong> reactions seen here
      </p>
    </section>
  );
}
