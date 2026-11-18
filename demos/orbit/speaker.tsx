import { useEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { Button } from '@lab/ui/button';
import { createSpeakerScene } from './speaker-scene';

export function Speaker({ progress, colour }: { progress: MotionValue<number>; colour: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<ReturnType<typeof createSpeakerScene> | null>(null);
  const drag = useRef<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const y = useTransform(progress, [0, 0.14, 0.94, 1], ['90%', '0%', '0%', '160%']);
  const opacity = useTransform(progress, [0, 0.08, 0.96, 1], [0, 1, 1, 0]);
  useEffect(() => {
    let view: ReturnType<typeof createSpeakerScene>;
    try {
      view = createSpeakerScene(canvas.current!);
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
        aria-label="3D speaker. Drag horizontally to rotate. Arrow keys turn and tilt; Home resets."
        onPointerDown={(event) => {
          drag.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          scene.current?.rotate((event.clientX - drag.current) * 0.012);
          drag.current = event.clientX;
        }}
        onPointerUp={() => {
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
