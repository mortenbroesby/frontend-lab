import { useEffect, useState } from 'react';
import { isInteractive, moveSlide, navigationDelta } from './navigation';
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
  const move = (delta: number) => setIndex((current) => moveSlide(current, delta, slides.length));
  useEffect(() => {
    window.history.replaceState(null, '', `#${slides[index].id}`);
  }, [index]);
  useEffect(() => {
    const navigate = (event: KeyboardEvent) => {
      const delta = navigationDelta(event, isInteractive(event.target));
      if (!delta || event.defaultPrevented || event.isComposing) return;
      event.preventDefault();
      setIndex((current) => moveSlide(current, delta, slides.length));
    };
    const readHash = () => setIndex(initialSlide());
    window.addEventListener('keydown', navigate);
    window.addEventListener('hashchange', readHash);
    return () => {
      window.removeEventListener('keydown', navigate);
      window.removeEventListener('hashchange', readHash);
    };
  }, []);
  return { index, move };
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
