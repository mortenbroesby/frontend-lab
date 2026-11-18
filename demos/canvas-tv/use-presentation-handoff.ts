import { focusKey, type FocusScope } from '@lab/demo-kit/focus';
import { useEffect, useEffectEvent, useState, type RefObject } from 'react';
import { isEmbedMessage, type EmbedMessage } from '@lab/demo-kit/embed-protocol';

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
  control: (key: string) => void,
  scope: FocusScope,
) {
  const [active, setActive] = useState(false);
  const stop = useEffectEvent(stopPlayback);
  const input = useEffectEvent((key: string) => {
    if (active) control(key);
  });
  useEffect(() => {
    if (origin && active) window.parent.postMessage({ type: 'lab:demo-focus', scope }, origin);
  }, [scope, active]);
  const focusScreen = () => screen.current?.focus();
  const receiveMessage = useEffectEvent((data: EmbedMessage) => {
    if (data.type === 'lab:demo-input') input(focusKey(data.action));
    if (data.type === 'lab:demo-enter') {
      setActive(true);
      focusScreen();
    }
    if (data.type === 'lab:demo-exit') {
      setActive(false);
      stop();
    }
  });
  useEffect(() => {
    if (!origin) return;
    const receive = (event: MessageEvent) => {
      if (isEmbedMessage(event, window.parent, origin)) receiveMessage(event.data);
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
