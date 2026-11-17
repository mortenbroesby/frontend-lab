import { useReducer, useRef, useState, type RefObject, type KeyboardEvent } from 'react';
import { Button } from '@lab/ui/button';
import { useTheme } from '@lab/ui/theme-control';
import { LabMark } from '@lab/demo-kit/mark';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { initialState, navigate, selectedTitle, type TVState } from './navigation';
import { useScreen } from './use-screen';
import './tv.css';

export default function CanvasTV() {
  useTheme();
  const [state, dispatch] = useReducer(navigate, initialState);
  const { canvas, available } = useScreen(state);
  const screen = useRef<HTMLDivElement>(null);
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
    <div className="tv-shell">
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
        <Selection state={state} />
      </main>
    </div>
  );
}

function TVIntro() {
  const back = galleryHref('/showcases');
  return (
    <>
      <header className="tv-header">
        <span>
          <LabMark /> Front-End Lab
        </span>
        {back && (
          <Button variant="outline" asChild>
            <a href={back}>← Showcases</a>
          </Button>
        )}
      </header>
      <section className="tv-intro">
        <div>
          <p className="tv-eyebrow">CANVAS / REMOTE CONTROL</p>
          <h1>A different kind of screen.</h1>
        </div>
        <p>
          Remote is a TV interface drawn entirely in Canvas. Explore its fictional catalogue with
          arrow keys, then press Enter to open a title. Escape brings you back to the same
          selection. A TV remote has no pointer, so a visible focus and predictable movement matter.
          React manages the state while Canvas draws every title, landscape and focus ring. This is
          an original interaction study, not a recreation of Lightning or a streaming service.
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
      await screen.current?.requestFullscreen();
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
        <div className="tv-remote" role="group" aria-label="On-screen remote">
          <Button variant="outline" aria-label="Move up" onClick={() => dispatch('ArrowUp')}>
            ↑
          </Button>
          <Button variant="outline" aria-label="Move left" onClick={() => dispatch('ArrowLeft')}>
            ←
          </Button>
          <Button onClick={() => dispatch('Enter')}>OK</Button>
          <Button variant="outline" aria-label="Move right" onClick={() => dispatch('ArrowRight')}>
            →
          </Button>
          <Button variant="outline" aria-label="Move down" onClick={() => dispatch('ArrowDown')}>
            ↓
          </Button>
          <Button variant="outline" onClick={() => dispatch('Escape')}>
            Back
          </Button>
        </div>
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
      {state.detail ? 'Details' : 'Selected'}: <strong>{programme.title}</strong> ·{' '}
      {programme.genre}. {programme.description}
      {state.detail && ' Fictional title; no video is streamed.'}
    </p>
  );
}
