// Distinct poses at each story chapter; settle before the finish preview takes over.
const poses = [
  { at: 0, pitch: 0.24, yaw: -0.45, roll: -0.08 },
  { at: 1 / 3, pitch: -0.6, yaw: 0.8, roll: 0.12 },
  { at: 2 / 3, pitch: 0.85, yaw: 3.5, roll: -0.18 },
  { at: 0.86, pitch: 0.24, yaw: Math.PI * 2 - 0.45, roll: -0.08 },
];

export function scrollPose(progress: number) {
  const end = poses.findIndex((pose) => pose.at >= progress);
  const to = poses[end < 0 ? poses.length - 1 : end]!;
  const from = poses[Math.max(0, end < 0 ? poses.length - 1 : end - 1)]!;
  const span = to.at - from.at;
  const t = span ? Math.max(0, Math.min(1, (progress - from.at) / span)) : 1;
  const eased = t * t * (3 - 2 * t);
  return {
    pitch: from.pitch + (to.pitch - from.pitch) * eased,
    yaw: from.yaw + (to.yaw - from.yaw) * eased,
    roll: from.roll + (to.roll - from.roll) * eased,
  };
}
