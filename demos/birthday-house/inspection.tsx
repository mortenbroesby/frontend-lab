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
    copy: '“Begin with what rises before dawn. Then touch the thing that holds a wish. End with what chases sleep away. Buns, then cake, then coffee. Three small kindnesses, and the house will let you in.”',
  },
  bun: {
    title: 'Still warm from the oven',
    copy: 'Little paper flags stand in the golden buns. Beneath the plate is a tiny brass seal, warm to the touch.',
  },
  cake: {
    title: 'A wish, waiting to be made',
    copy: 'Raspberries, cream, and candles that never seem to burn down. A small brass seal is tucked beneath the cake stand.',
  },
  cup: {
    title: 'One cup, kept warm',
    copy: 'Steam curls from the painted porcelain. You turn the saucer: another little brass seal, just like the others.',
  },
  cabinet: {
    title: 'The cabinet of little lights',
    copy: 'A sun, a moon, a star. Three amber lenses in the carved wood are connected to the breakfast table by hair-thin brass wires.',
  },
  recipe: {
    title: 'A method for remembering',
    copy: '“Moon wakes the silver. Rain stills its dreaming. A star keeps the memory, long after morning.” The numbered sketch makes it clear: 1. Moon bath, 2. Rain bath, 3. Star bath. Your progress is safe if you try the wrong tray.',
  },
  develop: {
    title: 'The moon bath',
    copy: 'An engraved crescent marks the porcelain. The dark liquid holds the faint scent of old photographs.',
  },
  stop: {
    title: 'The rain bath',
    copy: 'Three raindrops are painted inside the rim. The water is perfectly still.',
  },
  fix: {
    title: 'The star bath',
    copy: 'A little gold star on the rim. Whatever the silver remembers here, it will keep.',
  },
  frame: {
    title: 'The sleeping sun',
    copy: 'Two carved shutters fit so closely that no light escapes. A brass sun at their meeting point seems to be waiting for another sun to touch it.',
  },
  letter: {
    title: 'Three wishes, and one promise',
    copy: '“May there always be a light in the window. May ordinary mornings become your favourite memories. And may you always have someone beside you when the light is this good.”',
  },
  window: {
    title: 'The world, holding its breath',
    copy: 'The last blue of evening rests on the rooftops. Somewhere across the water, a window lights up. Tonight, this house has a secret of its own.',
  },
  lamp: {
    title: 'A garden made of glass',
    copy: 'Amber petals, rose-coloured glass. Someone has repaired the shade with a fine thread of gold. The little imperfections make it lovelier.',
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
        {!game.negative && (
          <p className="quiet">You will need a glass plate. The old camera might hold one.</p>
        )}
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
        The maker has scratched <strong>VII (7)</strong> beside the focus ring. Through the lens, a
        constellation shimmers.
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
        {sharp
          ? 'The stars stand still. A catch releases behind the camera.'
          : 'Move the ring to VII (7) to bring the stars into focus.'}
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
        <p>
          A narrow slot takes a photographic plate. Two brass wheels turn beneath the lens: one
          marked with a horizon, the other with a rising star.
        </p>
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
        The plate glows inside the lantern. Turn the wheels to match the constellations you found on
        the glass: <strong>Horizontal II (2)</strong> and <strong>Vertical III (3)</strong>.
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
