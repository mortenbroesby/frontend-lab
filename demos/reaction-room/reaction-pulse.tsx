import { useEffect, useRef } from 'react';
import { reactionActivity, stepSpring } from './reaction-motion';

export function ReactionPulse({
  emoji,
  label,
  activity,
}: {
  emoji: string;
  label: string;
  activity: ReturnType<typeof reactionActivity>;
}) {
  const icon = useRef<HTMLSpanElement>(null);
  const spring = useRef({ position: 0, velocity: 0 });
  const lastRevision = useRef(-1);
  const { revision, energy, opacity, heat } = activity;
  useEffect(() => {
    const node = icon.current;
    if (!node) return;
    if (revision !== lastRevision.current && revision >= 0) {
      spring.current.velocity = Math.min(5, spring.current.velocity + 1.8 + energy * 2);
      lastRevision.current = revision;
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = performance.now();
    const animate = (now: number) => {
      if (reduced.matches) {
        node.style.setProperty('--pulse-scale', '1');
        return;
      }
      spring.current = stepSpring(spring.current, energy, (now - previous) / 1000);
      previous = now;
      node.style.setProperty('--pulse-scale', String(1 + spring.current.position));
      if (Math.abs(spring.current.velocity) + Math.abs(spring.current.position) > 0.001)
        frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [revision, energy]);
  return (
    <div
      className="reaction-pulse"
      data-emoji={emoji}
      data-heat={heat}
      aria-hidden={opacity === 0}
      style={{ opacity }}
    >
      <span className="reaction-pulse-icon" ref={icon} role="img" aria-label={label}>
        {emoji}
      </span>
      <span
        className="reaction-pulse-flame"
        aria-label={heat === 2 ? 'On fire' : 'Warming up'}
        aria-hidden={heat === 0}
      >
        🔥
      </span>
      <span className="reaction-pulse-label">{label}</span>
    </div>
  );
}
