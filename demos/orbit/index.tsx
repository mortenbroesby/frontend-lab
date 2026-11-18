import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { Button } from '@lab/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@lab/ui/dialog';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import './orbit.css';

const chapters = [
  ['arrival', 'Meet Orbit'],
  ['detail', 'Closer, still'],
  ['inside', 'Every layer matters'],
  ['finish', 'Find your frequency'],
] as const;
const finishes = [
  { name: 'Moonstone', shell: '#b9b6ad', glow: '#d6c6aa' },
  { name: 'Terracotta', shell: '#ba705b', glow: '#ff916b' },
  { name: 'Deep sea', shell: '#547e83', glow: '#77d7dd' },
];

function Speaker({ progress }: { progress: MotionValue<number> }) {
  // Holds line up with chapter snap points; transitions happen between them.
  const scale = useTransform(
    progress,
    [0, 0.18, 0.32, 0.42, 0.63, 0.76, 0.9, 1],
    [0.85, 0.85, 1.45, 1.45, 0.8, 0.8, 0.9, 0.6],
  );
  const rotate = useTransform(
    progress,
    [0, 0.18, 0.32, 0.42, 0.63, 0.76, 0.9, 1],
    [-18, -18, 24, 24, -12, -12, 0, -35],
  );
  const x = useTransform(
    progress,
    [0, 0.18, 0.32, 0.42, 0.63, 0.76, 0.84, 0.9, 0.96, 1],
    ['0%', '0%', '28%', '28%', '0%', '0%', '130%', '0%', '0%', '140%'],
  );
  const y = useTransform(progress, [0.9, 0.96, 1], ['0%', '0%', '-45%']);
  const opacity = useTransform(progress, [0.76, 0.82, 0.86, 0.9, 0.96, 1], [1, 0, 0, 1, 1, 0]);
  const topY = useTransform(
    progress,
    [0, 0.36, 0.52, 0.68, 0.88, 1],
    ['0%', '0%', '-25%', '-25%', '0%', '0%'],
  );
  const bottomY = useTransform(
    progress,
    [0, 0.36, 0.52, 0.68, 0.88, 1],
    ['0%', '0%', '25%', '25%', '0%', '0%'],
  );
  const coreOpacity = useTransform(progress, [0.36, 0.48, 0.72, 0.86], [0, 1, 1, 0]);
  return (
    <motion.div
      className="orbit-product"
      style={{ scale, rotate, x, y, opacity }}
      aria-hidden="true"
    >
      <div className="orbit-product-shadow" />
      <motion.div className="orbit-shell" style={{ y: bottomY }}>
        <span className="orbit-wordmark">O R B I T</span>
      </motion.div>
      <motion.div className="orbit-driver" style={{ opacity: coreOpacity }}>
        <div />
        <span />
      </motion.div>
      <motion.div className="orbit-grille" style={{ y: topY }}>
        <div className="orbit-mesh" />
        <div className="orbit-touch">
          <span>−</span>
          <i />
          <span>+</span>
        </div>
      </motion.div>
      <div className="orbit-indicator" />
    </motion.div>
  );
}

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
      body: 'A woven surface. A warm metal edge. One uninterrupted curve.',
    },
    {
      eyebrow: '02 / Open it up',
      title: (
        <>
          Small object.
          <br />
          Whole world.
        </>
      ),
      body: 'Fabric, driver, enclosure. Scroll slowly and watch the layers find their own space.',
    },
  ][index]!;
  return (
    <section className="orbit-chapter" id={chapters[index]![0]}>
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
  const story = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ['start start', 'end end'] });
  const reduced = useReducedMotion();
  const [calm, setCalm] = useState(false);

  const [finish, setFinish] = useState(finishes[0]!);
  const still = Boolean(reduced) || calm;
  const rest = useMotionValue(0.94);
  return (
    <div
      className="orbit"
      data-still={still}
      style={{ '--orbit-shell': finish.shell, '--orbit-glow': finish.glow } as CSSProperties}
    >
      <a className="orbit-skip" href="#finish">
        Skip to colour choices
      </a>
      <OrbitNav still={still} reduced={Boolean(reduced)} onToggle={() => setCalm(!calm)} />
      <main ref={story} className="orbit-story">
        <div className="orbit-stage">
          <div className="orbit-halo" />
          <div className="orbit-orbit" />
          <Speaker progress={still ? rest : scrollYProgress} />
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
              frequency.
            </h2>
            <p className="orbit-description">Same shape. A different feeling.</p>
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
        </section>
      </main>
      <OrbitFooter />
    </div>
  );
}

function OrbitNav({
  still,
  reduced,
  onToggle,
}: {
  still: boolean;
  reduced: boolean;
  onToggle: () => void;
}) {
  const [menu, setMenu] = useState(false);
  const home = galleryHref('/demos');
  return (
    <header className="orbit-nav">
      <a href="#arrival" className="orbit-logo" aria-label="Orbit, back to start">
        ◉ orbit
      </a>
      <div>
        <Button variant="ghost" onClick={onToggle} aria-pressed={still} disabled={reduced}>
          {still ? 'Still view' : 'Pause motion'}
        </Button>
        <Dialog open={menu} onOpenChange={setMenu}>
          <DialogTrigger asChild>
            <Button variant="ghost">
              Explore <span aria-hidden="true">＋</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="orbit-menu">
            <DialogTitle>Take the long way.</DialogTitle>
            <DialogDescription>Four moments. One continuous story.</DialogDescription>
            <nav aria-label="Story chapters">
              {chapters.map(([id, title], i) => (
                <a
                  className="orbit-chapter-link"
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenu(false)}
                >
                  <span className="orbit-menu-number">0{i + 1}</span>
                  {title}
                  <span className="orbit-menu-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </nav>
            {home && <a href={home}>← All Lab demos</a>}
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

function OrbitFooter() {
  const guide = galleryHref('/track/experimental-projects/motion');
  const home = galleryHref('/demos');
  return (
    <footer className="orbit-footer">
      <p>A fictional product. A real scroll experiment.</p>
      <p>Built with CSS artwork and Motion. No video. No 3D model.</p>
      <div>
        {guide && <a href={guide}>Explore the motion guide ↗</a>}
        {home && <a href={home}>Back to the Lab ↗</a>}
        <a href="https://motion.dev/docs/react-use-scroll">How scroll drives motion ↗</a>
      </div>
    </footer>
  );
}
