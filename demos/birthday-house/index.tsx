import { lazy, Suspense, useState } from 'react';
import { GameHUD } from './hud';
import { DisplayControls } from './display-controls';
import { SoundControl } from './sound-control';
import { useSoundscape } from './use-soundscape';
import { soundFor } from './sound-events';
import { SplashScreen } from './splash';
const PaintedScene = lazy(() =>
  import('./scene').then((module) => ({ default: module.PaintedScene })),
);
import { Inspection, PaperDialog } from './inspection';
import { Journal } from './journal';
import { Reveal } from './reveal';
import { initialState, act, hint, type Action } from './game';
import { reactionFor, type Reaction } from './reactions';
import type { SceneReaction } from './interaction-effects';
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
  const audio = useSoundscape(game);
  const [started, setStarted] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [reveal, setReveal] = useState(false);
  const [finaleReady, setFinaleReady] = useState(false);
  const [pan, setPan] = useState(0.5);
  const [markers, setMarkers] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [note, setNote] = useState('');
  const [reaction, setReaction] = useState<SceneReaction | null>(null);
  function reactTo(next: Reaction) {
    setReaction((previous) => ({ ...next, serial: (previous?.serial ?? 0) + 1 }));
  }
  function perform(action: Action, keep = false) {
    const next = act(game, action);
    audio.play(soundFor(game, next, action));
    setGame(next);
    const response = reactionFor(game, next);
    if (response) reactTo(response);
    if (!keep) setOverlay(null);
    if (action === 'readnote' || action === 'readrecipe') {
      setNote('Gemt i din notesbog.');
      return;
    }
    setNote(feedback(game, next, action));
    if (next.room !== game.room) {
      setPan(0.5);
      setHintLevel(0);
      setReaction(null);
    }
  }
  function pick(id: ObjectId) {
    reactTo({ object: id, kind: 'touch' });
    if (game.room === 0 && (id === 'bun' || id === 'cake' || id === 'cup')) {
      perform(id);
      return;
    }
    const door = doors[id];
    if (door) {
      perform(door);
      return;
    }
    if (id === 'frame' && finaleReady) {
      setReveal(true);
      return;
    }
    audio.play('touch');
    setOverlay(id);
    setNote('');
  }
  function restart() {
    setGame(initialState());
    setReaction(null);
    setOverlay(null);
    setReveal(false);
    setFinaleReady(false);
    setNote('');
    setPan(0.5);
    setHintLevel(0);
  }
  const close = () => setOverlay(null);
  const panBy = (delta: number) => setPan((value) => Math.min(1, Math.max(0, value + delta)));
  return (
    <main className="birthday-house motion-on">
      {started && (
        <Suspense fallback={<div className="scene-loading">Tænder lys i huset…</div>}>
          <PaintedScene
            game={game}
            reaction={reaction}
            onReactionEnd={(serial) =>
              setReaction((current) => clearFinishedReaction(current, serial))
            }
            onFinaleReady={() => {
              setFinaleReady(true);
              setNote('Et minde, gemt til dig.');
            }}
            onNisse={() => audio.play('nisse')}
            reduced={false}
            pan={pan}
            close={!!overlay}
            markers={markers}
            active={!game.revealed || finaleReady}
            onPick={pick}
            onPan={panBy}
            onFocus={(x) => setPan(x)}
          />
          <div className="edge-shade" />
          <div className="room-transition" key={game.room} />
        </Suspense>
      )}
      <HouseHeader started={started} room={game.room} audio={audio} />
      {!started ? (
        <SplashScreen
          onStart={() => {
            void audio.start();
            setStarted(true);
            setNote('Invitationen venter.');
          }}
        />
      ) : (
        <GameHUD
          note={note}
          markers={markers}
          hasPlate={game.negative}
          revealed={finaleReady}
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
      <PaperDialog title="Hint" onClose={close}>
        <p>{hint(game, hintLevel)}</p>
        <button className="ink-button" onClick={nextHint} disabled={hintLevel === 2}>
          Et tydeligere hint
        </button>
      </PaperDialog>
    );
  if (overlay === 'restart')
    return (
      <PaperDialog title="Klar til et nyt lille eventyr?" onClose={close}>
        <p>Rummene og notesbogen bliver som ved begyndelsen.</p>
        <button className="ink-button" onClick={restart}>
          Begynd forfra
        </button>
        <button className="text-button" onClick={close}>
          Fortsæt på opdagelse
        </button>
      </PaperDialog>
    );
  return <Inspection id={overlay} game={game} onClose={close} perform={perform} />;
}

function clearFinishedReaction(current: SceneReaction | null, serial: number) {
  return current?.serial === serial ? null : current;
}

function HouseHeader({
  started,
  room,
  audio,
}: {
  started: boolean;
  room: number;
  audio: ReturnType<typeof useSoundscape>;
}) {
  return (
    <header className={`house-header ${started ? '' : 'title-header'}`}>
      <div className="wordmark" hidden={!started}>
        FØDSELSDAGSHUSET
        <span>{locations[room]!.name}</span>
      </div>
      <div className="house-controls">
        <SoundControl
          muted={audio.muted}
          blocked={audio.blocked}
          unavailable={audio.unavailable}
          onToggle={audio.toggle}
        />
        <DisplayControls />
      </div>
    </header>
  );
}
