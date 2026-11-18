import { useEffect, useRef, useState, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useReactionRoom } from './use-reaction-room';
import { capacity, reactions, validRoomCode } from './reactions';
import { reactionActivity } from './reaction-motion';
import { ReactionPulse } from './reaction-pulse';
import { RoomLobby, RoomShare } from './room-controls';
import './reaction-room.css';

export default function ReactionRoom() {
  const code = new URLSearchParams(location.search).get('reactionRoom') ?? '';
  return validRoomCode(code) ? <LiveRoom code={code} /> : <RoomLobby />;
}
function LiveRoom({ code }: { code: string }) {
  const room = useReactionRoom(code);
  const screen = useRef<HTMLDivElement>(null);
  const activity = reactions.map((reaction) => ({
    ...reaction,
    ...reactionActivity(
      room.wall.events.filter((event) => event.emoji === reaction.emoji),
      room.wall.now,
    ),
  }));
  const guide = galleryHref('/track/modern-web/devices');
  return (
    <div className="reaction-room" ref={screen}>
      <section className="reaction-stage" aria-label="Live reactions">
        <RoomHeader code={code} count={room.ready ? room.peers + 1 : 0} screen={screen} />
        <ReactionWall room={room} activity={activity} />
        <div className="reaction-actions" aria-label="Send a reaction">
          {activity.map(({ emoji, label, heat }) => (
            <Button
              key={emoji}
              variant="outline"
              disabled={!room.ready}
              aria-label={`Send ${label.toLowerCase()}`}
              data-heat={heat}
              onClick={() => room.cheer(emoji)}
            >
              <span className="reaction-action-emoji" aria-hidden="true">
                {emoji}
              </span>
              <span>{label}</span>
              {heat > 0 && (
                <span
                  className="reaction-fire"
                  data-heat={heat}
                  aria-label={heat === 2 ? 'On fire' : 'Warming up'}
                >
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
type Activity = ReturnType<typeof reactionActivity> & { emoji: string; label: string };
function ReactionWall({
  room,
  activity,
}: {
  room: ReturnType<typeof useReactionRoom>;
  activity: Activity[];
}) {
  const heat = Math.max(...activity.map((item) => item.heat));
  return (
    <div className="reaction-wall" data-testid="reaction-wall" data-heat={heat}>
      <div className="reaction-wall-grid" aria-hidden="true" />
      <div className="reaction-wall-message">
        <p className="eyebrow">
          {['Tap again. Build momentum.', 'Warming up', 'The room is on fire'][heat]}
        </p>
      </div>
      <div className="reaction-pulses" aria-label="Live reaction icons">
        {activity.map((item) => (
          <ReactionPulse key={item.emoji} emoji={item.emoji} label={item.label} activity={item} />
        ))}
      </div>
      <p className="reaction-total">
        <strong data-testid="reaction-total">{room.wall.total}</strong> reactions this visit
      </p>
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
