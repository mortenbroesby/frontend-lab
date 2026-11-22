import { tr } from './language.ts';
import { RoomAwe } from './room-awe';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { InteractionEffects, type SceneReaction } from './interaction-effects';
import { createWorld } from './world';
import { roomView, type ObjectId } from './locations';
import type { Game } from './game';
import { usePortrait } from './viewport';
import { HouseNisse } from './nisse';
import { RoomLife } from './room-life';

type Props = {
  game: Game;
  reaction: SceneReaction | null;
  onReactionEnd: (serial: number) => void;
  onFinaleReady: () => void;
  onNisse: () => void;
  onRoomReady: () => void;
  reduced: boolean;
  pan: number;
  close: boolean;
  markers: boolean;
  active: boolean;
  covered: boolean;
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
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      world.current = createWorld(
        canvas.current!,
        stage.current!,
        (id) => {
          if (live.current.active) live.current.onPick(id);
        },
        (delta) => live.current.onPan(delta),
        (value) => {
          setReady(value);
          if (value) live.current.onRoomReady();
        },
        () => live.current.onFinaleReady(),
      );
    } catch {
      setError(true);
    }
    return () => {
      world.current?.dispose();
    };
  }, []);
  useEffect(() => {
    world.current?.update(
      props.game,
      props.reduced,
      props.pan,
      props.close,
      portrait,
      props.covered,
    );
  }, [props.game, props.reduced, props.pan, props.close, props.active, portrait, props.covered]);
  const location = roomView(props.game.room, portrait);
  return (
    <div className="painted-viewport" aria-busy={!props.active}>
      <canvas
        ref={canvas}
        aria-label={tr(
          'Et rum, du kan udforske. Træk forsigtigt for at se dig omkring, eller brug Tab til at finde genstandene.',
          'Explore the room. Drag gently to look around, or use Tab to find objects.',
        )}
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
              data-route-open={spot.id === 'attic' && props.game.plate}
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
              <small>
                {spot.id === 'attic' && props.game.plate
                  ? tr('Til loftet — åbent', 'To the attic — open')
                  : spot.name}
              </small>
            </button>
          ))}
        <RoomAwe view={location} awake={props.game.revealed} />
        <RoomLife view={location} awake={props.game.revealed} />
        <HouseNisse
          key={String(props.reduced)}
          portrait={portrait}
          reduced={props.reduced}
          visible={ready}
          room={props.game.room}
          progress={
            Number(props.game.breakfast) + Number(props.game.plate) + Number(props.game.revealed)
          }
          onGreet={props.onNisse}
        />
        <InteractionEffects
          reaction={props.reaction}
          view={location}
          reduced={props.reduced}
          onFinish={props.onReactionEnd}
        />
      </div>
      <SceneStatus ready={ready} error={error} />
    </div>
  );
}

function SceneStatus({ ready, error }: { ready: boolean; error: boolean }) {
  return (
    <>
      {!ready && !error && (
        <div className="scene-loading" aria-live="polite">
          {tr('Tænder lys i huset…', 'Lighting the lamps…')}
        </div>
      )}
      {error && (
        <p className="render-error" role="alert">
          {tr(
            'Rummet kunne ikke åbnes. Slå WebGL til, og genindlæs siden.',
            'This room couldn’t open. Enable WebGL and reload the page.',
          )}
          <button onClick={() => window.location.reload()}>{tr('Genindlæs', 'Reload')}</button>
        </p>
      )}
    </>
  );
}
