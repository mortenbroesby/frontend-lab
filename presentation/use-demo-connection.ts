import { useEffect, useEffectEvent, useState, type RefObject } from 'react';
import { isEmbedMessage, type EmbedMessage } from '@lab/demo-kit/embed-protocol';
import { usePresentationFocus } from './presentation-focus';
import { createDemoReadiness, type DemoStatus } from './demo-readiness';
import type { RemoteAction } from './remote-protocol';

/** Shared lifecycle for the TV and walkthrough frames. A retry creates a new window. */
export function useDemoConnection(
  frame: RefObject<HTMLIFrameElement | null>,
  src: string,
  onMessage: (message: EmbedMessage) => void,
  onInput: (action: RemoteAction) => boolean,
) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<DemoStatus>('loading');
  const { register, setDemoStatus, setWalkthrough } = usePresentationFocus();
  const receiveMessage = useEffectEvent(onMessage);
  const input = useEffectEvent(onInput);
  useEffect(() => {
    setWalkthrough(null);
    const source = frame.current?.contentWindow;
    const origin = new URL(src, location.href).origin;
    const lifecycle = createDemoReadiness((value) => {
      setStatus(value);
      setDemoStatus(value);
    });
    const receive = (event: MessageEvent) => {
      if (!isEmbedMessage(event, source, origin)) return;
      if (event.data.type === 'lab:demo-ready' || event.data.type === 'lab:walkthrough-state')
        lifecycle.ready();
      receiveMessage(event.data);
    };
    const unregister = register((action) => {
      if (action === 'demo-retry') {
        setAttempt((value) => value + 1);
        return true;
      }
      if (lifecycle.status !== 'ready') return true;
      return input(action);
    });
    window.addEventListener('message', receive);
    const ping = () => source?.postMessage({ type: 'lab:demo-ping' }, origin);
    ping();
    const handshake = setInterval(() => {
      if (lifecycle.status !== 'ready') ping();
    }, 500);
    return () => {
      lifecycle.dispose();
      clearInterval(handshake);
      unregister();
      window.removeEventListener('message', receive);
      setDemoStatus(null);
      setWalkthrough(null);
    };
  }, [attempt, frame, src, register, setDemoStatus, setWalkthrough]);
  return { attempt, status, retry: () => setAttempt((value) => value + 1) };
}
