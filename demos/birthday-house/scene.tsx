import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createWorld } from './world';
import { roomView, type ObjectId } from './locations';
import type { Game } from './game';
import { usePortrait } from './viewport';

type Props = {
  game: Game;
  reduced: boolean;
  pan: number;
  close: boolean;
  markers: boolean;
  active: boolean;
  onPick: (id: ObjectId) => void;
  onPan: (amount: number) => void;
  onFocus: (x: number) => void;
};
export function PaintedScene(props: Props) {
  const portrait = usePortrait();
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const world = useRef<ReturnType<typeof createWorld> | null>(null);
  const live = useRef(props);
  live.current = props;
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      world.current = createWorld(
        canvas.current!,
        stage.current!,
        (id) => live.current.onPick(id),
        (delta) => live.current.onPan(delta),
        setReady,
      );
    } catch {
      setError('The room could not start. Enable WebGL, then reload this page.');
    }
    return () => {
      world.current?.dispose();
    };
  }, []);
  useEffect(() => {
    world.current?.update(props.game, props.reduced, props.pan, props.close, portrait);
  }, [props.game, props.reduced, props.pan, props.close, props.active, portrait]);
  const location = roomView(props.game.room, portrait);
  return (
    <div className="painted-viewport">
      <canvas
        ref={canvas}
        aria-label="An interactive room. Drag gently to look around, or use Tab to explore the objects."
      />
      <div
        ref={stage}
        className={`painted-stage ${props.markers ? 'show-markers' : ''} ${props.game.room === 0 ? 'breakfast-stage' : ''}`}
      >
        {props.active &&
          location.spots.map((spot) => (
            <button
              key={spot.id}
              data-object={spot.id}
              className={`room-spot ${spot.mark ? 'spot-special' : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` } as CSSProperties}
              aria-label={spot.name}
              onClick={() => props.onPick(spot.id)}
              onFocus={() => {
                const ratio = canvas.current!.clientWidth / canvas.current!.clientHeight;
                const range = Math.max(
                  0,
                  (location.width - Math.max(location.height, location.width / ratio) * ratio) / 2,
                );
                props.onFocus(
                  range
                    ? Math.min(
                        1,
                        Math.max(0, 0.5 + ((spot.x / 100 - 0.5) * location.width) / 2 / range),
                      )
                    : 0.5,
                );
              }}
            >
              <span aria-hidden="true">{spot.mark ?? '✧'}</span>
              <small>{spot.name}</small>
            </button>
          ))}
      </div>
      {!ready && !error && (
        <div className="scene-loading" aria-live="polite">
          Lighting the house…
        </div>
      )}
      {error && (
        <p className="render-error" role="alert">
          {error}
          <button onClick={() => window.location.reload()}>Reload</button>
        </p>
      )}
    </div>
  );
}
