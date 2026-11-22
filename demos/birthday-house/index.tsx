import { useState } from 'react';
import { GameHUD } from './hud';
import { PaintedScene } from './scene';
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
      setNote('A new page in your notebook.');
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
      <header className="house-header">
        <div className="wordmark">
          THE BIRTHDAY HOUSE
          <span>{started ? locations[game.room]!.name : 'A little mystery, made for you'}</span>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setReduced(!reduced)}
            aria-pressed={reduced}
            aria-label="Reduce motion"
          >
            {reduced ? 'Stillness' : 'Living light'}
          </button>
          <button
            onClick={() => {
              document.documentElement
                .requestFullscreen?.()
                .catch(() => setNote('This browser is already showing the full page.'));
            }}
            disabled={!document.documentElement.requestFullscreen}
            aria-label="Enter full screen"
          >
            ⛶
          </button>
        </div>
      </header>
      {!started ? (
        <section className="invitation">
          <p className="eyebrow">AN INVITATION AT BLUE HOUR</p>
          <h1>
            Someone left
            <br />
            the lights on.
          </h1>
          <p>
            A quiet house. A sleeping photograph.
            <br />
            And a secret, waiting just for you.
          </p>
          <button
            className="gold-button"
            onClick={() => {
              setStarted(true);
              setNote(
                'Explore the room. Open the invitation beside the flowers, then touch the buns, cake, and coffee.',
              );
            }}
          >
            Step inside <span>→</span>
          </button>
          <small>Tap an object to explore. No clock. No hurry.</small>
        </section>
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
