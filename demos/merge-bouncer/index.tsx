import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
import {
  act,
  initialRound,
  purchase,
  type Upgrade,
  reviewStart,
  step,
  type Action,
  type ImpactKind,
  type Round,
} from './rules';
import { playCue } from './sound';
import { CabinetMenu, usePreferences, type MenuMode } from './cabinet-menu';
import { UpgradeShop } from './upgrade-shop';
import { ScreenTools } from './screen-tools';
import githubMark from './github-mark.svg';
import { touchLane } from './hall';
import inspectorUrl from './duck-inspector.png';
import './style.css';

const keys: Record<string, Action | undefined> = {
  arrowleft: 'left',
  arrowright: 'right',
  a: 'left',
  d: 'right',
  w: 'forward',
  s: 'backward',
  arrowup: 'forward',
  arrowdown: 'backward',
  q: 'scout',
  ' ': 'merge',
  n: 'test',
  m: 'bounce',
  e: 'extend',
};
const controls = [
  ['merge', 'Space', 'Merge'],
  ['test', 'N', 'Test'],
  ['bounce', 'M', 'Bounce'],
] as const;
type Mode = MenuMode | 'running' | 'shop';

function useBoard(
  field: RefObject<HTMLDivElement | null>,
  round: { current: Round },
  reduceMotion: boolean,
) {
  const motion = useRef(reduceMotion);
  useEffect(() => {
    motion.current = reduceMotion;
  }, [reduceMotion]);
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
          () => motion.current,
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
function useRound(soundEnabled: boolean) {
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

  useEffect(
    () => () => {
      void audio.current?.close();
    },
    [],
  );
  function enableAudio() {
    if (soundEnabled && typeof AudioContext !== 'undefined') {
      audio.current ??= new AudioContext();
      void audio.current.resume().catch(() => {});
    }
  }
  function play() {
    enableAudio();
    if (['ready', 'lost', 'won'].includes(mode)) round.current = initialRound();
    setMode('running');
  }
  const sound = soundEnabled ? audio.current : null;
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
    home: () => setMode('ready'),
    pause: () => setMode('paused'),
    openShop: () => setMode('shop'),
    buy: (id: Upgrade) => {
      if (mode === 'shop') {
        purchase(round.current, id);
        refresh();
      }
    },
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
function shortcut(e: KeyboardEvent) {
  if ((['Alt', 'Meta', 'Control', 'Shift'] as const).some((key) => e.getModifierState(key))) return;
  const target = e.target as HTMLElement;
  const interactive =
    e.key === ' '
      ? 'button,a,input,textarea,select,[contenteditable]'
      : 'input,textarea,select,[contenteditable]';
  if (target.closest(interactive)) return;
  return keys[e.key.toLowerCase()];
}
function ControlBank({ choose }: { choose: (a: Action) => void }) {
  return (
    <div className="mb-controls" aria-label="Game controls">
      {controls.map(([action, key, label]) => (
        <Button key={action} variant="outline" data-tool={action} onClick={() => choose(action)}>
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
            style={{ clipPath: touchLane(lane) }}
            aria-label={'Move to lane ' + (lane + 1)}
            aria-pressed={r.lane === lane}
            onClick={() => {
              const direction = lane < r.lane ? 'left' : 'right';
              for (let n = Math.abs(r.lane - lane); n > 0; n--) choose(direction);
            }}
          />
        ))}
      </div>
      <div
        className="mb-duck-lane"
        style={{ bottom: r.advance * 5 + '%', left: ((r.lane + 0.5) * 100) / 3 + '%' }}
      >
        <button
          className="mb-duck"
          title="Duck scout (Q)"
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
function describeCard(c: Round['cards'][number], threshold: number) {
  const clue = c.green ? 'build passed' : 'build failed';
  const zone = c.progress >= threshold ? ', in review' : '';
  return (
    [`Lane ${c.lane + 1}: pull request #${c.id}, ${c.title}, ${c.lines} lines`, clue, c.verdict]
      .filter(Boolean)
      .join(', ') + zone
  );
}
export default function Demo() {
  const preferences = usePreferences();
  const { round, mode, play, pause, choose, home, buy, openShop } = useRound(
    preferences.sound.value,
  );
  const field = useRef<HTMLDivElement>(null);
  const game = useRef<HTMLElement>(null);
  const load = useBoard(field, round, preferences.reduceMotion.value);
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
      data-reduced={preferences.reduceMotion.value}
      data-mode={mode}
      className="mb-game"
      tabIndex={0}
      aria-label="Merge Bouncer game"
      onClick={(event) => {
        if (
          event.detail &&
          (event.target as HTMLElement).closest('[data-tool],.mb-lanes button,.mb-duck')
        )
          game.current?.focus({ preventScroll: true });
      }}
      onKeyDown={keyDown}
    >
      {mode !== 'ready' && (
        <div className="mb-repo">
          <img src={githubMark} alt="GitHub" width="20" height="20" />
          <span className="mb-repo-name">
            sir-clacks / <strong>mailroom</strong>
          </span>
          <CabinetHud round={r} />
          <ScreenTools />
        </div>
      )}
      <div className="mb-stage">
        <div className="mb-canvas" aria-hidden="true" ref={field} />
        {mode === 'running' ? (
          <LaneControls r={r} choose={choose} />
        ) : mode === 'shop' ? (
          <UpgradeShop round={r} buy={buy} resume={start} />
        ) : (
          <CabinetMenu
            key={mode}
            mode={mode}
            load={load}
            play={start}
            feedback={r.feedback}
            home={home}
            preferences={preferences}
          />
        )}
      </div>
      {active && (
        <>
          <div className="mb-dock">
            <ControlBank choose={choose} />
            <div className="mb-status">
              <strong>Lane {r.lane + 1}</strong>
              <span role="status">{r.feedback}</span>
              <Button variant="outline" size="sm" onClick={pause}>
                Pause
              </Button>
            </div>
            <div className="mb-utilities">
              <button className="mb-shop-trigger" onClick={openShop}>
                Upgrades · {r.storyPoints} SP
              </button>
              <button disabled={r.extended} onClick={() => choose('extend')}>
                +10 sec (E)
              </button>
            </div>
          </div>
          <span className="sr-only">
            {r.cards.map((c) => describeCard(c, reviewStart(r))).join('. ')}
          </span>
        </>
      )}
    </section>
  );
}
