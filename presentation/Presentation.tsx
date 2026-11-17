import { useState } from 'react';
import { Button } from '@lab/ui/button';
import { Progress } from '@lab/ui/progress';
import { LabMark } from '@lab/demo-kit/mark';
import { useTheme } from '@lab/ui/theme-control';
import { slides } from './slides';
import { useElapsedTime, useFullscreen, useSlides } from './use-presentation';

function SlideStage({ index, preview = false }: { index: number; preview?: boolean }) {
  const slide = slides[index];
  const Content = slide.Content;
  return (
    <section
      className="slide-stage"
      aria-label={slide.title}
      inert={preview || undefined}
      aria-hidden={preview || undefined}
    >
      <div key={slide.id} className="slide-content">
        <Content preview={preview} />
      </div>
      {slide.id !== 'remote' && (
        <span className="slide-number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      )}
    </section>
  );
}

function PresenterPanel({
  index,
  timer,
}: {
  index: number;
  timer: ReturnType<typeof useElapsedTime>;
}) {
  return (
    <aside className="presenter-panel" aria-label="Presenter tools">
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
          <p>End of the draft.</p>
        )}
      </div>
      <div className="speaker-notes">
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
  setPresenter: (value: boolean) => void;
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
        <Button variant="ghost" aria-pressed={presenter} onClick={() => setPresenter(!presenter)}>
          Presenter view
        </Button>
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
  const { index, move } = useSlides();
  const timer = useElapsedTime();
  const [mode, setMode] = useState<'audience' | 'presenter' | 'clean'>('clean');
  const setPresenter = (active: boolean) => setMode(active ? 'presenter' : 'audience');
  const setClean = () => setMode('clean');
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
        <span>Working draft</span>
      </header>
      <main id="presentation-stage" className="presentation-body" tabIndex={-1}>
        <div className="audience-stage">
          <SlideStage index={index} />
        </div>
        {mode === 'presenter' && <PresenterPanel index={index} timer={timer} />}
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
