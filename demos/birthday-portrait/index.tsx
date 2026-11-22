import { useEffect, useRef, useState } from 'react';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { birthday } from './birthday';
import { Letters, Combination, RoomObject, Viewfinder } from './objects';
import attic from './attic.jpg';
import './style.css';

function Portrait({ replay }: { replay: () => void }) {
  const greeting = useRef<HTMLHeadingElement>(null);
  useEffect(() => greeting.current?.focus(), []);
  return (
    <main className="bp-ending">
      <div className="bp-flags" aria-label="A garland of Danish flags" role="img">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <figure className="bp-portrait">
        <img src={birthday.photo} alt={birthday.alt} />
      </figure>
      <h1 ref={greeting} tabIndex={-1} lang="da">
        {birthday.greeting}
      </h1>
      <p>{birthday.message}</p>
      <button className="bp-button" onClick={replay}>
        Play again
      </button>
    </main>
  );
}

function nextHint(order: boolean, read: boolean) {
  return !order
    ? 'Look inside the blue envelope on the desk.'
    : !read
      ? 'Try the camera by the window. Adjust its focus slowly.'
      : 'Match each symbol on the blue card to its number. Use that order on the frame.';
}

function Attic({ unlock }: { unlock: () => void }) {
  const [order, setOrder] = useState(false);
  const [read, setRead] = useState(false);
  const [hint, setHint] = useState(false);
  return (
    <main className="bp-layout">
      <div className="bp-intro">
        <h1>
          The Birthday <em>Portrait</em>
        </h1>
        <blockquote>“I left your birthday present in plain sight.”</blockquote>
        <p>
          Explore the attic. Open the letters, follow the clues and find what’s hidden behind the
          shutters.
        </p>
        <button className="bp-button" onClick={() => setHint(!hint)} aria-expanded={hint}>
          {hint ? 'Hide hint' : 'A little hint'}
        </button>
        {hint && <p role="status">{nextHint(order, read)}</p>}
      </div>
      <section className="bp-room" aria-label="Photographer’s attic">
        <img
          src={attic}
          alt="An antique camera beside a shuttered frame, with three sealed envelopes on the desk."
        />
        <Letters readOrder={() => setOrder(true)} />
        <RoomObject id="camera" name="Antique camera" mark="◎">
          <Viewfinder onRead={() => setRead(true)} />
        </RoomObject>
        <RoomObject id="frame" name="Shuttered portrait" mark="◇">
          <Combination onUnlock={unlock} />
        </RoomObject>
      </section>
    </main>
  );
}

export default function Demo() {
  const [won, setWon] = useState(false);
  const gallery = galleryHref('/track/experimental-projects/examples');
  return (
    <div className="bp-game">
      {gallery && (
        <a className="bp-gallery" href={gallery}>
          ← Gallery
        </a>
      )}
      {won ? <Portrait replay={() => setWon(false)} /> : <Attic unlock={() => setWon(true)} />}
    </div>
  );
}
