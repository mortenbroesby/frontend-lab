// Project a straight walk through a one-point-perspective room. The far doors
// are at 42% of the frame; the review rail is on the same floor as the feet.
export function hall(width: number, height: number, threshold: number) {
  const depth = (progress: number) => progress / (1.75 - 0.75 * progress);
  const xAt = (lane: number, progress: number) =>
    width * (0.5 + (lane - 1) * (0.14 + (1 / 3 - 0.14) * depth(progress)));
  const yAt = (progress: number) => height * (0.42 + 0.43 * depth(progress));
  return { width, height, xAt, yAt, depth, zone: yAt(threshold), threshold };
}
export type Floor = ReturnType<typeof hall>;

// Extend the two dividing lines up through the doors and down to the controls.
export function touchLane(lane: number) {
  const far = hall(100, 100, 0);
  const edge = (boundary: number, progress: number) => {
    if (boundary === 0) return 0;
    if (boundary === 3) return 100;
    return far.xAt(boundary - 0.5, progress);
  };
  const a = edge(lane, 0),
    b = edge(lane + 1, 0),
    c = edge(lane + 1, 1),
    d = edge(lane, 1);
  return `polygon(${a}% 0, ${b}% 0, ${b}% 42%, ${c}% 85%, ${c}% 100%, ${d}% 100%, ${d}% 85%, ${a}% 42%)`;
}
