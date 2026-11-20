import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
import { GameHelp } from './game-help';
import { TitleScreen } from './title-screen';
import knight from './office-knight.png';
import duck from './duck-inspector.png';

export type MenuMode = 'ready' | 'paused' | 'won' | 'lost';
type Option = 'sound' | 'reduceMotion';

function useOption(name: Option, fallback: boolean) {
  const key = 'merge-bouncer.' + name;
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? fallback : stored === 'true';
    } catch {
      return fallback;
    }
  });
  function change(next: boolean) {
    setValue(next);
    try {
      localStorage.setItem(key, String(next));
    } catch {
      // Preferences still apply to the current session when storage is unavailable.
    }
  }
  return { value, change };
}

export function usePreferences() {
  return { sound: useOption('sound', true), reduceMotion: useOption('reduceMotion', false) };
}

const loadLabels = {
  loading: 'Powering up…',
  failed: 'Playfield unavailable. Reload to try again.',
};

const copy = {
  paused: ['Tea break', 'The duck is covering your shift. Clock paused.', 'Resume round'],
  won: ['Release shipped!', 'The duck has approved your promotion to Senior Knight.', 'Play again'],
  lost: ['Release blocked', '', 'Play again'],
};

type Props = {
  mode: MenuMode;
  load: 'loading' | 'ready' | 'failed';
  feedback: string;
  play: () => void;
  preferences: ReturnType<typeof usePreferences>;
  home: () => void;
};

function Options({ preferences }: { preferences: Props['preferences'] }) {
  return (
    <>
      {' '}
      <label>
        <input
          type="checkbox"
          checked={preferences.sound.value}
          onChange={(e) => preferences.sound.change(e.target.checked)}
        />{' '}
        Arcade sounds
      </label>
      <label>
        <input
          type="checkbox"
          checked={preferences.reduceMotion.value}
          onChange={(e) => preferences.reduceMotion.change(e.target.checked)}
        />{' '}
        Always reduce motion
      </label>
      <p>System reduced motion is respected automatically.</p>
    </>
  );
}

export function CabinetMenu(props: Props) {
  if (props.mode === 'ready')
    return (
      <TitleScreen
        ready={props.load === 'ready'}
        failed={props.load === 'failed'}
        play={props.play}
        settings={<Options preferences={props.preferences} />}
      />
    );
  return <ShiftMenu {...props} mode={props.mode} />;
}

type ShiftProps = Omit<Props, 'mode'> & { mode: Exclude<MenuMode, 'ready'> };
function ShiftMenu({ mode, load, feedback, play, preferences, home }: ShiftProps) {
  const [page, setPage] = useState<'Settings' | 'Help' | null>(null);
  const help = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const returning = useRef<typeof page>(null);
  useLayoutEffect(() => {
    if (page) back.current?.focus();
    else if (returning.current) (returning.current === 'Help' ? help : opener).current?.focus();
    returning.current = page;
  }, [page]);
  return (
    <div
      className="mb-menu"
      onKeyDown={(e) => {
        if (page && e.key === 'Escape') {
          e.stopPropagation();
          setPage(null);
        }
      }}
    >
      {page ? (
        <section aria-label={page} className="mb-options">
          <h2>{page}</h2>
          {page === 'Help' ? <GameHelp /> : <Options preferences={preferences} />}
          <Button ref={back} onClick={() => setPage(null)}>
            Back
          </Button>
        </section>
      ) : (
        <TitlePanel
          {...{ mode, load, feedback, play, home, opener, help }}
          openSettings={() => setPage('Settings')}
          openHelp={() => setPage('Help')}
        />
      )}
    </div>
  );
}

function TitlePanel({
  mode,
  load,
  feedback,
  play,
  home,
  opener,
  openSettings,
  help,
  openHelp,
}: Omit<ShiftProps, 'preferences'> & {
  opener: RefObject<HTMLButtonElement | null>;
  openSettings: () => void;
  help: RefObject<HTMLButtonElement | null>;
  openHelp: () => void;
}) {
  const [title, description, action] = copy[mode];
  return (
    <section className="mb-title-panel" aria-label={title}>
      <div className="mb-cast" aria-hidden="true">
        <img src={knight} alt="" />
        <img src={duck} alt="" />
      </div>
      <h2>{title}</h2>
      <p>{description || feedback}</p>

      <div className="mb-menu-actions">
        <Button autoFocus disabled={load !== 'ready'} onClick={play}>
          {load === 'ready' ? action : loadLabels[load]}
        </Button>
        <Button ref={help} variant="outline" onClick={openHelp}>
          Help
        </Button>
        <Button ref={opener} variant="outline" onClick={openSettings}>
          Settings
        </Button>
        {['won', 'lost'].includes(mode) && (
          <Button variant="outline" onClick={home}>
            Title menu
          </Button>
        )}
      </div>
    </section>
  );
}
