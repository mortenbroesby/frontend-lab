/** Ignore taps, scrolling and slow drags; one deliberate horizontal gesture moves one slide. */
export function swipeDelta(dx: number, dy: number, elapsed: number) {
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5 || elapsed > 1000) return 0;
  return dx < 0 ? 1 : -1;
}
