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
      <button className="paper-close" onClick={onClose} aria-label="Tilbage til rummet">
        ×
      </button>
      <p className="paper-eyebrow">SE LIDT NÆRMERE</p>
      <h2>{title}</h2>
      {children}
    </dialog>
  );
}
const stories: Partial<Record<ObjectId, { title: string; copy: string }>> = {
  note: {
    title: 'En invitation med en velkendt håndskrift',
    copy: '“Boller, så kage, så kaffe. Et lille fødselsdagsritual.” Lysene slukker ikke, hvis du prøver forkert.',
  },
  bun: {
    title: 'Stadig lune fra ovnen',
    copy: 'Lune boller. Et lille messingsegl under tallerkenen.',
  },
  cake: {
    title: 'Et ønske, der venter',
    copy: 'Et lys, et ønske og et messingsegl under kagen.',
  },
  cup: {
    title: 'En kop, holdt varm',
    copy: 'Varm kaffe. Det sidste messingsegl ligger under underkoppen.',
  },
  cabinet: {
    title: 'Skabet med de små lys',
    copy: 'Tre sovende lys. Boller → kage → kaffe vækker dem.',
  },
  recipe: {
    title: 'En opskrift på minder',
    copy: '1. Månen vækker. 2. Regnen giver ro. 3. Stjernen gemmer. Prøv badene i den rækkefølge. Intet går tabt.',
  },
  develop: {
    title: 'Månebadet',
    copy: 'Det første bad. Månen vækker sølvet.',
  },
  stop: {
    title: 'Regnbadet',
    copy: 'Det andet bad. Regnen giver billedet ro.',
  },
  fix: {
    title: 'Stjernebadet',
    copy: 'Det sidste bad. Stjernen bevarer mindet.',
  },
  frame: {
    title: 'Den sovende sol',
    copy: 'En sovende sol. Ret tryllelygten herhen.',
  },
  letter: {
    title: 'Tre ønsker og ét løfte',
    copy: '“Må der altid være lys i vinduet og nogen ved din side.”',
  },
  window: {
    title: 'Verden holder vejret',
    copy: 'Den blå time. Et varmt lys i vinduet på den anden side af vandet.',
  },
  lamp: {
    title: 'En have af glas',
    copy: 'Rosenfarvet glas, repareret med guld. Lyser endnu.',
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
      <PaperDialog title="Fotografens sidste billede" onClose={props.onClose}>
        <Camera {...props} />
      </PaperDialog>
    );
  if (props.id === 'projector')
    return (
      <PaperDialog title="Tryllelygten" onClose={props.onClose}>
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
      aria-label="En malet detalje af genstanden"
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
        Rør ved messingseglet
      </button>
    );
  if (bath)
    return (
      <>
        <button className="ink-button" disabled={!game.negative} onClick={() => perform(bath)}>
          Sænk glaspladen
        </button>
        {!game.negative && <p className="quiet">Find glaspladen i kameraet.</p>}
      </>
    );
  if (id === 'note')
    return (
      <button className="ink-button" onClick={() => perform('readnote')}>
        Gem invitationen i notesbogen
      </button>
    );
  if (id === 'recipe')
    return (
      <button className="ink-button" onClick={() => perform('readrecipe')}>
        Gem verset i notesbogen
      </button>
    );
  return (
    <button className="ink-button" onClick={onClose}>
      Tilbage til rummet
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
        Stil skarpt på <strong>VII (7)</strong>. Lad stjernerne falde til ro.
      </p>
      <label className="focus-control">
        Fokusring · {['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][focus]}
        <input
          aria-label="Kameraets fokusring"
          type="range"
          min="0"
          max="10"
          step="1"
          value={focus}
          onChange={(e) => setFocus(Number(e.target.value))}
        />
      </label>
      <p className="quiet" role="status">
        {sharp ? 'Skarpt. Låsen går op.' : 'Drej til VII (7).'}
      </p>
      <button
        className="ink-button"
        disabled={!sharp || game.negative}
        onClick={() => perform('takeplate')}
      >
        {game.negative ? 'Glaspladen ligger i din notesbog' : 'Tag glaspladen'}
      </button>
    </>
  );
}
function Lantern({ game, perform }: Props) {
  if (!game.inserted)
    return (
      <>
        <DetailImage id="projector" room={2} />
        <p>En sprække til glaspladen. Et lys, der venter på at vågne.</p>
        <button
          className="ink-button"
          disabled={!game.plate}
          onClick={() => perform('insert', true)}
        >
          Sæt den fremkaldte plade i
        </button>
      </>
    );
  return (
    <>
      <p>
        Følg stjernerne: <strong>Vandret II (2)</strong>, <strong>Lodret III (3)</strong>.
      </p>
      <div className="brass-dials">
        <Dial label="Vandret" value={game.horizontal} turn={() => perform('horizontal', true)} />
        <Dial label="Lodret" value={game.vertical} turn={() => perform('vertical', true)} />
      </div>
      <button className="ink-button" onClick={() => perform('project')}>
        Slip lyset fri
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
        aria-label={`${label} drejeskive: ${['I', 'II', 'III', 'IV'][value]}`}
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
      <small>Drej ét hak</small>
    </label>
  );
}
