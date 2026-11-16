import { Button } from '@lab/ui/button';
import { Label } from '@lab/ui/label';
import { Slider } from '@lab/ui/slider';
import { useEffect, useState } from 'react';
import { makeWorld, stepWorld, type Point } from './world';
import './pond.css';

export default function Ecosystem() {
  const [world, setWorld] = useState(makeWorld);
  const [running, setRunning] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [speed, setSpeed] = useState(45);
  const [sight, setSight] = useState(150);
  const [cursor, setCursor] = useState<Point>({ x: 400, y: 230 });

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setWorld((current) => stepWorld(current, 0.05, speed, sight)),
      50,
    );
    return () => window.clearInterval(timer);
  }, [running, speed, sight]);

  function plant(point: Point) {
    setWorld((current) => ({ ...current, food: [...current.food, point].slice(-120) }));
  }

  return (
    <div className="pond-demo">
      <header>
        <p className="eyebrow">A few rules. A little life.</p>
        <h2>Who finds the next meal?</h2>
        <p>Plant a meal. Watch who finds it. What changes when creatures can see further?</p>
      </header>
      <div className="pond-controls">
        <Button type="button" onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Play'}
        </Button>
        <Button type="button" variant="outline" onClick={() => setWorld(makeWorld())}>
          Reset pond
        </Button>
        <div className="pond-control">
          <Label id="pond-speed-label">Speed</Label>
          <Slider
            aria-labelledby="pond-speed-label"
            min={10}
            max={100}
            value={[speed]}
            onValueChange={([value]) => setSpeed(value)}
          />
        </div>
        <div className="pond-control">
          <Label id="pond-sight-label">Sensing distance</Label>
          <Slider
            aria-labelledby="pond-sight-label"
            min={20}
            max={350}
            value={[sight]}
            onValueChange={([value]) => setSight(value)}
          />
        </div>
      </div>
      <svg
        className="pond"
        viewBox="0 0 800 460"
        role="group"
        tabIndex={0}
        aria-label="Pond: click to plant food, or use arrow keys and Enter"
        aria-describedby="pond-help"
        onClick={(event) => {
          const matrix = event.currentTarget.getScreenCTM();
          if (!matrix) return;
          const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
            matrix.inverse(),
          );
          plant({
            x: Math.max(12, Math.min(788, point.x)),
            y: Math.max(12, Math.min(448, point.y)),
          });
        }}
        onKeyDown={(event) => {
          const moves: Record<string, Point> = {
            ArrowLeft: { x: -20, y: 0 },
            ArrowRight: { x: 20, y: 0 },
            ArrowUp: { x: 0, y: -20 },
            ArrowDown: { x: 0, y: 20 },
          };
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            plant(cursor);
          }
          const move = moves[event.key];
          if (move) {
            event.preventDefault();
            setCursor((point) => ({
              x: Math.max(12, Math.min(788, point.x + move.x)),
              y: Math.max(12, Math.min(448, point.y + move.y)),
            }));
          }
        }}
      >
        <defs>
          <radialGradient id="pond-depth">
            <stop stopColor="#183e40" />
            <stop offset="1" stopColor="#081e29" />
          </radialGradient>
        </defs>
        <rect width="800" height="460" rx="20" fill="url(#pond-depth)" />
        <g aria-hidden="true">
          {world.food.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="4" fill="#e7ed9c" />
          ))}
          {world.creatures.map((creature, index) => (
            <g
              key={index}
              transform={`translate(${creature.x} ${creature.y}) rotate(${(creature.angle * 180) / Math.PI})`}
            >
              <path
                d="M -7 0 Q -20 -9 -25 0"
                fill="none"
                stroke="#80cdc1"
                strokeWidth="2"
                opacity=".6"
              />
              <ellipse rx="10" ry="6" fill={index % 2 ? '#f2b78c' : '#8ae1cb'} />
              <circle cx="5" cy="-2" r="1.5" fill="#08232a" />
              <circle cx="5" cy="2" r="1.5" fill="#08232a" />
            </g>
          ))}
          <circle
            className="pond-cursor"
            cx={cursor.x}
            cy={cursor.y}
            r="13"
            fill="none"
            stroke="white"
            strokeDasharray="3 4"
          />
        </g>
      </svg>
      <div className="pond-caption">
        <span>
          16 creatures · {world.food.length} meals available · {world.eaten} eaten
        </span>
        <Button type="button" variant="outline" onClick={() => plant(cursor)}>
          Plant at marker
        </Button>
      </div>
      <p id="pond-help">
        Click to plant food, or focus the pond, move with arrow keys and press Enter. After 120
        meals, new food replaces the oldest.
      </p>
      <details>
        <summary>Change the rules</summary>
        <p>
          In <code>demos/ecosystem/world.ts</code>, creatures seek the nearest food they sense or
          wander. Try distant food, avoiding neighbours or predators. <code>index.tsx</code> draws
          the world.
        </p>
        <p>
          A toy, not a biological model: no reproduction, starvation or food regrowth. Reset repeats
          the initial world; refresh loses changes. Reduced motion starts paused.
        </p>
      </details>
    </div>
  );
}
