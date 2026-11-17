import { useEffect, useRef, useState } from 'react';

/** Keep the same canvas mounted, including when native fullscreen is unavailable. */
export function useGameScreen() {
  const root = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  async function toggle() {
    if (active) {
      if (document.fullscreenElement === root.current) await document.exitFullscreen();
      setActive(false);
      return;
    }
    returnFocus.current = document.activeElement as HTMLElement;
    setActive(true);
    try {
      await root.current?.requestFullscreen();
    } catch {
      // iPhone and restricted embeds still get the viewport-filling game layout.
    }
    root.current?.querySelector('canvas')?.focus();
  }

  useEffect(() => {
    function changed() {
      setActive(document.fullscreenElement === root.current);
    }
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);

  useEffect(() => {
    if (!active || !root.current) return;
    const restoreBackground = isolateGame(root.current);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !document.fullscreenElement) setActive(false);
    }
    document.addEventListener('keydown', escape);
    return () => {
      restoreBackground();
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', escape);
      returnFocus.current?.focus();
    };
  }, [active]);

  return {
    root,
    toggle,
    label: active ? 'Exit fullscreen' : 'Fullscreen',
    className: active ? 'lander lander-game-screen' : 'lander',
  };
}

/** Hide the covered shell from keyboard navigation and assistive technology. */
function isolateGame(game: HTMLElement) {
  const previous = new Map<HTMLElement, boolean>();
  let branch: HTMLElement = game;
  while (branch.parentElement) {
    const siblings = Array.from(branch.parentElement.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== branch,
    );
    siblings.forEach((sibling) => {
      previous.set(sibling, sibling.inert);
      sibling.inert = true;
    });
    branch = branch.parentElement;
  }
  return () => previous.forEach((inert, element) => (element.inert = inert));
}
