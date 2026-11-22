import { tr } from './language';
import { instantAction, useHouseRound } from './use-house-round';
import { lazy, Suspense, useState } from 'react';
import { GameHUD } from './hud';
import { DisplayControls } from './display-controls';
import { SoundControl } from './sound-control';
import { useSoundscape } from './use-soundscape';
import { SplashScreen } from './splash';
const PaintedScene = lazy(() =>
  import('./scene').then((module) => ({ default: module.PaintedScene })),
);
import { Inspection, PaperDialog } from './inspection';
import { Journal } from './journal';
import { Reveal } from './reveal';
import { initialState, hint, type Action } from './game';
import { getLocation, type ObjectId } from './locations';
import './style.css';

type Overlay = ObjectId | 'journal' | 'hint' | 'restart' | null;
export default function Demo() {
  const [started, setStarted] = useState(false);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [reveal, setReveal] = useState(false);
  const [finaleReady, setFinaleReady] = useState(false);
  const [pan, setPan] = useState(0.5);
  const [markers, setMarkers] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const close = () => setOverlay(null);
  const {
    game,
    audio,
    passage,
    perform,
    note,
    setNote,
    reaction,
    reactTo,
    finishReaction,
    resetRound,
  } = useHouseRound(close, () => {
    setPan(0.5);
    setHintLevel(0);
  });
  function openPortrait() {
    audio.play('birthday');
    setReveal(true);
  }
  function pick(id: ObjectId) {
    reactTo({ object: id, kind: 'touch' });
    const action = instantAction(id, game.room);
    if (action) {
      perform(action);
      return;
    }
    if (id === 'frame' && finaleReady) {
      openPortrait();
      return;
    }
    audio.play('touch');
    setOverlay(id);
    setNote('');
  }
  function restart() {
    resetRound();
    close();
    setReveal(false);
    setFinaleReady(false);
    setPan(0.5);
    setHintLevel(0);
  }
  const panBy = (delta: number) => setPan((value) => Math.min(1, Math.max(0, value + delta)));
  return (
    <main className="birthday-house motion-on">
      {started && (
        <Suspense
          fallback={
            <div className="scene-loading">
              {tr('Tænder lys i huset…', 'Lighting up the house…')}
            </div>
          }
        >
          <PaintedScene
            game={game}
            reaction={reaction}
            onReactionEnd={finishReaction}
            onFinaleReady={() => {
              setFinaleReady(true);
              setNote(tr('Et minde, gemt til dig.', 'A memory saved for you.'));
            }}
            onRoomReady={passage.ready}
            reduced={false}
            pan={pan}
            close={!!overlay}
            markers={markers}
            covered={reveal}
            active={(!game.revealed || finaleReady) && !passage.busy}
            onPick={pick}
            onPan={panBy}
            onFocus={(x) => setPan(x)}
          />
          <div className="edge-shade" />
        </Suspense>
      )}
      <div className={`passage passage-${passage.phase}`} aria-hidden="true">
        <i>✦</i>
      </div>
      <HouseHeader started={started} room={game.room} audio={audio} />
      {!started ? (
        <SplashScreen
          onStart={() => {
            void audio.start();
            setStarted(true);
            setNote(tr('Invitationen venter.', 'Your invitation is waiting.'));
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
          openReveal={openPortrait}
          toggleMarkers={() => setMarkers(!markers)}
        />
      )}
      <HouseDialogs
        overlay={overlay}
        game={game}
        close={close}
        perform={perform}
        hintLevel={hintLevel}
        nextHint={() => setHintLevel((v) => Math.min(2, v + 1))}
        audio={audio}
        reveal={reveal}
        closeReveal={() => setReveal(false)}
        restart={restart}
      />
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
          {tr('Et tydeligere hint', 'A clearer hint')}
        </button>
      </PaperDialog>
    );
  if (overlay === 'restart') return <RestartDialog restart={restart} close={close} />;

  return <Inspection id={overlay} game={game} onClose={close} perform={perform} />;
}

function RestartDialog({ restart, close }: { restart: () => void; close: () => void }) {
  return (
    <PaperDialog
      title={tr('Klar til et nyt lille eventyr?', 'Ready for another little adventure?')}
      onClose={close}
    >
      <p>
        {tr(
          'Rummene og notesbogen bliver som ved begyndelsen.',
          'The rooms and your notebook will return to their starting state.',
        )}
      </p>
      <button className="ink-button" onClick={restart}>
        {tr('Begynd forfra', 'Start over')}
      </button>
      <button className="text-button" onClick={close}>
        {tr('Fortsæt på opdagelse', 'Keep exploring')}
      </button>
    </PaperDialog>
  );
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
        {tr('FØDSELSDAGSHUSET', 'THE BIRTHDAY HOUSE')}
        <span>{getLocation(room).name}</span>
      </div>
      <div className="house-controls">
        <AudioToggle audio={audio} />
        <DisplayControls />
      </div>
    </header>
  );
}

function AudioToggle({ audio }: { audio: ReturnType<typeof useSoundscape> }) {
  return (
    <SoundControl
      muted={audio.muted}
      blocked={audio.blocked}
      unavailable={audio.unavailable}
      onToggle={audio.toggle}
    />
  );
}

function HouseDialogs({
  overlay,
  game,
  close,
  perform,
  audio,
  hintLevel,
  nextHint,
  reveal,
  closeReveal,
  restart,
}: {
  overlay: Overlay;
  game: ReturnType<typeof initialState>;
  close: () => void;
  perform: (a: Action, keep?: boolean) => void;
  audio: ReturnType<typeof useSoundscape>;
  hintLevel: number;
  nextHint: () => void;
  reveal: boolean;
  closeReveal: () => void;
  restart: () => void;
}) {
  return (
    <>
      <Overlays
        overlay={overlay}
        game={game}
        close={close}
        perform={perform}
        hintLevel={hintLevel}
        nextHint={nextHint}
        restart={restart}
      />
      {reveal && (
        <Reveal
          onClose={closeReveal}
          replay={restart}
          soundControl={<AudioToggle audio={audio} />}
        />
      )}
    </>
  );
}
