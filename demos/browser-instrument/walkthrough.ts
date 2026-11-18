import type { Settings } from './audio';
type Sound = Pick<Settings, 'cutoff' | 'echo' | 'pitch'>;

/** Move the actual faders; cancellation leaves them where the presenter took over. */
export function sweepSettings(
  from: Sound,
  to: Sound,
  signal: AbortSignal,
  update: (value: Sound) => void,
) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1200;
    const start = performance.now();
    let frame = 0;
    function finish() {
      cancelAnimationFrame(frame);
      signal.removeEventListener('abort', finish);
      resolve();
    }
    function tick(now: number) {
      const progress = duration ? Math.min(1, (now - start) / duration) : 1;
      const mix = (key: keyof Sound) => from[key] + (to[key] - from[key]) * progress;
      update({
        cutoff: Math.round(mix('cutoff')),
        echo: mix('echo'),
        pitch: Math.round(mix('pitch')),
      });
      if (progress === 1) finish();
      else frame = requestAnimationFrame(tick);
    }
    signal.addEventListener('abort', finish, { once: true });
    frame = requestAnimationFrame(tick);
  });
}
