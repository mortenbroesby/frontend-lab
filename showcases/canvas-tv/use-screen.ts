import { useEffect, useRef, useState } from 'react';
import { paint, targetView } from './paint';
import type { TVState } from './navigation';

export function useScreen(state: TVState) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef(targetView(state));
  const time = useRef(0);
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext('2d');
    if (!element || !ctx) {
      setAvailable(false);
      return;
    }
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const from = view.current;
    const to = targetView(state);
    const start = performance.now();
    let previous = start;
    let animated = !motion.matches;
    let frame = 0;
    const draw = (now: number) => {
      const progress = transitionProgress(now - start, motion.matches);
      const ease = 1 - (1 - progress) ** 3;
      const mix = (a: number, b: number) => a + (b - a) * ease;
      view.current = {
        x: mix(from.x, to.x),
        y: mix(from.y, to.y),
        offsets: to.offsets.map((offset, i) => mix(from.offsets[i], offset)),
      };
      time.current += (Math.min(now - previous, 50) / 1000) * Number(animated);
      previous = now;
      paint(ctx, state, view.current, time.current);
      if (!document.hidden && (progress < 1 || animated)) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      cancelAnimationFrame(frame);
      animated = !motion.matches;
      const width = Math.max(1, Math.round(element.clientWidth * Math.min(devicePixelRatio, 2)));
      element.width = width;
      element.height = Math.round((width * 9) / 16);
      ctx.setTransform(width / 1280, 0, 0, element.height / 720, 0, 0);
      previous = performance.now();
      draw(previous);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    motion.addEventListener('change', resize);
    document.addEventListener('visibilitychange', resize);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', resize);
      document.removeEventListener('visibilitychange', resize);
    };
  }, [state]);
  return { canvas, available };
}

function transitionProgress(elapsed: number, reducedMotion: boolean) {
  return reducedMotion ? 1 : Math.min(1, elapsed / 260);
}
