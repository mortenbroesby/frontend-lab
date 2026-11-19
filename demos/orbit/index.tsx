import { useWalkthrough } from '@lab/demo-kit/use-walkthrough';
import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useScroll, useReducedMotion, useMotionValue } from 'motion/react';
import { FinishControls } from './finish-controls';
import { finishAt } from './finishes';
import { Speaker } from './speaker';
import { Button } from '@lab/ui/button';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import './orbit.css';

const walkthroughLabels = ['Arrival', 'Detail', 'Turn the object', 'Choose a finish'];
const chapterIds = ['arrival', 'detail', 'inside'] as const;

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
      body: 'Scroll a little further. The speaker tilts so you can see its shape and surface.',
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

  const [colour, setColour] = useState(0);
  const finish = finishAt(colour);
  const still = Boolean(reduced);
  const rest = useMotionValue(1);
  useWalkthrough(
    walkthroughLabels,
    (index, signal) => {
      const id = [...chapterIds, 'finish'][index]!;
      document.getElementById(id)?.scrollIntoView({ behavior: still ? 'instant' : 'smooth' });
      setColour(index === 3 ? 20 : 0);
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
      style={{ '--orbit-shell': finish.shell, '--orbit-glow': finish.shell } as CSSProperties}
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
      <nav className="orbit-tour" aria-label="Speaker tour">
        <a href="#arrival">01 · Meet Orbit</a>
        <a href="#detail">02 · Tilt</a>
        <a href="#inside">03 · Turn</a>
        <a href="#finish">04 · Colour</a>
      </nav>
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
              Blend your own colour. Drag the speaker sideways to see it from another angle.
            </p>
            <FinishControls value={colour} onChange={setColour} />
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
