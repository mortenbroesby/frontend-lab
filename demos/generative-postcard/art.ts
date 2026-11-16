export type Dot = { x: number; y: number; radius: number; hue: number };

// A seed makes the same composition reproducible.
export function makeDots(
  seed: number,
  count: number,
  layout: 'scatter' | 'spiral' = 'scatter',
): Dot[] {
  if (!Number.isInteger(seed) || !Number.isInteger(count) || count < 0 || count > 400) {
    throw new RangeError('Use an integer seed and 0–400 dots.');
  }
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return Array.from({ length: count }, (_, index) => {
    const x = random();
    const y = random();
    const angle = (index / count) * Math.PI * 8;
    const distance = Math.sqrt((index + 0.5) / count) * 170;
    return {
      x:
        layout === 'spiral'
          ? 320 + Math.cos(angle) * distance * 1.5 + (x - 0.5) * 16
          : 20 + x * 600,
      y: layout === 'spiral' ? 210 + Math.sin(angle) * distance + (y - 0.5) * 16 : 20 + y * 380,
      radius: 3 + random() * 22,
      hue: 150 + random() * 110,
    };
  });
}
