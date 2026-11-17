import { Button } from '@lab/ui/button';
import { Progress } from '@lab/ui/progress';
import { useFlight } from './use-flight';
import type { Control } from './use-flight';
import type { KeyboardEvent } from 'react';
import './styles.css';

const messages = {
  loading: 'Loading the Rust engine…',
  ready: 'One small landing. Preferably in one piece.',
  flying: 'Aim for the green pad. Brake early.',
  paused: 'Flight paused. Take your time.',
  landed: 'Touchdown! The Moon thanks you for parking gently.',
  crashed: 'A slightly enthusiastic arrival. Try another approach?',
  error: 'The WebAssembly engine could not load. Reload the page to try again.',
};
const headings = {
  loading: 'Preparing flight…',
  ready: 'Easy does it.',
  flying: '',
  paused: 'Take a breather.',
  landed: 'Nice landing.',
  crashed: 'Moon: 1. You: 0.',
  error: 'Engine unavailable.',
};
const actions = {
  loading: 'Loading…',
  ready: 'Launch',
  flying: 'Pause',
  paused: 'Resume',
  landed: 'Try again',
  crashed: 'Try again',
  error: 'Unavailable',
};
const controls: { id: Control; label: string; glyph: string }[] = [
  { id: 'left', label: 'Rotate left', glyph: '↶' },
  { id: 'thrust', label: 'Thrust', glyph: '↑' },
  { id: 'right', label: 'Rotate right', glyph: '↷' },
];
const keyMap: Record<string, Control> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'thrust',
  ' ': 'thrust',
};

export default function LunarLander() {
  const game = useFlight();
  const { phase, flight } = game.view;
  const flying = phase === 'flying';
  const available = phase !== 'loading' && phase !== 'error';
  function keyboard(event: KeyboardEvent<HTMLCanvasElement>, down: boolean) {
    if ((['Alt', 'Control', 'Meta'] as const).some((key) => event.getModifierState(key))) return;
    const control = keyMap[event.key];
    if (!control) return;
    event.preventDefault();
    if (down) game.keys.current.add(control);
    else game.keys.current.delete(control);
  }
  function start() {
    game.command('start');
    game.canvas.current?.focus();
  }
  return (
    <div className="lander">
      <div className="lander-telemetry" aria-label="Flight instruments">
        <div>
          <span>Altitude</span>
          <strong>
            {Math.max(0, Math.round(492 - flight.y))}
            <small> m</small>
          </strong>
        </div>
        <div>
          <span>Descent</span>
          <strong>
            {Math.round(flight.vy)}
            <small> m/s</small>
          </strong>
        </div>
        <div>
          <span>Drift</span>
          <strong>
            {Math.round(flight.vx)}
            <small> m/s</small>
          </strong>
        </div>
        <div>
          <span>Fuel · {Math.ceil(flight.fuel)}%</span>
          <Progress aria-label="Fuel remaining" value={flight.fuel} />
        </div>
      </div>
      <div className="lander-flight-bar">
        <p role="status">{messages[phase]}</p>
        <div className="lander-actions">
          <Button disabled={!available} onClick={flying ? () => game.command('pause') : start}>
            {actions[phase]}
          </Button>
          <Button
            variant="outline"
            disabled={!available}
            onClick={() => {
              game.command('restart');
              game.canvas.current?.focus();
            }}
          >
            Restart
          </Button>
        </div>
      </div>
      <div className="lander-viewport">
        <canvas
          ref={game.canvas}
          tabIndex={0}
          aria-label="Lunar lander flight area"
          aria-describedby="lander-help"
          onKeyDown={(e) => keyboard(e, true)}
          onKeyUp={(e) => keyboard(e, false)}
          onBlur={() => game.keys.current.clear()}
        />
        {!flying && (
          <div className="lander-overlay">
            <span>MISSION / 01</span>
            <h2>{headings[phase]}</h2>
            <p>Rust physics. Your piloting.</p>
          </div>
        )}
      </div>
      <FlightControls game={game} flying={flying} />
      <p id="lander-help" className="lander-help">
        Hold ← / → to rotate and ↑ / Space to thrust, or hold the buttons. Land upright on the green
        pad: descent below 35 m/s, drift below 25 m/s. Fuel is limited. Leaving the flight area ends
        the attempt.
      </p>
      <details className="lander-about">
        <summary>Where is the Rust?</summary>
        <p>
          Every physics step runs inside WebAssembly: gravity, thrust, fuel and landing detection.
          JavaScript sends your controls to Rust, then draws the returned state on Canvas. This
          small game demonstrates the boundary; it does not need Wasm for speed.
        </p>
        <p>
          To change the physics, install <a href="https://rustup.rs/">Rust with rustup</a>, then run
          these commands from the repository root:
        </p>
        <pre>
          <code>{`rustup target add wasm32-unknown-unknown
npm run test:rust --workspace @lab/demo-lunar-lander
npm run build:wasm --workspace @lab/demo-lunar-lander`}</code>
        </pre>
        <p>
          Change <code>GRAVITY</code> or <code>THRUST</code> in{' '}
          <code>demos/lunar-lander/rust/src/lib.rs</code>, rebuild and reload. Try a heavier Moon or
          a weaker engine. The compiled binary is included, so playing does not require Rust.
        </p>
        <p>
          <a href="https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Loading_and_running">
            How browsers load WebAssembly ↗
          </a>
        </p>
      </details>
    </div>
  );
}

function FlightControls({ game, flying }: { game: ReturnType<typeof useFlight>; flying: boolean }) {
  return (
    <div className="lander-controls" aria-label="Touch flight controls">
      {controls.map(({ id, label, glyph }) => (
        <Button
          key={id}
          variant="outline"
          aria-label={label}
          disabled={!flying}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            game.touches.current.add(id);
          }}
          onPointerUp={() => game.touches.current.delete(id)}
          onPointerCancel={() => game.touches.current.delete(id)}
          onLostPointerCapture={() => game.touches.current.delete(id)}
          onKeyDown={(event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault();
              game.keys.current.add(id);
            }
          }}
          onKeyUp={() => game.keys.current.delete(id)}
          onBlur={() => game.keys.current.delete(id)}
        >
          <span className="lander-control-icon" aria-hidden="true">
            {glyph}
          </span>
          {label}
        </Button>
      ))}
    </div>
  );
}
