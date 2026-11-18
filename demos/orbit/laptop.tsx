import { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { Button } from '@lab/ui/button';
import { createLaptopScene } from './laptop-scene';

export function Laptop({
  progress,
  colour,
  still,
}: {
  progress: MotionValue<number>;
  colour: string;
  still: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof createLaptopScene> | null>(null);
  const drag = useRef<{ x: number; time: number; speed: number } | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const y = useTransform(progress, [0, 0.14, 0.94, 1], ['90%', '0%', '0%', '160%']);
  const opacity = useTransform(progress, [0, 0.08, 0.96, 1], [0, 1, 1, 0]);
  useEffect(() => {
    let view: ReturnType<typeof createLaptopScene>;
    try {
      view = createLaptopScene(canvas.current!);
    } catch {
      setUnavailable(true);
      return;
    }
    scene.current = view;
    view.progress(progress.get());
    const unsubscribe = progress.on('change', view.progress);
    return () => {
      unsubscribe();
      view.dispose();
      scene.current = null;
    };
  }, [progress]);
  useEffect(() => {
    scene.current?.colour(colour);
  }, [colour, progress]);
  return (
    <motion.div className="orbit-product" style={{ y, opacity }}>
      <canvas
        ref={canvas}
        className="orbit-canvas"
        tabIndex={0}
        aria-label="3D laptop. Drag horizontally to rotate. Arrow keys turn and tilt; Home resets."
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
