import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
import {
  act,
  initialRound,
  reviewStart,
  step,
  type Action,
  type ImpactKind,
  type Round,
} from './rules';
import { playCue } from './sound';
import inspectorUrl from './duck-inspector.png';
import './style.css';

const keys: Record<string, Action | undefined> = {
  arrowleft: 'left',
  arrowright: 'right',
  d: 'scout',
  j: 'merge',
  k: 'test',
  l: 'bounce',
  e: 'extend',
};
const controls = [
  ['merge', 'J', 'Merge'],
  ['test', 'K', 'Test'],
  ['bounce', 'L', 'Bounce'],
] as const;
type Mode = 'ready' | 'running' | 'paused' | 'won' | 'lost';
const overlays = {
  ready: [
    'Sir Clacks & the duck',
    'Ship five clean PRs before the night shift ends. Three regressions close the depot.',
    'Start round',
  ],
  paused: ['Tea break', 'The duck is covering your shift. Clock paused.', 'Resume round'],
  won: [
    'Release shipped!',
    'Five clean merges. The duck has approved your promotion to Senior Knight.',
    'Play again',
  ],
  lost: ['Release blocked', undefined, 'Play again'],
};

function useBoard(field: RefObject<HTMLDivElement | null>, round: { current: Round }) {
  const [load, setLoad] = useState<'loading' | 'ready' | 'failed'>('loading');
  useEffect(() => {
    let closed = false;
    let dispose: undefined | (() => void);
    void import('./board')
      .then(({ mountBoard }) => {
        if (closed || !field.current) return;
        dispose = mountBoard(
          field.current,
          () => round.current,
          () => {
            if (!closed) setLoad('ready');
          },
        );
      })
      .catch(() => {
        if (!closed) setLoad('failed');
      });
    return () => {
      closed = true;
      dispose?.();
    };
  }, [field, round]);
  return load;
}
function useRound() {
  const [round] = useState(() => ({ current: initialRound() }));
  const [mode, setMode] = useState<Mode>('ready');
  const [, redraw] = useState(0);
  const refresh = () => redraw((n) => n + 1);
  useEffect(() => {
    if (mode !== 'running') return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (document.hidden) {
        setMode('paused');
        return;
      }
      step(round.current, (now - last) / 1000);
      last = now;
      if (round.current.status !== 'playing') setMode(round.current.status);
      refresh();
    }, 32);
    function hidden() {
      if (document.hidden) setMode('paused');
    }
    document.addEventListener('visibilitychange', hidden);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [mode, round]);
  const audio = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);
  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  function play() {
    if (typeof AudioContext !== 'undefined') {
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => {});
    }
    if (mode !== 'paused') round.current = initialRound();
    setMode('running');
  }
  const sound = muted ? null : audio.current;
  function choose(action: Action) {
    if (mode !== 'running') return;
    const previous = round.current.impact;
    act(round.current, action);
    if (previous !== round.current.impact) playCue(sound, round.current.impact);
    if (round.current.status !== 'playing') setMode(round.current.status);
    refresh();
  }
  return {
    round,
    mode,
    play,
    choose,
    muted,
    toggleSound: () => setMuted(!muted),
    pause: () => setMode('paused'),
  };
}
function CabinetHud({ round: r }: { round: Round }) {
  const t = Math.ceil(r.remaining);
  return (
    <div className="mb-hud">
      <span>
        Shipped
        <b className="mb-mail" aria-label={r.merges + ' of 5 shipped'}>
          {[1, 2, 3, 4, 5].map((slot) => (
            <i key={slot} data-lit={slot <= r.merges} aria-hidden="true">
              ✉
            </i>
          ))}
        </b>
      </span>
      <span>
        Clock
        <b>
          {Math.floor(t / 60)}:{String(t % 60).padStart(2, '0')}
        </b>
      </span>
      <span>
        Score<b className="mb-score">{r.score}</b>
      </span>
      <span>
        Strikes
        <b aria-label={r.regressions + ' of 3 strikes'}>
          {[1, 2, 3].map((slot) => (
            <i key={slot} className="mb-lamp" data-lit={slot <= r.regressions} aria-hidden="true" />
          ))}
        </b>
      </span>
    </div>
  );
}
function Overlay({
  mode,
  load,
  play,
  feedback,
}: {
  mode: Exclude<Mode, 'running'>;
  load: ReturnType<typeof useBoard>;
  play: () => void;
  feedback: string;
}) {
  const [title, description = feedback, label] = overlays[mode];
  const loading = load === 'loading';
  const text = load === 'failed' ? 'Playfield unavailable. Reload to try again.' : description;
  return (
    <div className="mb-overlay">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
        {mode === 'ready' && (
          <p>
            Tap a lane or move with ← →. At the brass gate, merge clean, bounce bugs or test a
            hunch.
          </p>
        )}
        <Button disabled={load !== 'ready'} onClick={play}>
          {loading ? 'Powering up…' : label}
        </Button>
      </div>
    </div>
  );
}
function shortcut(e: KeyboardEvent) {
  if (e.altKey || e.metaKey || e.ctrlKey) return;
  return keys[e.key.toLowerCase()];
}
function ControlBank({ active, choose }: { active: boolean; choose: (a: Action) => void }) {
  return (
    <div className="mb-controls" aria-label="Game controls">
      {controls.map(([action, key, label]) => (
        <Button
          key={action}
          variant="outline"
          disabled={!active}
          data-tool={action}
          onClick={() => choose(action)}
        >
          <kbd>{key}</kbd>
          {label}
        </Button>
      ))}
    </div>
  );
}
const duckLines: Partial<Record<ImpactKind, string>> = {
  block: 'Quack of order!',
  scout: 'Duly noted.',
};

function DuckAside({ round }: { round: Round }) {
  const impact = round.impact;
  if (!impact || round.elapsed - impact.at > 1.1) return null;
  const line = duckLines[impact.kind];
  if (!line) return null;
  return (
    <span key={impact.at} className="mb-aside" aria-hidden="true">
      {line}
    </span>
  );
}
function LaneControls({ r, choose }: { r: Round; choose: (action: Action) => void }) {
  return (
    <>
      <div className="mb-lanes">
        {[0, 1, 2].map((lane) => (
          <button
            key={lane}
            aria-label={'Move to lane ' + (lane + 1)}
            aria-pressed={r.lane === lane}
            onClick={() => {
              const direction = lane < r.lane ? 'left' : 'right';
              for (let n = Math.abs(r.lane - lane); n > 0; n--) choose(direction);
            }}
          />
        ))}
      </div>
      <div className="mb-duck-lane" style={{ left: ((r.lane + 0.5) * 100) / 3 + '%' }}>
        <button
          className="mb-duck"
          title="Duck scout (D)"
          aria-label="Send duck scout"
          disabled={!r.duckReady}
          onClick={() => choose('scout')}
        >
          <img src={inspectorUrl} width="40" height="40" alt="" draggable={false} />
        </button>
        <DuckAside round={r} />
      </div>
    </>
  );
}
function describeCard(c: Round['cards'][number]) {
  const clue = c.green ? 'build passed' : 'build failed';
  const zone = c.progress >= reviewStart ? ', in review' : '';
  return (
    [`Lane ${c.lane + 1}: ${c.title}, ${c.lines} lines`, clue, c.verdict]
      .filter(Boolean)
      .join(', ') + zone
  );
}
export default function Demo() {
  const { round, mode, play, pause, choose, muted, toggleSound } = useRound();
  const field = useRef<HTMLDivElement>(null);
  const game = useRef<HTMLElement>(null);
  const load = useBoard(field, round);
  const r = round.current;
  const active = mode === 'running';
  function keyDown(e: KeyboardEvent) {
    if (!active || e.repeat) return;
    const action = shortcut(e);
    if (action) {
      e.preventDefault();
      choose(action);
    }
  }
  function start() {
    play();
    game.current?.focus({ preventScroll: true });
    game.current?.scrollIntoView({ block: 'nearest' });
  }
  return (
    <section
      ref={game}
      className="mb-game"
      tabIndex={0}
      aria-label="Merge Bouncer game"
      onKeyDown={keyDown}
    >
      <CabinetHud round={r} />
      <div className="mb-stage">
        <div className="mb-canvas" aria-hidden="true" ref={field} />
        {mode === 'running' ? (
          <LaneControls r={r} choose={choose} />
        ) : (
          <Overlay mode={mode} load={load} play={start} feedback={r.feedback} />
        )}
      </div>
      <ControlBank active={active} choose={choose} />
      <div className="mb-status">
        <strong>Lane {r.lane + 1}</strong>
        <span role="status">{r.feedback}</span>
        {active && (
          <Button variant="outline" size="sm" onClick={pause}>
            Pause
          </Button>
        )}
      </div>
      <div className="mb-utilities">
        <button disabled={!active || r.extended} onClick={() => choose('extend')}>
          +10 sec (E)
        </button>
        <label>
          <input type="checkbox" checked={!muted} onChange={toggleSound} /> Sound
        </label>
      </div>
      <span className="sr-only">{r.cards.map(describeCard).join('. ')}</span>
    </section>
  );
}
