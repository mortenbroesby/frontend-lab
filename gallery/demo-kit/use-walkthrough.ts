import { useEffect, useEffectEvent } from 'react';
import { createWalkthrough } from './walkthrough';
import { isEmbedMessage } from './embed-protocol';

/** Opt-in only inside a presentation iframe; standalone controls remain untouched. */
export function useWalkthrough(
  labels: readonly string[],
  apply: (index: number, signal: AbortSignal) => void | Promise<void>,
  stop: () => void,
) {
  const applyStep = useEffectEvent(apply);
  const stopDemo = useEffectEvent(stop);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('presentation') !== '1' || parent === window) return;
    const origin = params.get('presentationOrigin') ?? location.origin;
    const tour = createWalkthrough(labels, applyStep, stopDemo, (state) => {
      parent.postMessage({ type: 'lab:walkthrough-state', state }, origin);
    });
    const receive = (event: MessageEvent) => {
      if (!isEmbedMessage(event, parent, origin)) return;
      if (event.data.type === 'lab:demo-enter') tour.publish();
      if (event.data.type === 'lab:walkthrough-command') tour.command(event.data.action);
    };
    const interrupt = () => tour.interrupt();
    window.addEventListener('message', receive);
    window.addEventListener('pointerdown', interrupt, true);
    window.addEventListener('keydown', interrupt, true);
    window.addEventListener('wheel', interrupt, { passive: true });
    tour.publish();
    return () => {
      window.removeEventListener('message', receive);
      window.removeEventListener('pointerdown', interrupt, true);
      window.removeEventListener('keydown', interrupt, true);
      window.removeEventListener('wheel', interrupt);
      tour.dispose();
    };
  }, [labels]);
}
