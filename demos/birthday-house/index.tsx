import { lazy, Suspense, useState } from 'react';
import { GameHUD } from './hud';
import { DisplayControls } from './display-controls';
import { SplashScreen } from './splash';
const PaintedScene = lazy(() =>
  import('./scene').then((module) => ({ default: module.PaintedScene })),
);
import { Inspection, PaperDialog } from './inspection';
import { Journal } from './journal';
import { Reveal } from './reveal';
import { initialState, act, hint, type Action } from './game';
import { feedback } from './content';
import { locations, type ObjectId } from './locations';
import './style.css';

type Overlay = ObjectId | 'journal' | 'hint' | 'restart' | null;
const doors: Partial<Record<ObjectId, Action>> = {
  breakfast: 'breakfast',
  darkroom: 'darkroom',
  attic: 'attic',
};
export default function Demo() {
  const [game, setGame] = useState(initialState);
  const [started, setStarted] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [reveal, setReveal] = useState(false);
  const [pan, setPan] = useState(0.5);
  const [markers, setMarkers] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [note, setNote] = useState('');
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  function perform(action: Action, keep = false) {
    const next = act(game, action);
    setGame(next);
    if (!keep) setOverlay(null);
    if (action === 'readnote' || action === 'readrecipe') {
      setNote('Kept in your notebook.');
      return;
    }
    setNote(feedback(game, next, action));
    if (next.room !== game.room) {
      setPan(0.5);
      setHintLevel(0);
    }
  }
  function pick(id: ObjectId) {
    if (!started) return;
    if (game.room === 0 && (id === 'bun' || id === 'cake' || id === 'cup')) {
      perform(id);
      return;
    }
    const door = doors[id];
    if (door) {
      perform(door);
      return;
    }
    if (id === 'frame' && game.revealed) {
      setReveal(true);
      return;
    }
    setOverlay(id);
    setNote('');
  }
  function restart() {
    setGame(initialState());
    setOverlay(null);
    setReveal(false);
    setNote('');
    setPan(0.5);
    setHintLevel(0);
  }
  const close = () => setOverlay(null);
  const panBy = (delta: number) => setPan((value) => Math.min(1, Math.max(0, value + delta)));
  return (
    <main className={`birthday-house ${reduced ? 'motion-off' : ''}`}>
      {started && (
        <Suspense fallback={<div className="scene-loading">Lighting the house…</div>}>
          <PaintedScene
            game={game}
            reduced={reduced}
            pan={pan}
            close={!!overlay}
            markers={markers}
            active={started}
            onPick={pick}
            onPan={panBy}
            onFocus={(x) => setPan(x)}
          />
          <div className="edge-shade" />
          <div className="room-transition" key={game.room} />
        </Suspense>
      )}
      <header className={`house-header ${started ? '' : 'title-header'}`}>
        {started && (
          <div className="wordmark">
            THE BIRTHDAY HOUSE
            <span>{locations[game.room]!.name}</span>
          </div>
        )}
        <DisplayControls reduced={reduced} onMotion={() => setReduced(!reduced)} />
      </header>
      {!started ? (
        <SplashScreen
          onStart={() => {
            setStarted(true);
            setNote('The invitation is waiting.');
          }}
        />
      ) : (
        <GameHUD
          note={note}
          markers={markers}
          hasPlate={game.negative}
          revealed={game.revealed}
          openJournal={() => setOverlay('journal')}
          openHint={() => setOverlay('hint')}
          openRestart={() => setOverlay('restart')}
          openReveal={() => setReveal(true)}
          toggleMarkers={() => setMarkers(!markers)}
        />
      )}
      <Overlays
        overlay={overlay}
        game={game}
        close={close}
        perform={perform}
        hintLevel={hintLevel}
        nextHint={() => setHintLevel((v) => Math.min(2, v + 1))}
        restart={restart}
      />
      {reveal && <Reveal onClose={() => setReveal(false)} replay={restart} />}
    </main>
  );
}
function Overlays({
  overlay,
  game,
  close,
  perform,
  hintLevel,
  nextHint,
  restart,
}: {
  overlay: Overlay;
  game: ReturnType<typeof initialState>;
  close: () => void;
  perform: (a: Action, keep?: boolean) => void;
  hintLevel: number;
  nextHint: () => void;
  restart: () => void;
}) {
  if (!overlay) return null;
  if (overlay === 'journal') return <Journal game={game} onClose={close} />;
  if (overlay === 'hint')
    return (
      <PaperDialog title="A little nudge" onClose={close}>
        <p>{hint(game, hintLevel)}</p>
        <button className="ink-button" onClick={nextHint} disabled={hintLevel === 2}>
          A clearer hint
        </button>
      </PaperDialog>
    );
  if (overlay === 'restart')
    return (
      <PaperDialog title="Begin another little adventure?" onClose={close}>
        <p>The rooms and your notebook will return to how you found them.</p>
        <button className="ink-button" onClick={restart}>
          Start again
        </button>
        <button className="text-button" onClick={close}>
          Keep exploring
        </button>
      </PaperDialog>
    );
  return <Inspection id={overlay} game={game} onClose={close} perform={perform} />;
}
