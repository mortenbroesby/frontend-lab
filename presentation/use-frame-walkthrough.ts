import { walkthroughAction } from './walkthrough-navigation';
import type { RefObject } from 'react';
import { usePresentationFocus } from './presentation-focus';
import { useDemoConnection } from './use-demo-connection';

export function useFrameWalkthrough(frame: RefObject<HTMLIFrameElement | null>, src: string) {
  const { walkthrough, setWalkthrough } = usePresentationFocus();
  const origin = new URL(src, location.href).origin;
  return useDemoConnection(
    frame,
    src,
    (data) => {
      if (data.type === 'lab:walkthrough-state') setWalkthrough(data.state);
    },
    (action) => {
      if (!walkthrough) return true;
      const command = walkthroughAction(action, walkthrough);
      if (!command) return false;
      frame.current?.contentWindow?.postMessage(
        { type: 'lab:walkthrough-command', action: command },
        origin,
      );
      return true;
    },
  );
}
