import { useWalkthrough } from '@lab/demo-kit/use-walkthrough';
import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useScroll, useReducedMotion, useMotionValue } from 'motion/react';
import { Speaker } from './speaker';
import { Button } from '@lab/ui/button';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import './orbit.css';

const walkthroughLabels = ['Arrival', 'Detail', 'Turn the object', 'Choose a finish'];
const chapterIds = ['arrival', 'detail', 'inside'] as const;
const finishes = [
  { name: 'Moonstone', shell: '#b9b6ad', glow: '#d6c6aa' },
  { name: 'Terracotta', shell: '#ba705b', glow: '#ff916b' },
  { name: 'Deep sea', shell: '#547e83', glow: '#77d7dd' },
];

function Chapter({ index }: { index: number }) {
  const content = [
    {
      eyebrow: 'A little less noise.',
      title: (
        <>
          More room
          <br />
          for sound.
        </>
      ),
      body: 'Meet Orbit. An imagined speaker with a softer presence.',
    },
    {
      eyebrow: '01 / A quieter kind of design',
      title: (
        <>
          Nothing extra.
          <br />
          Everything felt.
        </>
      ),
      body: 'A fine metal grille. A satin shell. Sound, without the noise.',
    },
    {
      eyebrow: '02 / A different angle',
      title: (
        <>
          A new angle.
          <br />
          Same Orbit.
        </>
      ),
      body: 'Scroll to tilt, turn and see the other side. Keep going to choose a finish and turn it yourself.',
    },
  ][index]!;
  return (
    <section className="orbit-chapter" id={chapterIds[index]}>
      <div className="orbit-copy">
        <p className="orbit-eyebrow">{content.eyebrow}</p>
        {index === 0 ? <h1>{content.title}</h1> : <h2>{content.title}</h2>}
        <p className="orbit-description">{content.body}</p>
        {index === 0 && (
          <a className="orbit-scroll" href="#detail">
            Scroll to discover <span aria-hidden="true">↓</span>
          </a>
        )}
      </div>
    </section>
  );
}

export default function Orbit() {
  const presentation = new URLSearchParams(location.search).get('presentation') === '1';
  const gallery = galleryHref('/');
  const story = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ['start start', 'end end'] });
  const reduced = useReducedMotion();

  const [finish, setFinish] = useState(finishes[0]!);
  const still = Boolean(reduced);
  const rest = useMotionValue(1);
  useWalkthrough(
    walkthroughLabels,
    (index, signal) => {
      const id = [...chapterIds, 'finish'][index]!;
      document.getElementById(id)?.scrollIntoView({ behavior: still ? 'instant' : 'smooth' });
      setFinish(finishes[index === 3 ? 1 : 0]!);
      signal.addEventListener(
        'abort',
        () => window.scrollTo({ top: window.scrollY, behavior: 'instant' }),
        { once: true },
      );
    },
    () => window.scrollTo({ top: window.scrollY, behavior: 'instant' }),
  );
  return (
    <div
      className="orbit"
      data-still={still}
      data-presentation={presentation}
      style={{ '--orbit-shell': finish.shell, '--orbit-glow': finish.glow } as CSSProperties}
    >
      <a className="orbit-skip" href="#finish">
        Skip to colour choices
      </a>
      <header className="orbit-nav">
        <a href="#arrival" className="orbit-logo" aria-label="Orbit, back to start">
          ◉ orbit
        </a>
        {gallery && (
          <Button asChild variant="ghost">
            <a href={gallery}>← Back to the Lab</a>
          </Button>
        )}
      </header>
      <main ref={story} className="orbit-story">
        <div className="orbit-stage">
          <div className="orbit-halo" />
          <div className="orbit-orbit" />
          <Speaker
            progress={still ? rest : scrollYProgress}
            still={still}
            colour={finish.shell}
            interactive={false}
          />
          <span className="orbit-stage-caption">ORBIT / OBJECT STUDY Nº 01</span>
        </div>
        {[0, 1, 2].map((index) => (
          <Chapter key={index} index={index} />
        ))}
        <section className="orbit-chapter orbit-finish" id="finish">
          <div className="orbit-copy">
            <p className="orbit-eyebrow">03 / Make it yours</p>
            <h2>
              Find your
              <br />
              finish.
            </h2>
            <p className="orbit-description">
              Choose a colour, then drag the speaker sideways to explore it.
            </p>
            <div className="orbit-finishes" role="group" aria-label="Speaker colour">
              {finishes.map((colour) => (
                <Button
                  key={colour.name}
                  className="orbit-finish-button"
                  variant="outline"
                  aria-pressed={finish.name === colour.name}
                  onClick={() => setFinish(colour)}
                  style={{ '--swatch': colour.shell } as CSSProperties}
                >
                  <span className="orbit-swatch" aria-hidden="true" />
                  {colour.name}
                </Button>
              ))}
            </div>
            <p className="orbit-selected" aria-live="polite">
              {finish.name} edition
            </p>
            <a href="#arrival" className="orbit-replay">
              Experience it again <span aria-hidden="true">↗</span>
            </a>
          </div>
          <Speaker
            className="orbit-finish-preview"
            progress={rest}
            still
            spotlight={!still}
            colour={finish.shell}
          />
        </section>
      </main>
      <OrbitFooter />
    </div>
  );
}

function OrbitFooter() {
  const guide = galleryHref('/track/experimental-projects/motion');
  const home = galleryHref('/demos');
  return (
    <footer className="orbit-footer">
      <p>A fictional product. A real scroll experiment.</p>
      <p>A real-time 3D model, built with Three.js and Motion.</p>
      <div>
        {guide && <a href={guide}>Explore the motion guide ↗</a>}
        {home && <a href={home}>Back to the Lab ↗</a>}
        <a href="https://motion.dev/docs/react-use-scroll">How scroll drives motion ↗</a>
      </div>
    </footer>
  );
}
