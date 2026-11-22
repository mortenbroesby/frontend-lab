import { tr } from './language.ts';
import { StarLantern } from './star-lantern';
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
      <button
        className="paper-close"
        onClick={onClose}
        aria-label={tr('Tilbage til rummet', 'Back to the room')}
      >
        ×
      </button>
      <p className="paper-eyebrow">{tr('SE LIDT NÆRMERE', 'TAKE A CLOSER LOOK')}</p>
      <h2>{title}</h2>
      {children}
    </dialog>
  );
}
function storyFor(id: ObjectId) {
  const stories: Partial<Record<ObjectId, { title: string; copy: string }>> = {
    note: {
      title: tr('En invitation med en velkendt håndskrift', 'An invitation in a familiar hand'),
      copy: tr(
        '“Boller, så kage, så kaffe. Et lille fødselsdagsritual.” Lysene slukker ikke, hvis du prøver forkert.',
        '“Buns, then cake, then coffee. A little birthday ritual.” If you guess wrong, your lights stay lit.',
      ),
    },
    bun: {
      title: tr('Stadig lune fra ovnen', 'Still warm from the oven'),
      copy: tr(
        'Lune boller. Et lille messingsegl under tallerkenen.',
        'Warm buns. A small brass seal beneath the plate.',
      ),
    },
    cake: {
      title: tr('Et ønske, der venter', 'A wish in waiting'),
      copy: tr(
        'Et lys, et ønske og et messingsegl under kagen.',
        'A candle, a wish and a brass seal beneath the cake.',
      ),
    },
    cup: {
      title: tr('En kop, holdt varm', 'A cup kept warm'),
      copy: tr(
        'Varm kaffe. Det sidste messingsegl ligger under underkoppen.',
        'Hot coffee. The last brass seal is tucked beneath the saucer.',
      ),
    },
    cabinet: {
      title: tr('Skabet med de små lys', 'The cabinet of little lights'),
      copy: tr(
        'Tre sovende lys. Boller → kage → kaffe vækker dem.',
        'Three sleeping lights. Buns → cake → coffee will wake them.',
      ),
    },
    recipe: {
      title: tr('En opskrift på minder', 'A recipe for memories'),
      copy: tr(
        'Tre spejle låner nissens lys. Op, hen og ned — til stjernerne vågner i glaspladen.',
        'Three mirrors borrow the elf’s light. Up, across and down, until the stars wake in the glass plate.',
      ),
    },
    develop: {
      title: tr('Månebadet', 'The moon bath'),
      copy: tr(
        'Det første bad. Månen vækker sølvet.',
        'The first bath. The moon wakes the silver.',
      ),
    },
    stop: {
      title: tr('Regnbadet', 'The rain bath'),
      copy: tr(
        'Det andet bad. Regnen giver billedet ro.',
        'The second bath. The rain settles the image.',
      ),
    },
    fix: {
      title: tr('Stjernebadet', 'The star bath'),
      copy: tr(
        'Det sidste bad. Stjernen bevarer mindet.',
        'The last bath. The star keeps the memory safe.',
      ),
    },
    frame: {
      title: tr('Den sovende sol', 'The sleeping sun'),
      copy: tr(
        'En sovende sol. Ret tryllelygten herhen.',
        'A sleeping sun. Aim the magic lantern here.',
      ),
    },
    letter: {
      title: tr('Tre ønsker og ét løfte', 'Three wishes and a promise'),
      copy: tr(
        '“Må der altid være lys i vinduet og nogen ved din side.”',
        '“May there always be a light in the window and someone by your side.”',
      ),
    },
    window: {
      title: tr('Verden holder vejret', 'The world holds its breath'),
      copy: tr(
        'Den blå time. Et varmt lys i vinduet på den anden side af vandet.',
        'The blue hour. A warm light in a window across the water.',
      ),
    },
    lamp: {
      title: tr('En have af glas', 'A garden of glass'),
      copy: tr(
        'Rosenfarvet glas, repareret med guld. Lyser endnu.',
        'Rose-tinted glass mended with gold. It still glows.',
      ),
    },
  };
  return stories[id];
}
const tableActions: Partial<Record<ObjectId, Action>> = { bun: 'bun', cake: 'cake', cup: 'cup' };
export function Inspection(props: Props) {
  if (['develop', 'stop', 'fix'].includes(props.id))
    return (
      <PaperDialog
        title={tr('Nissens stjernelygte', 'The elf’s star lantern')}
        className="lantern-game"
        onClose={props.onClose}
      >
        <StarLantern game={props.game} perform={props.perform} onClose={props.onClose} />
      </PaperDialog>
    );
  if (props.id === 'camera')
    return (
      <PaperDialog
        title={tr('Fotografens sidste billede', 'The photographer’s last picture')}
        onClose={props.onClose}
      >
        <Camera {...props} />
      </PaperDialog>
    );
  if (props.id === 'projector')
    return (
      <PaperDialog title={tr('Tryllelygten', 'The magic lantern')} onClose={props.onClose}>
        <Lantern {...props} />
      </PaperDialog>
    );
  return <StoryInspection {...props} />;
}

function StoryInspection(props: Props) {
  const story = storyFor(props.id);
  if (!story) return null;
  return (
    <PaperDialog title={story.title} onClose={props.onClose}>
      {props.game.room !== 0 && <DetailImage id={props.id} room={props.game.room} />}
      <p>{story.copy}</p>
      <InspectionActions id={props.id} perform={props.perform} onClose={props.onClose} />
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
      aria-label={tr('En malet detalje af genstanden', 'A painted close-up of the object')}
      style={{
        backgroundImage: `url(${location.art})`,
        backgroundPosition: `${spot?.x ?? 50}% ${spot?.y ?? 50}%`,
      }}
    />
  );
}
function InspectionActions({ id, perform, onClose }: Pick<Props, 'id' | 'perform' | 'onClose'>) {
  const table = tableActions[id];
  if (table)
    return (
      <button className="ink-button" onClick={() => perform(table)}>
        {tr('Rør ved messingseglet', 'Touch the brass seal')}
      </button>
    );
  if (id === 'note')
    return (
      <button className="ink-button" onClick={() => perform('readnote')}>
        {tr('Gem invitationen i notesbogen', 'Save the invitation in your notebook')}
      </button>
    );
  if (id === 'recipe')
    return (
      <button className="ink-button" onClick={() => perform('readrecipe')}>
        {tr('Gem verset i notesbogen', 'Save the verse in your notebook')}
      </button>
    );
  return (
    <button className="ink-button" onClick={onClose}>
      {tr('Tilbage til rummet', 'Back to the room')}
    </button>
  );
}
function Camera({ game, perform }: Props) {
  const [focus, setFocus] = useState(6);
  const sharp = focus === 7;
  return (
    <>
      <div className={`camera-finder ${sharp ? 'is-sharp' : ''}`}>
        <div style={{ filter: `blur(${Math.abs(7 - focus) * 1.5}px)` }}>
          ✦ &nbsp; ✦<br />✦<br />✦<br />✦
        </div>
      </div>
      <p>
        {tr('Stil skarpt på', 'Focus on')} <strong>VII (7)</strong>
        {tr('. Lad stjernerne falde til ro.', '. Let the stars settle.')}
      </p>
      <FocusRing focus={focus} setFocus={setFocus} />
      <p className="quiet" role="status">
        {sharp
          ? tr('Skarpt. Låsen går op.', 'In focus. The latch opens.')
          : tr('Drej til VII (7).', 'Turn to VII (7).')}
      </p>
      <button
        className="ink-button"
        disabled={!sharp || game.negative}
        onClick={() => perform('takeplate')}
      >
        {game.negative
          ? tr('Glaspladen ligger i din notesbog', 'The glass plate is in your notebook')
          : tr('Tag glaspladen', 'Take the glass plate')}
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
          {tr(
            'En sprække til glaspladen. Et lys, der venter på at vågne.',
            'A slot for the glass plate. A light waiting to wake.',
          )}
        </p>
        <button
          className="ink-button"
          disabled={!game.plate}
          onClick={() => perform('insert', true)}
        >
          {tr('Sæt den fremkaldte plade i', 'Slide in the developed plate')}
        </button>
      </>
    );
  return (
    <>
      <p>
        {tr('Følg stjernerne:', 'Follow the stars:')}{' '}
        <strong>{tr('Vandret II (2)', 'Horizontal II (2)')}</strong>,{' '}
        <strong>{tr('Lodret III (3)', 'Vertical III (3)')}</strong>.
      </p>
      <div className="brass-dials">
        <Dial
          label={tr('Vandret', 'Horizontal')}
          value={game.horizontal}
          turn={() => perform('horizontal', true)}
        />
        <Dial
          label={tr('Lodret', 'Vertical')}
          value={game.vertical}
          turn={() => perform('vertical', true)}
        />
      </div>
      <button className="ink-button" onClick={() => perform('project')}>
        {tr('Slip lyset fri', 'Release the light')}
      </button>
    </>
  );
}
function Dial({ label, value, turn }: { label: string; value: number; turn: () => void }) {
  const [ticks, setTicks] = useState(value);
  return (
    <label>
      {label}
      <button
        className="brass-dial"
        aria-label={`${label} ${tr('drejeskive', 'dial')}: ${['I', 'II', 'III', 'IV'][value]}`}
        onClick={() => {
          setTicks((count) => count + 1);
          turn();
        }}
      >
        <i
          className="dial-hand"
          aria-hidden="true"
          style={{ transform: `rotate(${ticks * 90}deg)` }}
        />
        <span>{['I', 'II', 'III', 'IV'][value]}</span>
      </button>
      <small>{tr('Drej ét hak', 'Turn one notch')}</small>
    </label>
  );
}

function FocusRing({ focus, setFocus }: { focus: number; setFocus: (value: number) => void }) {
  return (
    <label className="focus-control">
      {tr('Fokusring ·', 'Focus ring ·')}{' '}
      {['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][focus]}
      <input
        aria-label={tr('Kameraets fokusring', 'Camera focus ring')}
        type="range"
        min="0"
        max="10"
        step="1"
        value={focus}
        onChange={(e) => setFocus(Number(e.target.value))}
      />
    </label>
  );
}
