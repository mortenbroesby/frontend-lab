import type { Reaction } from './reactions.ts';

/** Recent taps add energy; the last tap keeps an icon alive for four seconds. */
export function reactionActivity(events: (Reaction & { id: number })[], now: number) {
  const latest = events.at(-1);
  const recent = events.filter((event) => now - event.at < 2000);
  const fast = recent.filter((event) => now - event.at < 1200);
  const group = recent.length >= 8 && new Set(recent.map((event) => event.sender)).size >= 3;
  const heat = group ? 2 : Number(fast.length >= 5);
  const energy = Math.min(
    1,
    events.reduce((sum, event) => sum + Math.exp(-(now - event.at) / 700), 0) / 10,
  );
  const age = now - (latest?.at ?? -Infinity);
  return {
    revision: latest?.id ?? -1,
    heat,
    energy,
    opacity: Math.max(0, Math.min(1, (4000 - age) / 1800)),
  };
}

/** A damped spring preserves velocity between taps, rather than restarting keyframes. */
export function stepSpring(
  spring: { position: number; velocity: number },
  energy: number,
  elapsed: number,
) {
  const dt = Math.max(0, Math.min(elapsed, 1 / 30));
  const stiffness = 150 + energy * 180;
  const velocity = spring.velocity + (-stiffness * spring.position - 7 * spring.velocity) * dt;
  return { position: spring.position + velocity * dt, velocity };
}
