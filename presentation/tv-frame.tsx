import { useCallback, useEffect, useEffectEvent, useRef, useState, type RefObject } from 'react';
import type { FocusAction } from '@lab/demo-kit/focus';
import { Button } from '@lab/ui/button';
import { isEmbedMessage, type EmbedMessage } from '@lab/demo-kit/embed-protocol';
import { DemoFrame } from './demo-frame';
import { usePresentationFocus } from './presentation-focus';

export function TVFrame({ href, autoEnter = true }: { href: string; autoEnter?: boolean }) {
  const { active, setActive, register } = usePresentationFocus();
  const frame = useRef<HTMLIFrameElement>(null);
  const returnPoint = useRef<HTMLDivElement>(null);
  const backAllowedAt = useRef(0);
  const exit = useCallback(() => {
    // Consume the tail of a rapid Back burst after handing control to the deck.
    backAllowedAt.current = performance.now() + 400;
    setActive(false);
  }, [setActive]);
  const [ready, setReady] = useState(0);
  const url = new URL(href, location.href);
  url.searchParams.set('embed', '1');
  url.searchParams.set('presentationOrigin', location.origin);
  const origin = url.origin;

  useTVMessages(frame, origin, autoEnter, setReady, exit);

  const controlTV = useEffectEvent((action: FocusAction) => {
    if (ready) {
      frame.current?.contentWindow?.postMessage({ type: 'lab:demo-input', action }, origin);
      return;
    }
    if (action === 'back') exit();
  });
  const enterFromSlide = useEffectEvent((action: FocusAction) => {
    if (action === 'back') return performance.now() < backAllowedAt.current;
    if (action !== 'select' || !ready) return false;
    setActive(true);
    return true;
  });
  const input = useEffectEvent((action: FocusAction) => {
    if (!active) return enterFromSlide(action);
    controlTV(action);
    return true;
  });
  useEffect(() => register(input), [register]);

  useTVFocus(frame, returnPoint, active, ready, origin);

  return (
    <div
      className="tv-slide remote-slide"
      ref={returnPoint}
      tabIndex={-1}
      aria-label="TV presentation slide"
    >
      <div className="tv-handoff-stage">
        <DemoFrame
          ref={frame}
          title="Canvas TV — interactive remote navigation"
          src={url.href}
          inert={!active}
        />
        {!active && (
          <div className="tv-handoff-entry">
            <Button disabled={!ready} onClick={() => setActive(true)}>
              {ready ? 'Enter TV demo' : 'Loading TV…'}
            </Button>
          </div>
        )}
      </div>
      <TVFooter active={active} exit={exit} />
    </div>
  );
}

function TVFooter({ active, exit }: { active: boolean; exit: () => void }) {
  return (
    <div className="tv-slide-footer">
      {active ? (
        <Button variant="outline" onClick={exit}>
          Back to slides
        </Button>
      ) : (
        <span>Enter the TV to use arrow keys and the remote.</span>
      )}
      {!active && <a href="#next-directions">Continue presentation →</a>}
    </div>
  );
}

function useTVMessages(
  frame: RefObject<HTMLIFrameElement | null>,
  origin: string,
  autoEnter: boolean,
  setReady: (update: (revision: number) => number) => void,
  exit: () => void,
) {
  const { setActive, setScope } = usePresentationFocus();
  const receiveMessage = useEffectEvent((data: EmbedMessage) => {
    if (data.type === 'lab:demo-ready') setReady((revision) => revision + 1);
    if (data.type === 'lab:demo-focus') setScope(data.scope);
    if (data.type === 'lab:demo-return') exit();
  });
  useEffect(() => {
    setActive(autoEnter);
    const source = frame.current?.contentWindow;
    const receive = (event: MessageEvent) => {
      if (!isEmbedMessage(event, source, origin)) return;
      receiveMessage(event.data);
    };
    window.addEventListener('message', receive);
    return () => {
      window.removeEventListener('message', receive);
      setActive(false);
    };
  }, [frame, origin, autoEnter, setActive, setScope]);
}

function useTVFocus(
  frame: RefObject<HTMLIFrameElement | null>,
  returnPoint: RefObject<HTMLDivElement | null>,
  active: boolean,
  ready: number,
  origin: string,
) {
  const wasActive = useRef(false);
  const post = useEffectEvent((type: 'lab:demo-enter' | 'lab:demo-exit') => {
    frame.current?.contentWindow?.postMessage({ type }, origin);
  });
  const restoreFocus = useEffectEvent(() => {
    if (active) frame.current?.focus();
    else if (wasActive.current) returnPoint.current?.focus();
  });
  useEffect(() => {
    if (ready) {
      post(active ? 'lab:demo-enter' : 'lab:demo-exit');
      restoreFocus();
    } else if (!active) restoreFocus();
    wasActive.current = active;
  }, [active, ready, origin]);
}
