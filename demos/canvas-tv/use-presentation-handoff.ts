import { useEffect, useEffectEvent, useState, type RefObject } from 'react';
import { isEmbedMessage } from '@lab/demo-kit/embed-protocol';

function presentationOrigin() {
  if (window.parent === window) return null;
  const value = new URLSearchParams(location.search).get('presentationOrigin');
  return parseOrigin(value);
}
function parseOrigin(value: string | null) {
  try {
    const url = new URL(value ?? '');
    return ['http:', 'https:'].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
}
const origin = presentationOrigin();
export function usePresentationHandoff(
  screen: RefObject<HTMLDivElement | null>,
  stopPlayback: () => void,
) {
  const [active, setActive] = useState(false);
  const stop = useEffectEvent(stopPlayback);
  useEffect(() => {
    if (!origin) return;
    const receive = (event: MessageEvent) => {
      if (!isEmbedMessage(event, window.parent, origin)) return;
      if (event.data.type === 'lab:demo-enter') {
        setActive(true);
        screen.current?.focus();
      }
      if (event.data.type === 'lab:demo-exit') {
        setActive(false);
        stop();
      }
    };
    window.addEventListener('message', receive);
    window.parent.postMessage({ type: 'lab:demo-ready' }, origin);
    return () => window.removeEventListener('message', receive);
  }, [screen]);
  const exit = () => {
    if (!origin) return;
    stopPlayback();
    setActive(false);
    window.parent.postMessage({ type: 'lab:demo-return' }, origin);
  };
  return { enabled: Boolean(origin), active, exit };
}
