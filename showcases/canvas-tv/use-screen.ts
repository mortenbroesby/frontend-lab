import { useEffect, useRef, useState } from 'react';
import { paint, targetView } from './paint';
import type { TVState } from './navigation';

export function useScreen(state: TVState) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef(targetView(state));
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
    let frame = 0;
    const draw = (now: number) => {
      const progress = motion.matches ? 1 : Math.min(1, (now - start) / 180);
      const ease = 1 - (1 - progress) ** 3;
      const mix = (a: number, b: number) => a + (b - a) * ease;
      view.current = {
        x: mix(from.x, to.x),
        y: mix(from.y, to.y),
        offsets: to.offsets.map((offset, i) => mix(from.offsets[i], offset)),
      };
      paint(ctx, state, view.current);
      if (progress < 1) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      cancelAnimationFrame(frame);
      const width = Math.max(1, Math.round(element.clientWidth * Math.min(devicePixelRatio, 2)));
      element.width = width;
      element.height = Math.round((width * 9) / 16);
      ctx.setTransform(width / 1280, 0, 0, element.height / 720, 0, 0);
      draw(performance.now());
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    motion.addEventListener('change', resize);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', resize);
    };
  }, [state]);
  return { canvas, available };
}
