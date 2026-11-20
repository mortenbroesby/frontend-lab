// Project a straight walk through a one-point-perspective room. The far doors
// are at 42% of the frame; the review rail is on the same floor as the feet.
export function hall(width: number, height: number, threshold: number) {
  const artWidth = Math.max(width, (height * 4) / 3);
  const artHeight = (artWidth * 3) / 4;
  const farSpacing = Math.min(width * 0.32, artWidth * 0.14);
  const depth = (progress: number) => progress / (1.75 - 0.75 * progress);
  const xAt = (lane: number, progress: number) =>
    width / 2 + (lane - 1) * (farSpacing + (width / 3 - farSpacing) * depth(progress));
  const yAt = (progress: number) => height * (0.42 + 0.43 * depth(progress));
  return {
    width,
    height,
    artWidth,
    artHeight,
    farSpacing,
    xAt,
    yAt,
    depth,
    zone: yAt(threshold),
    threshold,
  };
}
export type Floor = ReturnType<typeof hall>;

// Extend the two dividing lines up through the doors and down to the controls.
export function touchLane(lane: number) {
  const left = lane === 0 ? '0%' : `calc(50% + ${lane - 1.5} * var(--mb-door-spacing))`;
  const right = lane === 2 ? '100%' : `calc(50% + ${lane - 0.5} * var(--mb-door-spacing))`;
  const nearLeft = (lane / 3) * 100 + '%';
  const nearRight = ((lane + 1) / 3) * 100 + '%';
  return `polygon(${left} 0, ${right} 0, ${right} 42%, ${nearRight} 85%, ${nearRight} 100%, ${nearLeft} 100%, ${nearLeft} 85%, ${left} 42%)`;
}
