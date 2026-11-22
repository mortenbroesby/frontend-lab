import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@lab/ui/dialog';
import card from './clue-card.jpg';

type ObjectProps = {
  id: string;
  name: string;
  mark: string;
  children: ReactNode;
  onInspect?: () => void;
};
export function RoomObject({ id, name, mark, children, onInspect }: ObjectProps) {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) onInspect?.();
      }}
    >
      <DialogTrigger className={'bp-spot bp-' + id} aria-label={name}>
        <span aria-hidden="true">{mark}</span>
      </DialogTrigger>
      <DialogContent className="bp-paper">
        <DialogTitle>{name}</DialogTitle>
        <DialogDescription asChild>
          <div>{children}</div>
        </DialogDescription>
        <DialogClose className="bp-button">Back to the room</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
export function Letters({ readOrder }: { readOrder: () => void }) {
  return (
    <>
      <RoomObject id="blue" name="Blue envelope" mark="✉" onInspect={readOrder}>
        <img
          src={card}
          alt="A card showing a crescent moon, a star and a sun, from left to right."
        />
        <p>Someone pencilled a line beneath the symbols. “The order matters.”</p>
      </RoomObject>
      <RoomObject id="rose" name="Rose envelope" mark="✉">
        <blockquote>
          “I have one eye and a memory full of faces. Look through me when the room keeps a secret.”
        </blockquote>
      </RoomObject>
      <RoomObject id="gold" name="Gold envelope" mark="✉">
        <blockquote>
          “I hope you always have someone beside you when the light is this good.”
        </blockquote>
        <p>A birthday wish, signed with a little sun.</p>
      </RoomObject>
    </>
  );
}
const etchings = [
  { object: 'window', symbol: '☾', name: 'Moon', digit: 4 },
  { object: 'lamp', symbol: '★', name: 'Star', digit: 2 },
  { object: 'shutters', symbol: '☀', name: 'Sun', digit: 7 },
] as const;

export function Viewfinder({ onRead }: { onRead: () => void }) {
  const [focus, setFocus] = useState(0);
  const blur = Math.abs(7 - focus);
  const sharp = blur <= 1;
  return (
    <>
      <div className="bp-finder" aria-hidden="true">
        <div className="bp-glass" style={{ filter: 'blur(' + blur + 'px)' }}>
          {etchings.map((e) => (
            <b className={'bp-etch bp-' + e.object} key={e.name}>
              {e.symbol} {e.digit}
            </b>
          ))}
        </div>
      </div>
      <label className="bp-ring">
        Focus ring
        <input
          type="range"
          min="0"
          max="10"
          value={focus}
          onChange={(e) => {
            const value = Number(e.target.value);
            setFocus(value);
            if (Math.abs(7 - value) <= 1) onRead();
          }}
        />
      </label>
      <p aria-live="polite">
        {sharp
          ? 'The engravings come into focus. ' +
            etchings.map((e) => e.name + ' ' + e.digit).join(' · ')
          : 'Turn the focus ring until you can read the engravings.'}
      </p>
    </>
  );
}

export function Combination({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState(['0', '0', '0']);
  const [wrong, setWrong] = useState(false);
  return (
    <>
      <p>Three brass wheels hold the portrait shutters closed.</p>
      <div className="bp-wheels">
        {digits.map((digit, i) => (
          <select
            key={i}
            aria-label={'Wheel ' + (i + 1)}
            value={digit}
            onChange={(e) => {
              setDigits(digits.map((n, j) => (j === i ? e.target.value : n)));
              setWrong(false);
            }}
          >
            {Array.from({ length: 10 }, (_, n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        ))}
      </div>
      <button
        className="bp-button bp-brass"
        onClick={() => {
          if (digits.join('') === etchings.map((e) => e.digit).join('')) onUnlock();
          else setWrong(true);
        }}
      >
        Lift the latch
      </button>
      <p role="status">{wrong ? 'The latch catches. Check the numbers and their order.' : ''}</p>
    </>
  );
}
