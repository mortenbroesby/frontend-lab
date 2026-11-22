import { usePortrait } from './viewport';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Game, Action } from './game';
import { roomView, type ObjectId } from './locations';

type Props = {
  id: ObjectId;
  game: Game;
  onClose: () => void;
  perform: (a: Action, keep?: boolean) => void;
};
export function PaperDialog({
  title,
  children,
  onClose,
  className = '',
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    return () => d.close();
  }, []);
  return (
    <dialog ref={ref} className={`paper-dialog ${className}`} onCancel={onClose}>
      <button className="paper-close" onClick={onClose} aria-label="Back to the room">
        ×
      </button>
      <p className="paper-eyebrow">A CLOSER LOOK</p>
      <h2>{title}</h2>
      {children}
    </dialog>
  );
}
const stories: Partial<Record<ObjectId, { title: string; copy: string }>> = {
  note: {
    title: 'An invitation, in familiar handwriting',
    copy: '“Buns, then cake, then coffee. A little birthday ritual.” Your lights stay lit if you try the wrong thing.',
  },
  bun: {
    title: 'Still warm from the oven',
    copy: 'Warm buns. A tiny brass seal beneath the plate.',
  },
  cake: {
    title: 'A wish, waiting to be made',
    copy: 'A candle, a wish, and a brass seal beneath the cake.',
  },
  cup: {
    title: 'One cup, kept warm',
    copy: 'Warm coffee. One last brass seal under the saucer.',
  },
  cabinet: {
    title: 'The cabinet of little lights',
    copy: 'Three sleeping lights. Buns → cake → coffee wakes them.',
  },
  recipe: {
    title: 'A method for remembering',
    copy: '1. Moon wakes. 2. Rain stills. 3. Star keeps. Try the baths in that order; your progress is safe.',
  },
  develop: {
    title: 'The moon bath',
    copy: 'The first bath. Moon wakes the silver.',
  },
  stop: {
    title: 'The rain bath',
    copy: 'The second bath. Rain stills the image.',
  },
  fix: {
    title: 'The star bath',
    copy: 'The last bath. Star keeps the memory.',
  },
  frame: {
    title: 'The sleeping sun',
    copy: 'A sleeping sun. Aim the magic lantern here.',
  },
  letter: {
    title: 'Three wishes, and one promise',
    copy: '“May there always be a light in the window, and someone beside you.”',
  },
  window: {
    title: 'The world, holding its breath',
    copy: 'Blue hour. One warm window across the water.',
  },
  lamp: {
    title: 'A garden made of glass',
    copy: 'Rose glass, mended with gold. Still glowing.',
  },
};
const tableActions: Partial<Record<ObjectId, Action>> = { bun: 'bun', cake: 'cake', cup: 'cup' };
const bathActions: Partial<Record<ObjectId, Action>> = {
  develop: 'develop',
  stop: 'stop',
  fix: 'fix',
};
export function Inspection(props: Props) {
  if (props.id === 'camera')
    return (
      <PaperDialog title="The photographer’s last exposure" onClose={props.onClose}>
        <Camera {...props} />
      </PaperDialog>
    );
  if (props.id === 'projector')
    return (
      <PaperDialog title="The magic lantern" onClose={props.onClose}>
        <Lantern {...props} />
      </PaperDialog>
    );
  const story = stories[props.id];
  if (!story) return null;
  return (
    <PaperDialog title={story.title} onClose={props.onClose}>
      {props.game.room !== 0 && <DetailImage id={props.id} room={props.game.room} />}
      <p>{story.copy}</p>
      <InspectionActions {...props} />
    </PaperDialog>
  );
}
function DetailImage({ id, room }: { id: ObjectId; room: number }) {
  const portrait = usePortrait();
  const location = roomView(room, portrait);
  const spot = location.spots.find((s) => s.id === id);
  return (
    <div
      className="detail-painting"
      role="img"
      aria-label="A painted detail of the object"
      style={{
        backgroundImage: `url(${location.art})`,
        backgroundPosition: `${spot?.x ?? 50}% ${spot?.y ?? 50}%`,
      }}
    />
  );
}
function InspectionActions({ id, game, perform, onClose }: Props) {
  const table = tableActions[id];
  const bath = bathActions[id];
  if (table)
    return (
      <button className="ink-button" onClick={() => perform(table)}>
        Touch the brass seal
      </button>
    );
  if (bath)
    return (
      <>
        <button className="ink-button" disabled={!game.negative} onClick={() => perform(bath)}>
          Lower the glass plate
        </button>
        {!game.negative && <p className="quiet">Find the glass plate in the camera.</p>}
      </>
    );
  if (id === 'note')
    return (
      <button className="ink-button" onClick={() => perform('readnote')}>
        Keep the invitation in your notebook
      </button>
    );
  if (id === 'recipe')
    return (
      <button className="ink-button" onClick={() => perform('readrecipe')}>
        Copy the verse into your notebook
      </button>
    );
  return (
    <button className="ink-button" onClick={onClose}>
      Return to the room
    </button>
  );
}
function Camera({ game, perform }: Props) {
  const [focus, setFocus] = useState(6);
  const sharp = focus === 7;
  return (
    <>
      <div className="camera-finder">
        <div style={{ filter: `blur(${Math.abs(7 - focus) * 1.5}px)` }}>
          ✦ &nbsp; ✦<br />✦<br />✦<br />✦
        </div>
      </div>
      <p>
        Focus on <strong>VII (7)</strong>. Let the stars settle.
      </p>
      <label className="focus-control">
        Focus ring · {['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][focus]}
        <input
          aria-label="Camera focus ring"
          type="range"
          min="0"
          max="10"
          step="1"
          value={focus}
          onChange={(e) => setFocus(Number(e.target.value))}
        />
      </label>
      <p className="quiet" role="status">
        {sharp ? 'Sharp. The catch releases.' : 'Turn to VII (7).'}
      </p>
      <button
        className="ink-button"
        disabled={!sharp || game.negative}
        onClick={() => perform('takeplate')}
      >
        {game.negative ? 'The glass plate is in your notebook' : 'Take the glass plate'}
      </button>
    </>
  );
}
function Lantern({ game, perform }: Props) {
  if (!game.inserted)
    return (
      <>
        <DetailImage id="projector" room={2} />
        <p>A slot for your glass plate. A light waiting to wake.</p>
        <button
          className="ink-button"
          disabled={!game.plate}
          onClick={() => perform('insert', true)}
        >
          Slide in the developed plate
        </button>
      </>
    );
  return (
    <>
      <p>
        Match the stars: <strong>Horizontal II (2)</strong>, <strong>Vertical III (3)</strong>.
      </p>
      <div className="brass-dials">
        <Dial label="Horizontal" value={game.horizontal} turn={() => perform('horizontal', true)} />
        <Dial label="Vertical" value={game.vertical} turn={() => perform('vertical', true)} />
      </div>
      <button className="ink-button" onClick={() => perform('project')}>
        Release the light
      </button>
    </>
  );
}
function Dial({ label, value, turn }: { label: string; value: number; turn: () => void }) {
  return (
    <label>
      {label}
      <button
        className="brass-dial"
        aria-label={`${label} dial: ${['I', 'II', 'III', 'IV'][value]}`}
        onClick={turn}
      >
        <span>{['I', 'II', 'III', 'IV'][value]}</span>
      </button>
      <small>Turn one notch</small>
    </label>
  );
}
