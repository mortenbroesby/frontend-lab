import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
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
  const [settings, setSettings] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const returning = useRef(false);
  useLayoutEffect(() => {
    if (settings) back.current?.focus();
    else if (returning.current) opener.current?.focus();
    returning.current = settings;
  }, [settings]);
  return (
    <div
      className="mb-menu"
      onKeyDown={(e) => {
        if (settings && e.key === 'Escape') {
          e.stopPropagation();
          setSettings(false);
        }
      }}
    >
      {settings ? (
        <section aria-label="Settings" className="mb-options">
          <h2>Settings</h2>
          <Options preferences={preferences} />
          <Button ref={back} onClick={() => setSettings(false)}>
            Back
          </Button>
        </section>
      ) : (
        <TitlePanel
          {...{ mode, load, feedback, play, home, opener }}
          openSettings={() => setSettings(true)}
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
}: Omit<ShiftProps, 'preferences'> & {
  opener: RefObject<HTMLButtonElement | null>;
  openSettings: () => void;
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
