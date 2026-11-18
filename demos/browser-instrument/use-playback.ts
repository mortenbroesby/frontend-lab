import { useEffect, useRef, useState } from 'react';
import { createInstrument, type Instrument, type Settings } from './audio';

export function usePlayback(settings: Settings) {
  const current = useRef(settings);
  useEffect(() => {
    current.current = settings;
  }, [settings]);
  const active = useRef<Instrument | null>(null);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(
    () => () => {
      void active.current?.close();
      active.current = null;
    },
    [],
  );
  function stopPlayback() {
    const previous = active.current;
    active.current = null;
    void previous?.close();
    setInstrument(null);
  }
  async function startPlayback(signal?: AbortSignal) {
    if (active.current) return;
    const next = createInstrument();
    active.current = next;
    const cancel = () => {
      void next.close();
      if (active.current === next) active.current = null;
    };
    signal?.addEventListener('abort', cancel, { once: true });
    try {
      await next.start(() => current.current);
      if (active.current === next) setInstrument(next);
    } catch (error) {
      cancel();
      throw error;
    } finally {
      signal?.removeEventListener('abort', cancel);
    }
  }
  async function togglePlayback() {
    setError('');
    setBusy(true);
    try {
      if (active.current) stopPlayback();
      else await startPlayback();
    } catch {
      setError('Audio could not start. Try Play again in a browser that supports Web Audio.');
    } finally {
      setBusy(false);
    }
  }
  return { instrument, busy, error, startPlayback, stopPlayback, togglePlayback };
}
