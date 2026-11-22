import { tr } from './language.ts';
import { useState, type CSSProperties } from 'react';
import nisse from './art/nisse.svg';
import './nisse.css';

const perches = {
  portrait: [
    [14, 49],
    [10, 59],
    [91, 70],
  ],
  landscape: [
    [24, 59],
    [12, 61],
    [91, 78],
  ],
} as const;

export function HouseNisse({
  portrait,
  reduced,
  visible,
  room,
  progress,
  onGreet,
}: {
  portrait: boolean;
  reduced: boolean;
  visible: boolean;
  room: number;
  progress: number;
  onGreet: () => void;
}) {
  const [greeting, setGreeting] = useState(0);
  if (!visible) return null;
  const perch = (portrait ? perches.portrait : perches.landscape)[room]!;
  return (
    <div
      className={`nisse-perch nisse-room-${room}`}
      style={{ left: `${perch[0]}%`, top: `${perch[1]}%` }}
    >
      <button
        className="house-nisse"
        aria-label={tr('Leg med nissen (valgfrit)', 'Play with the house elf (optional)')}
        title={tr(
          'Nissens koptrick — en valgfri lille leg',
          'The elf’s cup trick — an optional game',
        )}
        onClick={() => {
          setGreeting((value) => value + 1);
          onGreet();
        }}
      >
        <span className="nisse-breathe">
          <img
            key={`${greeting}-${progress}-${room}`}
            className={greeting ? 'nisse-greeting' : `nisse-celebrate nisse-chapter-${progress}`}
            src={nisse}
            alt=""
            draggable={false}
          />
        </span>
      </button>
      <span
        key={`trinket-${greeting}`}
        className={`nisse-trinket ${greeting ? 'nisse-prank' : ''}`}
        aria-hidden="true"
      >
        ✧
      </span>
      <div className="nisse-wisps" aria-hidden="true" key={`wisps-${greeting}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <i
            key={i}
            className={greeting ? 'nisse-star' : 'nisse-firefly'}
            style={{ '--wisp': i } as CSSProperties}
          >
            {greeting ? '✦' : '·'}
          </i>
        ))}
      </div>
      <span className="nisse-status" role="status">
        {greeting > 0 &&
          (reduced
            ? tr('Nissen hilser på dig.', 'The elf greets you.')
            : tr(
                'Nissen nikker og tryller med en lille messingknap.',
                'The elf nods and does a little magic with a brass button.',
              ))}
      </span>
    </div>
  );
}
