import { useEffect, useRef, useState, type RefObject, type CSSProperties } from 'react';
import { Button } from '@lab/ui/button';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useReactionRoom } from './use-reaction-room';
import { capacity, reactions, hotReactions, validRoomCode } from './reactions';
import { RoomLobby, RoomShare } from './room-controls';
import './reaction-room.css';

export default function ReactionRoom() {
  const code = new URLSearchParams(location.search).get('reactionRoom') ?? '';
  return validRoomCode(code) ? <LiveRoom code={code} /> : <RoomLobby />;
}
function LiveRoom({ code }: { code: string }) {
  const room = useReactionRoom(code);
  const screen = useRef<HTMLDivElement>(null);
  const hot = hotReactions(room.wall.events, room.wall.now);
  const guide = galleryHref('/track/modern-web/devices');
  return (
    <div className="reaction-room" ref={screen}>
      <section className="reaction-stage" aria-label="Live reactions">
        <RoomHeader code={code} count={room.ready ? room.peers + 1 : 0} screen={screen} />
        <ReactionWall room={room} hot={hot} />
        <div className="reaction-actions" aria-label="Send a reaction">
          {reactions.map(({ emoji, label }) => (
            <Button
              key={emoji}
              variant="outline"
              disabled={!room.ready}
              aria-label={`Send ${label.toLowerCase()}`}
              data-hot={hot.includes(emoji)}
              onClick={() => room.cheer(emoji)}
            >
              <span className="reaction-action-emoji" aria-hidden="true">
                {emoji}
              </span>
              <span>{label}</span>
              {hot.includes(emoji) && (
                <span className="reaction-fire" aria-label="On fire">
                  🔥
                </span>
              )}
            </Button>
          ))}
        </div>
        <div className="reaction-connection">
          <p role="status">{room.status}</p>
          <Button variant="ghost" onClick={() => location.reload()}>
            Retry connection
          </Button>
        </div>
      </section>
      <RoomShare code={code} />
      <footer className="reaction-footnote">
        Live reactions, no saved history. Codes are public labels, not passwords. A running room
        server connects the screens.
        {guide && (
          <>
            {' '}
            <a href={guide}>How do browsers connect?</a>
          </>
        )}
      </footer>
    </div>
  );
}
function ReactionWall({ room, hot }: { room: ReturnType<typeof useReactionRoom>; hot: string[] }) {
  const particles = room.wall.events.filter((event) => room.wall.now - event.at < 2400).slice(-64);
  return (
    <div className="reaction-wall" data-testid="reaction-wall" data-hot={hot.length > 0}>
      <div className="reaction-wall-grid" aria-hidden="true" />
      <div className="reaction-wall-message">
        <p className="eyebrow">
          {hot.length ? 'The room is on fire' : 'Tap something. Start a wave.'}
        </p>
        <div className="reaction-hot" aria-label="Reactions on fire">
          {hot.length ? hot.join(' ') + ' 🔥' : '✦'}
        </div>
        <p>
          <strong data-testid="reaction-total">{room.wall.total}</strong> reactions this visit
        </p>
      </div>
      <div className="reaction-particles" aria-hidden="true">
        {particles.map((event) => (
          <span
            key={event.id}
            className="reaction-particle"
            data-hot={hot.includes(event.emoji)}
            style={
              {
                '--x': `${8 + ((event.id * 37) % 84)}%`,
                '--drift': `${((event.id * 53) % 120) - 60}px`,
                '--turn': `${((event.id * 13) % 50) - 25}deg`,
              } as CSSProperties
            }
          >
            {event.emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

function RoomHeader({
  code,
  count,
  screen,
}: {
  code: string;
  count: number;
  screen: RefObject<HTMLDivElement | null>;
}) {
  const [error, setError] = useState('');
  const [full, setFull] = useState(false);
  useEffect(() => {
    const update = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await screen.current?.requestFullscreen();
      setError('');
    } catch {
      setError('Fullscreen is unavailable here. The room still works in this window.');
    }
  }
  return (
    <header className="reaction-stage-header">
      <div>
        <span className="eyebrow">Reaction Room</span>
        <strong>{code}</strong>
      </div>
      <div className="reaction-stage-tools">
        <span data-testid="reaction-peers">
          {count} / {capacity} screens connected here
        </span>
        <Button
          variant="outline"
          onClick={() => {
            void fullscreen();
          }}
        >
          {full ? 'Exit fullscreen' : 'Fullscreen'}
        </Button>
      </div>
      {error && <p role="status">{error}</p>}
    </header>
  );
}
