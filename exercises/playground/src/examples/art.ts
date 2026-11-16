export type Dot = { x: number; y: number; radius: number; hue: number };

// A seed makes a discovery reproducible: share the number, not a screenshot alone.
export function makeDots(seed: number, count: number): Dot[] {
  if (!Number.isInteger(seed) || !Number.isInteger(count) || count < 0 || count > 400) {
    throw new RangeError('Use an integer seed and 0–400 dots.');
  }
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: 20 + random() * 600,
    y: 20 + random() * 380,
    radius: 3 + random() * 22,
    hue: 150 + random() * 110,
  }));
}
