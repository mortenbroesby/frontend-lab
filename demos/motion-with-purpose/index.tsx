import { useId, useState } from 'react';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { Button } from '@lab/ui/button';
import { Slider } from '@lab/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@lab/ui/dialog';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { posters, PosterArt, type Poster } from './posters';
import './styles.css';

export default function MotionWithPurpose() {
  const [category, setCategory] = useState('All');
  const [order, setOrder] = useState<readonly Poster[]>(posters);
  const [enabled, setEnabled] = useState(true);
  const [duration, setDuration] = useState(550);
  const reduced = useReducedMotion();
  const animate = enabled && !reduced;
  const visible = order.filter((poster) => category === 'All' || poster.category === category);
  const group = useId();
  const guide = galleryHref('/track/experimental-projects/motion');
  function reverseOrder() {
    setOrder((previous) => [...previous].reverse());
  }
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: animate ? duration / 1000 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      <LayoutGroup id={group}>
        <div className="motion-lab" data-motion={animate}>
          <header className="motion-intro">
            <div>
              <p className="eyebrow">An interactive print collection</p>
              <h2>A little change of scene.</h2>
              <p>Filter the collection. Mix it up. Open a print.</p>
            </div>
            <span className="motion-edition">
              06 PRINTS
              <br />
              IN MOTION
            </span>
          </header>
          <div className="motion-toolbar">
            <div className="motion-filters" role="group" aria-label="Filter posters">
              {['All', 'Space', 'Nature', 'Form'].map((value) => (
                <Button
                  key={value}
                  variant={category === value ? 'default' : 'ghost'}
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
            <Button variant="outline" onClick={reverseOrder}>
              Reverse order ↗
            </Button>
          </div>
          <PosterGrid visible={visible} animate={animate} />
          <MotionSettings
            animate={animate}
            reduced={Boolean(reduced)}
            duration={duration}
            count={visible.length}
            onToggle={() => setEnabled((value) => !value)}
            onDuration={setDuration}
          />
          {guide && (
            <a className="motion-guide" href={guide}>
              Explore layout, shared elements and exit animations →
            </a>
          )}
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

function PosterCard({ poster, animate }: { poster: Poster; animate: boolean }) {
  const sharedId = animate ? poster.id : undefined;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="poster-button" aria-label={`Open ${poster.title}`}>
          <motion.div
            layoutId={sharedId}
            whileHover={animate ? { y: -6, rotate: -1 } : undefined}
            whileTap={animate ? { scale: 0.97 } : undefined}
          >
            <PosterArt poster={poster} />
          </motion.div>
          <span className="poster-label">
            <strong>{poster.title}</strong>
            <span>{poster.category} ↗</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="poster-detail" data-motion={animate}>
        <motion.div layoutId={sharedId}>
          <PosterArt poster={poster} />
        </motion.div>
        <div className="poster-detail-copy">
          <DialogTitle>{poster.title}</DialogTitle>
          <DialogDescription>{poster.caption}</DialogDescription>
          <p>Original SVG artwork · {poster.category} series</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PosterGrid({ visible, animate }: { visible: readonly Poster[]; animate: boolean }) {
  return (
    <div className="poster-grid">
      <AnimatePresence initial={false} mode="popLayout">
        {visible.map((poster) => (
          <motion.div
            key={poster.id}
            layout={animate}
            initial={animate ? { opacity: 0, scale: 0.85, y: 30 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: animate ? 0.85 : 1 }}
          >
            <PosterCard poster={poster} animate={animate} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function MotionSettings({
  animate,
  reduced,
  duration,
  count,
  onToggle,
  onDuration,
}: {
  animate: boolean;
  reduced: boolean;
  duration: number;
  count: number;
  onToggle: () => void;
  onDuration: (value: number) => void;
}) {
  return (
    <footer className="motion-settings">
      <Button variant="outline" aria-pressed={animate} disabled={reduced} onClick={onToggle}>
        {animate ? 'Motion on' : 'Motion off'}
      </Button>
      <label className="motion-speed">
        Transition <span>{duration} ms</span>
        <Slider
          aria-label="Transition duration"
          min={200}
          max={1200}
          step={50}
          value={[duration]}
          onValueChange={([value]) => onDuration(value)}
          disabled={!animate}
        />
      </label>
      <p role="status">
        {reduced
          ? 'Reduced motion follows your device setting.'
          : `${count} prints · Try the same interaction with motion off.`}
      </p>
    </footer>
  );
}
