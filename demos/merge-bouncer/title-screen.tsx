import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ScreenTools } from './screen-tools';
import './title-screen.css';

type Page = 'menu' | 'settings' | 'controls';

function navigate(event: KeyboardEvent<HTMLElement>) {
  const offsets: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, w: -1, s: 1 };
  const offset = offsets[event.key];
  if (!offset || event.altKey || event.metaKey || event.ctrlKey) return;
  event.preventDefault();
  const choices = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:enabled')];
  const current = choices.indexOf(document.activeElement as HTMLButtonElement);
  choices[(current + offset + choices.length) % choices.length]?.focus();
}

type Props = {
  ready: boolean;
  failed: boolean;
  play: () => void;
  settings: React.ReactNode;
};

function useMenuFocus(page: Page, ready: boolean) {
  const start = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    if (page !== 'menu') heading.current?.focus();
    else if (opener.current) opener.current.focus();
    else if (document.activeElement === document.body) start.current?.focus();
  }, [page, ready]);

  return { start, heading, opener };
}

export function TitleScreen({ ready, failed, play, settings }: Props) {
  const [page, setPage] = useState<Page>('menu');
  const { start, heading, opener } = useMenuFocus(page, ready);
  function open(next: Page, button: HTMLButtonElement) {
    opener.current = button;
    setPage(next);
  }
  return (
    <div
      className="mb-title-screen"
      onKeyDown={(event) => {
        if (event.key === 'Escape') setPage('menu');
      }}
    >
      <div className="mb-title-tools">
        <ScreenTools />
      </div>
      <main className="mb-front">
        <h1 className="mb-logotype">
          <span>Merge</span> <strong>Bouncer</strong>
        </h1>
        <nav
          aria-label="Main menu"
          hidden={page !== 'menu'}
          className="mb-start-choices"
          onKeyDown={navigate}
        >
          <button ref={start} disabled={!ready} onClick={play}>
            {ready ? 'Start game' : 'Loading…'}
          </button>
          <button onClick={(e) => open('controls', e.currentTarget)}>How to play</button>
          <button onClick={(e) => open('settings', e.currentTarget)}>Settings</button>
        </nav>
        {failed && <p role="alert">The playfield couldn’t load. Reload to try again.</p>}
        {page !== 'menu' && (
          <section className="mb-title-page">
            <h2 tabIndex={-1} ref={heading}>
              {page === 'settings' ? 'Settings' : 'How to play'}
            </h2>
            {page === 'settings' ? (
              settings
            ) : (
              <>
                <p>
                  Merge five clean pull requests before the night shift ends. Three regressions
                  close the depot.
                </p>
                <p>
                  Move with <b>WASD</b> or tap a lane. At the brass gate, press <b>Space</b> to
                  merge, <b>N</b> to test or <b>M</b> to bounce.
                </p>
              </>
            )}
            <button onClick={() => setPage('menu')}>← Back</button>
          </section>
        )}
      </main>
    </div>
  );
}
