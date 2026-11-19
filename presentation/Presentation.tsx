import { useSlideSwipe } from './use-slide-swipe';
import { SlideStage } from './slide-stage';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { usePresentationFocus } from './presentation-focus';
import { RemotePairing } from './presenter-remote';
import { Button } from '@lab/ui/button';
import { Progress } from '@lab/ui/progress';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { LabMark } from '@lab/demo-kit/mark';
import { useTheme } from '@lab/ui/theme-control';
import { slides } from './slides';
import { useElapsedTime, useFullscreen, useSlides } from './use-presentation';

function PresenterPanel({
  index,
  timer,
  hidden,
  remoteConnected,
  children,
}: {
  index: number;
  timer: ReturnType<typeof useElapsedTime>;
  hidden: boolean;
  remoteConnected: boolean;
  children: ReactNode;
}) {
  return (
    <aside className="presenter-panel" aria-label="Presenter tools" hidden={hidden}>
      <section className="presenter-remote-setup" aria-label="Presenter remote setup">
        <h2>Presenter remote</h2>
        <p>
          {remoteConnected
            ? 'Your remote is connected. Notes are shown there.'
            : 'Use a second screen for notes and slide controls.'}
        </p>
        {children}
      </section>
      <div className="presenter-clock">
        <div>
          <span>Elapsed time</span>
          <strong>{timer.formatted}</strong>
        </div>
        <Button variant="outline" onClick={timer.reset}>
          Reset timer
        </Button>
      </div>
      <div className="next-slide">
        <h2>Up next</h2>
        {index + 1 < slides.length ? (
          <>
            <p>{slides[index + 1].title}</p>
            <SlideStage index={index + 1} preview />
          </>
        ) : (
          <p>End of the presentation.</p>
        )}
      </div>
      <div className="speaker-notes" hidden={remoteConnected}>
        <h2>Speaker notes</h2>
        <p>{slides[index].notes || 'No notes for this slide.'}</p>
      </div>
    </aside>
  );
}

function PresentationControls({
  index,
  move,
  presenter,
  setPresenter,
  setClean,
}: {
  index: number;
  move: (delta: number) => void;
  presenter: boolean;
  setPresenter: ((value: boolean) => void) | undefined;
  setClean: (value: boolean) => void;
}) {
  const fullscreen = useFullscreen();
  return (
    <footer className="presentation-controls">
      <div className="slide-navigation" aria-label="Slide navigation">
        <Button
          variant="outline"
          onClick={() => move(-1)}
          disabled={index === 0}
          aria-label="Previous slide"
        >
          ←
        </Button>
        <span aria-live="polite" aria-atomic="true">
          {index + 1} / {slides.length}
        </span>
        <Button
          variant="outline"
          onClick={() => move(1)}
          disabled={index === slides.length - 1}
          aria-label="Next slide"
        >
          →
        </Button>
      </div>
      <p className="shortcut-hint">Arrow keys or Space to advance</p>
      <div className="presentation-actions">
        {setPresenter && (
          <Button variant="ghost" aria-pressed={presenter} onClick={() => setPresenter(!presenter)}>
            Presenter view
          </Button>
        )}
        <Button variant="ghost" onClick={() => setClean(true)}>
          Hide controls
        </Button>
        <Button
          variant="outline"
          disabled={!fullscreen.supported}
          onClick={() => {
            void fullscreen.toggle().then((entered) => {
              if (entered) setClean(true);
            });
          }}
        >
          {fullscreen.active ? 'Exit fullscreen' : 'Fullscreen'}
        </Button>
      </div>
      {fullscreen.error && (
        <p role="status" className="fullscreen-error">
          {fullscreen.error}
        </p>
      )}
    </footer>
  );
}

function PresentationFooter({
  index,
  move,
  presenter,
  setPresenter,
  setClean,
}: Parameters<typeof PresentationControls>[0]) {
  return (
    <>
      <Progress
        className="deck-progress"
        value={index + 1}
        max={slides.length}
        aria-label="Presentation progress"
      />
      <PresentationControls
        index={index}
        move={move}
        presenter={presenter}
        setPresenter={setPresenter}
        setClean={setClean}
      />
    </>
  );
}

export function Presentation() {
  useTheme();
  const { index, move, input, exitDemo } = useSlides();
  const swipe = useSlideSwipe(index, move);
  const timer = useElapsedTime();
  const { focus: focusScope, walkthrough, demoStatus } = usePresentationFocus();
  const appHref = galleryHref('/');
  const remoteState = useMemo(
    () => ({
      kind: 'state' as const,
      focus: focusScope,
      walkthrough,
      demoStatus,
      index,
      total: slides.length,
      title: slides[index].title,
      notes: slides[index].notes ?? '',
      next: slides[index + 1]?.title ?? '',
      elapsed: timer.formatted,
    }),
    [index, timer.formatted, focusScope, walkthrough, demoStatus],
  );
  const { mode, setMode, setPresenter, setClean, onRemoteConnection, remoteConnected } =
    usePresentationMode();
  return (
    <div className={`presentation-app is-${mode}`}>
      <a
        className="presentation-skip"
        href="#presentation-stage"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('presentation-stage')?.focus();
        }}
      >
        Skip to slide
      </a>
      <header className="presentation-header">
        <span>
          <LabMark />
          The Frontend Lab
        </span>
        {appHref && (
          <Button variant="ghost" asChild>
            <a href={appHref}>← Back to app</a>
          </Button>
        )}
      </header>
      <main id="presentation-stage" className="presentation-body" tabIndex={-1}>
        <div className="audience-stage" {...swipe}>
          <SlideStage index={index} onDemoExit={exitDemo} />
        </div>
        <PresenterPanel
          index={index}
          timer={timer}
          hidden={mode !== 'presenter'}
          remoteConnected={remoteConnected}
        >
          <RemotePairing
            state={remoteState}
            input={input}
            onConnectionChange={onRemoteConnection}
          />
        </PresenterPanel>
      </main>
      {mode === 'clean' ? (
        <Button className="restore-controls" variant="outline" onClick={() => setMode('audience')}>
          Show controls
        </Button>
      ) : (
        <PresentationFooter
          index={index}
          move={move}
          presenter={mode === 'presenter'}
          setPresenter={setPresenter}
          setClean={setClean}
        />
      )}
    </div>
  );
}

function usePresentationMode() {
  const [mode, setMode] = useState<'audience' | 'presenter' | 'clean'>('clean');
  const [remoteConnected, setRemoteConnected] = useState(false);
  const onRemoteConnection = useCallback((connected: boolean) => {
    setRemoteConnected(connected);
    if (connected) setMode('clean');
  }, []);
  const setPresenter = (active: boolean) => setMode(active ? 'presenter' : 'audience');
  const setClean = () => setMode('clean');
  return {
    mode,
    setMode,
    setClean,
    onRemoteConnection,
    setPresenter,
    remoteConnected,
  };
}
