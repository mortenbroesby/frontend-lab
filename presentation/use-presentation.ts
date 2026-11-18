import { slideDelta, type FocusAction } from '@lab/demo-kit/focus';
import { usePresentationFocus } from './presentation-focus';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { isInteractive, moveSlide, navigationAction } from './navigation';
import { slides } from './slides';

function initialSlide() {
  const id = window.location.hash.slice(1);
  return Math.max(
    0,
    slides.findIndex((slide) => slide.id === id),
  );
}

export function useSlides() {
  const [index, setIndex] = useState(initialSlide);
  const focus = usePresentationFocus();
  const backAllowedAt = useRef(0);
  const move = (delta: number) => setIndex((current) => moveSlide(current, delta, slides.length));
  const exitDemo = () => {
    backAllowedAt.current = performance.now() + 400;
    move(-1);
  };
  const input = (action: FocusAction, allowPrevious = true) => {
    if (performance.now() < backAllowedAt.current) return;
    if (focus.input(action)) return;
    move(allowPrevious ? slideDelta(action) : 0);
  };
  const routeInput = useEffectEvent(input);
  useEffect(() => {
    window.history.replaceState(null, '', `#${slides[index].id}`);
  }, [index]);
  useEffect(() => {
    const navigate = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      const action = navigationAction(event, isInteractive(event.target));
      if (!action) return;
      event.preventDefault();
      routeInput(action, event.key !== 'Escape');
    };
    const readHash = () => setIndex(initialSlide());
    window.addEventListener('keydown', navigate);
    window.addEventListener('hashchange', readHash);
    return () => {
      window.removeEventListener('keydown', navigate);
      window.removeEventListener('hashchange', readHash);
    };
  }, []);
  return { index, move, input, exitDemo };
}

export function useElapsedTime() {
  const [started, setStarted] = useState(() => Date.now());
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setSeconds(Math.floor((Date.now() - started) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [started]);
  const reset = () => {
    setStarted(Date.now());
    setSeconds(0);
  };
  const formatted = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  return { formatted, reset };
}

export function useFullscreen() {
  const [active, setActive] = useState(Boolean(document.fullscreenElement));
  const [error, setError] = useState('');
  useEffect(() => {
    const update = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  const toggle = async () => {
    setError('');
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      return Boolean(document.fullscreenElement);
    } catch {
      setError('Fullscreen is unavailable here. You can still present in this window.');
      return false;
    }
  };
  return { active, error, toggle, supported: Boolean(document.fullscreenEnabled) };
}
