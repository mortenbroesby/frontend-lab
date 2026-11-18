import { walkthroughAction } from './walkthrough-navigation';
import { useEffect, type RefObject } from 'react';
import { isEmbedMessage } from '@lab/demo-kit/embed-protocol';
import type { WalkthroughState } from '@lab/demo-kit/walkthrough';
import { usePresentationFocus } from './presentation-focus';
import type { RemoteAction } from './remote-protocol';

export function useFrameWalkthrough(frame: RefObject<HTMLIFrameElement | null>, src: string) {
  const { register, setWalkthrough } = usePresentationFocus();
  useEffect(() => {
    const origin = new URL(src, location.href).origin;
    const source = frame.current?.contentWindow;
    let state: WalkthroughState | null = null;
    const receive = (event: MessageEvent) => {
      if (!isEmbedMessage(event, source, origin) || event.data.type !== 'lab:walkthrough-state')
        return;
      state = event.data.state;
      setWalkthrough(state);
    };
    const unregister = register((action: RemoteAction) => {
      if (!state) return false;
      const command = walkthroughAction(action, state);
      if (!command) return false;
      source?.postMessage({ type: 'lab:walkthrough-command', action: command }, origin);
      return true;
    });
    window.addEventListener('message', receive);
    return () => {
      unregister();
      setWalkthrough(null);
      window.removeEventListener('message', receive);
    };
  }, [frame, src, register, setWalkthrough]);
  return () => {
    frame.current?.contentWindow?.postMessage(
      { type: 'lab:demo-enter' },
      new URL(src, location.href).origin,
    );
  };
}
