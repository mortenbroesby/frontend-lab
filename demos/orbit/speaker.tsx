import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { Button } from '@lab/ui/button';
import { createSpeakerScene } from './speaker-scene';

export function Speaker({
  progress,
  colour,
  still,
  className = 'orbit-product',
}: {
  progress: MotionValue<number>;
  colour: string;
  still: boolean;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof createSpeakerScene> | null>(null);
  const drag = useRef<{ x: number; time: number; speed: number } | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  // Spring the object's position after mapping scroll, so the short end ranges
  // cannot amplify a smoothed progress value into a sudden launch.
  const targetY = useTransform(progress, [0, 0.24, 0.76, 1], ['200%', '0%', '0%', '200%']);
  const y = useSpring(targetY, { stiffness: 50, damping: 27, mass: 3, restDelta: 0.01 });
  const rotation = useSpring(progress, { stiffness: 55, damping: 25, mass: 2, restDelta: 0.0001 });
  const pose = still ? progress : rotation;
  useEffect(() => {
    let view: ReturnType<typeof createSpeakerScene>;
    try {
      view = createSpeakerScene(canvas.current!);
    } catch {
      setUnavailable(true);
      return;
    }
    scene.current = view;
    view.progress(pose.get());
    const unsubscribe = pose.on('change', view.progress);
    return () => {
      unsubscribe();
      view.dispose();
      scene.current = null;
    };
  }, [pose]);
  useEffect(() => {
    scene.current?.colour(colour);
  }, [colour, pose]);
  return (
    <motion.div className={className} style={{ y: still ? 0 : y }}>
      <canvas
        ref={canvas}
        className="orbit-canvas"
        tabIndex={0}
        aria-label="3D speaker. Drag horizontally to rotate. Arrow keys turn and tilt; Home resets."
        onPointerDown={(event) => {
          scene.current?.stop();
          drag.current = { x: event.clientX, time: performance.now(), speed: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          const now = performance.now();
          const delta = (event.clientX - drag.current.x) * 0.012;
          scene.current?.rotate(delta);
          drag.current = {
            x: event.clientX,
            time: now,
            speed: delta / Math.max((now - drag.current.time) / 1000, 0.008),
          };
        }}
        onPointerUp={() => {
          const last = drag.current;
          if (last && !still && performance.now() - last.time < 100)
            scene.current?.release(last.speed);
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          const directions: Record<string, [number, number]> = {
            ArrowLeft: [-0.2, 0],
            ArrowRight: [0.2, 0],
            ArrowUp: [0, -0.2],
            ArrowDown: [0, 0.2],
          };
          if (event.key === 'Home') {
            event.preventDefault();
            scene.current?.reset();
          }
          const direction = directions[event.key];
          if (direction) {
            event.preventDefault();
            scene.current?.rotate(...direction);
          }
        }}
      />
      {unavailable ? (
        <p className="orbit-object-hint">This 3D view needs WebGL. Try another browser.</p>
      ) : (
        <div className="orbit-object-hint">
          <span>Drag to turn · Scroll to explore</span>
          <Button variant="ghost" size="sm" onClick={() => scene.current?.reset()}>
            Reset angle
          </Button>
        </div>
      )}
    </motion.div>
  );
}
