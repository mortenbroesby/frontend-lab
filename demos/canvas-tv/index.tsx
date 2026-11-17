import { useEffect, useReducer, useRef, useState, type RefObject, type KeyboardEvent } from 'react';
import { Button } from '@lab/ui/button';
import { useTheme } from '@lab/ui/theme-control';
import { LabMark } from '@lab/demo-kit/mark';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { initialState, navigate, selectedTitle, playbackHint, type TVState } from './navigation';
import { rows } from './catalogue';
import { RemotePad } from './remote-pad';
import { PhonePairing, PhoneRemote, phoneRoom } from './phone-remote';
import { useScreen } from './use-screen';
import './tv.css';

const embedded = new URLSearchParams(window.location.search).has('embed');

export default function CanvasTV() {
  return phoneRoom ? <PhoneRemote code={phoneRoom} /> : <TV />;
}

function TV() {
  useTheme();
  const [state, dispatch] = useReducer(navigate, initialState);
  const { canvas, available } = useScreen(state);
  const screen = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (embedded) screen.current?.focus();
  }, []);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      [
        event.target !== event.currentTarget,
        event.altKey,
        event.ctrlKey,
        event.metaKey,
        event.shiftKey,
        event.nativeEvent.isComposing,
      ].some(Boolean)
    )
      return;
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'Backspace'].includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    dispatch(event.key);
  };
  return (
    <div className={embedded ? 'tv-shell tv-embedded' : 'tv-shell'}>
      <a className="tv-skip" href="#tv-screen" onClick={() => screen.current?.focus()}>
        Skip to TV screen
      </a>
      <TVIntro />
      <main>
        <div
          id="tv-screen"
          className="tv-screen"
          ref={screen}
          tabIndex={0}
          role="region"
          aria-label="TV remote navigation"
          aria-describedby="tv-help tv-selection"
          onKeyDown={onKeyDown}
        >
          <canvas ref={canvas} aria-hidden="true" />
          {!available && (
            <p className="tv-unavailable">
              Canvas is unavailable in this browser. You can still explore the catalogue with the
              controls below.
            </p>
          )}
        </div>
        <RemoteControls screen={screen} dispatch={dispatch} />
        <PhonePairing state={state} dispatch={dispatch} />
        <Selection state={state} />
      </main>
    </div>
  );
}

function TVIntro() {
  if (embedded) return null;
  const back = galleryHref('/demos');
  return (
    <>
      <header className="tv-header">
        <span>
          <LabMark /> Frontend Lab
        </span>
        {back && (
          <Button variant="outline" asChild>
            <a href={back}>← All demos</a>
          </Button>
        )}
      </header>
      <section className="tv-intro">
        <div>
          <p className="tv-eyebrow">CANVAS / REMOTE CONTROL</p>
          <h1>Your next escape.</h1>
        </div>
        <p>
          A fictional streaming catalogue, drawn in Canvas. Browse with arrow keys; Enter plays a
          short scene and Escape returns. Browse twelve looping rows; moving vertically keeps your
          column. Continue watching shows illustrative progress.
        </p>
      </section>
    </>
  );
}
function RemoteControls({
  screen,
  dispatch,
}: {
  screen: RefObject<HTMLDivElement | null>;
  dispatch: (key: string) => void;
}) {
  const [error, setError] = useState('');
  const fullscreen = async () => {
    try {
      await screen.current?.parentElement?.requestFullscreen();
      screen.current?.focus();
      setError('');
    } catch {
      setError('Fullscreen is unavailable. The keyboard remote still works here.');
    }
  };
  return (
    <>
      <div className="tv-controls">
        <div className="tv-launch">
          <p id="tv-help">Focus the screen to use ↑ ↓ ← →, Enter and Escape.</p>
          <Button variant="outline" onClick={() => screen.current?.focus()}>
            Use keyboard remote
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              void fullscreen();
            }}
          >
            Fullscreen TV
          </Button>
        </div>
        <RemotePad dispatch={dispatch} />
      </div>
      {error && <p role="status">{error}</p>}
    </>
  );
}
function Selection({ state }: { state: TVState }) {
  const programme = selectedTitle(state);
  return (
    <p
      id="tv-selection"
      className="tv-selection"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      Row {state.row + 1} of {rows.length}, {rows[state.row].title}.{' '}
      {state.playing ? 'Playing' : 'Selected'}: <strong>{programme.title}</strong> ·{' '}
      {programme.genre}. {programme.description}
      {state.playing && playbackHint(state)}
    </p>
  );
}
