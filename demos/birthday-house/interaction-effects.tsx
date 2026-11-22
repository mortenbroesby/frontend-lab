import type { CSSProperties } from 'react';
import type { RoomView } from './locations';
import type { Reaction } from './reactions';

export type SceneReaction = Reaction & { serial: number };
export function InteractionEffects({
  reaction,
  view,
  reduced,
  onFinish,
}: {
  reaction: SceneReaction | null;
  view: RoomView;
  reduced: boolean;
  onFinish: (serial: number) => void;
}) {
  if (!reaction || reduced) return null;
  const spot = view.spots.find((s) => s.id === reaction.object);
  if (!spot) return null;
  return (
    <div
      key={reaction.serial}
      className={`interaction-fx fx-${reaction.kind}`}
      data-reaction={reaction.kind}
      aria-hidden="true"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onFinish(reaction.serial);
      }}
    >
      <span className="interaction-ring" />
      {reaction.kind !== 'touch' &&
        Array.from({ length: reaction.kind === 'complete' ? 10 : 6 }, (_, i) => (
          <i
            key={i}
            style={
              {
                '--spark-angle': `${i * 137.5}deg`,
                '--spark-distance': `${28 + (i % 3) * 13}px`,
              } as CSSProperties
            }
          >
            ✦
          </i>
        ))}
    </div>
  );
}
