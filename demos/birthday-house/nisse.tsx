import { useState, type CSSProperties } from 'react';
import nisse from './art/nisse.svg';
import './nisse.css';

export function HouseNisse({
  portrait,
  reduced,
  visible,
}: {
  portrait: boolean;
  reduced: boolean;
  visible: boolean;
}) {
  const [greeting, setGreeting] = useState(0);
  if (!visible) return null;
  return (
    <div
      className="nisse-perch"
      style={{ left: portrait ? '14%' : '24%', top: portrait ? '49%' : '59%' }}
    >
      <button
        className="house-nisse"
        aria-label="Hils på den lille nisse"
        title="En lille husnisse"
        onClick={() => setGreeting((value) => value + 1)}
      >
        <span className="nisse-breathe">
          <img
            key={greeting}
            className={greeting ? 'nisse-greeting' : ''}
            src={nisse}
            alt=""
            draggable={false}
          />
        </span>
      </button>
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
          (reduced ? 'Nissen hilser på dig.' : 'Nissen nikker. Lidt stjernestøv slipper fri.')}
      </span>
    </div>
  );
}
