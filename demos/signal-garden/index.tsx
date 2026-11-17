import { useEffect, useRef, useState } from 'react';
import { Button } from '@lab/ui/button';
import { CommandMenu } from '@lab/demo-kit/command-menu';
import { LabMark } from '@lab/demo-kit/mark';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { formations, families, type Formation } from './model';
import { Garden } from './engine';
import './garden.css';

function useMotion() {
  const [playing, setPlaying] = useState(
    () => !matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      if (query.matches) setPlaying(false);
    };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  return [playing, setPlaying] as const;
}

export default function SignalGarden() {
  const [formation, setFormation] = useState<Formation>('orbit');
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useMotion();
  const { canvas, garden, available } = useGarden(formation, selected, playing);

  return (
    <div className="garden-shell">
      <a
        className="garden-skip"
        href="#content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('content')?.focus();
        }}
      >
        Skip to artwork and controls
      </a>
      <GardenHeader />
      <main id="content" tabIndex={-1}>
        <section className="garden-intro">
          <div>
            <p className="garden-kicker">D3 + CANVAS</p>
            <h1>
              Signal <span>Garden.</span>
            </h1>
          </div>
          <p>
            Signal Garden turns 384 connected particles into an interactive artwork. Switch between
            rings, clusters and woven strands, or send a ripple through the field. Highlight a
            family to follow its connections as the shape changes. D3 calculates the movement,
            Canvas draws it, and React handles the controls. It shows how a few simple rules can
            create something expressive in the browser, using generated patterns rather than a real
            dataset.
          </p>
        </section>
        <GardenArtwork
          canvas={canvas}
          playing={playing}
          formation={formation}
          selected={selected}
          available={available}
        />
        <div className="garden-controls">
          <div role="group" aria-label="Formation" className="garden-formations">
            {formations.map((item, index) => (
              <Button
                key={item.id}
                variant={formation === item.id ? 'default' : 'ghost'}
                aria-pressed={formation === item.id}
                onClick={() => setFormation(item.id)}
              >
                <span className="garden-control-index">0{index + 1}</span>
                {item.name}
              </Button>
            ))}
          </div>
          <div className="garden-playback">
            <Button
              variant="outline"
              disabled={!available || !playing}
              onClick={() => garden.current?.burst()}
            >
              Send a ripple ↗
            </Button>
            <Button
              variant="outline"
              disabled={!available}
              aria-pressed={!playing}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? 'Pause motion' : 'Play motion'}
            </Button>
          </div>
        </div>
        <FamilyExplorer selected={selected} onSelect={setSelected} formation={formation} />
        <details className="garden-notes">
          <summary>How this is made</summary>
          <p>
            Start in <code>demos/signal-garden/model.ts</code> to invent a formation.{' '}
            <code>engine.ts</code> handles forces and lifecycle; <code>paint.ts</code> draws each
            frame.
          </p>
          <a href="https://d3js.org/d3-force">Explore D3 force simulations ↗</a>
          {galleryHref('/track/modern-web') && (
            <a href={galleryHref('/track/modern-web')}>Explore Modern Web Capabilities ↗</a>
          )}
        </details>
      </main>
    </div>
  );
}

function GardenHeader() {
  const back = galleryHref('/demos');
  return (
    <header className="garden-header">
      <a className="garden-brand" href={galleryHref('/') ?? '#content'}>
        <LabMark />
        <span>Frontend Lab</span>
      </a>
      <div>
        <CommandMenu
          links={back ? [{ label: 'All demos', group: 'Navigation', href: back }] : []}
        />
        {back && (
          <Button variant="outline" asChild>
            <a href={back}>← All demos</a>
          </Button>
        )}
      </div>
    </header>
  );
}

function FamilyExplorer({
  selected,
  onSelect,
  formation,
}: {
  selected: number | null;
  onSelect: (value: number | null) => void;
  formation: Formation;
}) {
  const family = selected === null ? null : families[selected];
  const insight = family
    ? {
        label: '64 PARTICLES / ' + family.name.toUpperCase(),
        title: family.note,
        description: family.idea,
      }
    : {
        label: 'ONE SYSTEM / MANY POSSIBILITIES',
        title: formations.find((item) => item.id === formation)!.detail,
        description:
          'Choose a family to follow its connections. The same particles and relationships remain as the world rearranges.',
      };
  return (
    <section className="garden-explorer" aria-label="Explore particle families">
      <div className="garden-family-list" role="group" aria-label="Highlight a family">
        <Button variant="ghost" aria-pressed={selected === null} onClick={() => onSelect(null)}>
          All families
        </Button>
        {families.map((item, index) => (
          <Button
            key={item.name}
            variant="ghost"
            aria-pressed={selected === index}
            onClick={() => onSelect(selected === index ? null : index)}
          >
            <span className="garden-swatch" style={{ backgroundColor: item.color }} />
            {item.name}
          </Button>
        ))}
      </div>
      <div className="garden-insight" aria-live="polite">
        <p className="garden-kicker">{insight.label}</p>
        <h2>{insight.title}</h2>
        <p>{insight.description}</p>
      </div>
    </section>
  );
}

function useGarden(formation: Formation, selected: number | null, playing: boolean) {
  const [available, setAvailable] = useState(true);
  const canvas = useRef<HTMLCanvasElement>(null);
  const garden = useRef<Garden | null>(null);
  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext('2d');
    if (!element || !ctx) {
      setAvailable(false);
      return;
    }
    const instance = new Garden(element, ctx);
    garden.current = instance;
    return () => {
      instance.dispose();
      garden.current = null;
    };
  }, []);
  useEffect(() => {
    const instance = garden.current;
    if (instance) instance.setOptions(formation, selected, playing);
  }, [formation, selected, playing]);

  return { canvas, garden, available };
}

function GardenArtwork({
  canvas,
  playing,
  formation,
  selected,
  available,
}: {
  canvas: React.RefObject<HTMLCanvasElement | null>;
  playing: boolean;
  formation: Formation;
  selected: number | null;
  available: boolean;
}) {
  const status = playing
    ? { className: 'garden-live', label: 'SYSTEM IN MOTION' }
    : { className: '', label: 'STILL STUDY' };
  return (
    <section className="garden-stage" aria-label="Interactive particle artwork">
      <div className="garden-stage-label" aria-hidden="true">
        <span className={status.className} />
        {status.label}
        <span>384 PARTICLES / 6 FAMILIES</span>
      </div>
      <canvas ref={canvas} role="img" aria-label={artworkLabel(formation, selected)} />
      {!available && (
        <p className="garden-fallback" role="status">
          Canvas is unavailable in this browser. The family descriptions below are still available.
        </p>
      )}
      <div className="garden-stage-caption">
        <span>Move your pointer to part the field. Tap to send a ripple.</span>
        <span aria-hidden="true">↗ EXPLORE THE SYSTEM</span>
      </div>
    </section>
  );
}

function artworkLabel(formation: Formation, selected: number | null) {
  const name = formations.find((item) => item.id === formation)!.name;
  const focus =
    selected === null
      ? 'six interwoven particle families'
      : families[selected].name + ' highlighted';
  return `${name} formation: ${focus}. Use the controls below to reshape the garden.`;
}
