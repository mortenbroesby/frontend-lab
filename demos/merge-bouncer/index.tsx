import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
import { act, initialRound, reviewStart, step, type Action, type Round } from './rules';
import './style.css';

const keys: Record<string, Action | undefined> = {
  arrowleft: 'left',
  arrowright: 'right',
  j: 'merge',
  k: 'test',
  l: 'bounce',
  e: 'extend',
};
const controls = [
  ['left', '←', 'Left'],
  ['right', '→', 'Right'],
  ['merge', 'J', 'Merge'],
  ['test', 'K', 'Test'],
  ['bounce', 'L', 'Bounce'],
  ['extend', 'E', '+10 sec'],
] as const;
type Mode = 'ready' | 'running' | 'paused' | 'won' | 'lost';
const overlays = {
  ready: [
    'Office Knight',
    'Guard the release gate. Read each request as it approaches. Merge five clean changes before the clock runs out.',
    'Start round',
  ],
  paused: ['Shift paused', 'The release clock is paused.', 'Resume round'],
  won: ['Release shipped!', 'Five clean merges. Your shift is complete.', 'Play again'],
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
        dispose = mountBoard(field.current, () => round.current);
        setLoad('ready');
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
    }, 80);
    function hidden() {
      if (document.hidden) setMode('paused');
    }
    document.addEventListener('visibilitychange', hidden);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [mode, round]);
  function play() {
    if (mode !== 'paused') round.current = initialRound();
    setMode('running');
  }
  function choose(action: Action) {
    if (mode !== 'running') return;
    act(round.current, action);
    if (round.current.status !== 'playing') setMode(round.current.status);
    refresh();
  }
  return { round, mode, play, choose, pause: () => setMode('paused') };
}
function CabinetHud({ round: r }: { round: Round }) {
  const t = Math.ceil(r.remaining);
  return (
    <div className="mb-hud">
      <span>
        Release clock
        <b>
          {Math.floor(t / 60)}:{String(t % 60).padStart(2, '0')}
        </b>
      </span>
      <span>
        Clean merges<b>{r.merges} / 5</b>
      </span>
      <span>
        Regressions<b>{r.regressions} / 3</b>
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
            Test a suspicious PR for a verdict. Bounce a bad one before it slips past. Three
            regressions end the shift.
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
function ControlBank({
  active,
  round: r,
  choose,
}: {
  active: boolean;
  round: Round;
  choose: (a: Action) => void;
}) {
  const disabled: Partial<Record<Action, boolean>> = { extend: r.extended };
  const used = r.extended ? 'Used' : '+10 sec';
  return (
    <div className="mb-controls" aria-label="Game controls">
      {controls.map(([action, key, label]) => (
        <Button
          key={action}
          variant="outline"
          disabled={!active || disabled[action]}
          onClick={() => choose(action)}
        >
          <kbd>{key}</kbd>
          {action === 'extend' ? used : label}
        </Button>
      ))}
    </div>
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
  const { round, mode, play, pause, choose } = useRound();
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
        {mode !== 'running' && (
          <Overlay mode={mode} load={load} play={start} feedback={r.feedback} />
        )}
      </div>
      <div className="mb-status">
        <strong>Lane {r.lane + 1}</strong>
        <span role="status">{r.feedback}</span>
        {active && (
          <Button variant="outline" size="sm" onClick={pause}>
            Pause
          </Button>
        )}
      </div>
      <ControlBank active={active} round={r} choose={choose} />
      <span className="sr-only">{r.cards.map(describeCard).join('. ')}</span>
    </section>
  );
}
