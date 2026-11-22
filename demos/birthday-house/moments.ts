function ease(time: number, start: number, duration: number) {
  const t = Math.min(1, Math.max(0, (time - start) / duration));
  return t * t * (3 - 2 * t);
}
export function finaleAt(time: number) {
  const warmth = ease(time, 4900, 1600);
  return {
    shade: 0.65 * ease(time, 0, 1200) * (1 - warmth),
    gather: ease(time, 900, 1800),
    travel: ease(time, 2100, 2400),
    open: ease(time, 3900, 2100),
    warmth,
    ready: time >= 6500,
  };
}
export function developmentAt(time: number) {
  return {
    rise: ease(time, 300, 2100),
    etched: time >= 2200,
    glow: ease(time, 0, 600) * (1 - ease(time, 2400, 1300)),
  };
}
