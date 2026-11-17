import { useEffect, useRef, useState } from 'react';
import { loadEngine } from './engine';
import { paint } from './paint';
import type { Flight } from './engine';

export type Control = 'left' | 'right' | 'thrust';
type Phase = 'loading' | 'ready' | 'flying' | 'paused' | 'landed' | 'crashed' | 'error';
const blank: Flight = {
  x: 270,
  y: 110,
  vx: 16,
  vy: 0,
  angle: 0,
  fuel: 100,
  outcome: 0,
  burning: false,
};

export function useFlight() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Awaited<ReturnType<typeof loadEngine>> | null>(null);
  const keys = useRef(new Set<Control>());
  const touches = useRef(new Set<Control>());
  const phase = useRef<Phase>('loading');
  const [view, setView] = useState({ phase: 'loading' as Phase, flight: blank });

  function release() {
    keys.current.clear();
    touches.current.clear();
  }
  function command(action: 'start' | 'pause' | 'restart') {
    if (!engine.current) return;
    release();
    if (action === 'restart' || engine.current.snapshot().outcome !== 0) engine.current.reset();
    const next = { start: 'flying', pause: 'paused', restart: 'flying' } as const;
    phase.current = next[action];
    setView({ phase: phase.current, flight: engine.current.snapshot() });
  }

  useEffect(() => {
    const surface = canvas.current;
    if (!surface) return;
    const abort = new AbortController();
    const pressedKeys = keys.current;
    const pressedTouches = touches.current;
    let frame = 0;
    let last = performance.now();
    let published = 0;
    let accumulator = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    function pause() {
      pressedKeys.clear();
      pressedTouches.clear();
      if (phase.current === 'flying') phase.current = 'paused';
    }
    function advance(current: Awaited<ReturnType<typeof loadEngine>>, dt: number) {
      if (phase.current === 'flying') {
        accumulator += dt;
        const held = (key: Control) => keys.current.has(key) || touches.current.has(key);
        while (accumulator >= 1 / 120) {
          current.step(1 / 120, Number(held('right')) - Number(held('left')), held('thrust'));
          accumulator -= 1 / 120;
        }
      } else accumulator = 0;
    }
    function finish(outcome: number) {
      if (outcome) phase.current = outcome === 1 ? 'landed' : 'crashed';
    }
    const tick = (now: number) => {
      const current = engine.current;
      if (!current) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      advance(current, dt);
      const flight = current.snapshot();
      finish(flight.outcome);
      paint(
        surface,
        { ...flight, burning: flight.burning && phase.current === 'flying' },
        now,
        reduced.matches,
      );
      if (now - published > 100) {
        setView({ phase: phase.current, flight });
        published = now;
      }
      frame = requestAnimationFrame(tick);
    };
    void loadEngine(abort.signal)
      .then((loaded) => {
        if (abort.signal.aborted) return;
        engine.current = loaded;
        phase.current = 'ready';
        frame = requestAnimationFrame(tick);
      })
      .catch(() => {
        if (!abort.signal.aborted) {
          phase.current = 'error';
          setView({ phase: 'error', flight: blank });
        }
      });
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', pause);
    return () => {
      abort.abort();
      cancelAnimationFrame(frame);
      engine.current = null;
      window.removeEventListener('blur', pause);
      document.removeEventListener('visibilitychange', pause);
      pressedKeys.clear();
      pressedTouches.clear();
    };
  }, []);
  return { canvas, keys, touches, view, command };
}
