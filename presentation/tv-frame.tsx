import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { FocusAction } from '@lab/demo-kit/focus';
import { Button } from '@lab/ui/button';
import { isEmbedMessage, type EmbedMessage } from '@lab/demo-kit/embed-protocol';
import { DemoFrame } from './demo-frame';
import { usePresentationFocus } from './presentation-focus';

export function TVFrame({ href }: { href: string }) {
  const { active, setActive, setScope, register } = usePresentationFocus();
  const frame = useRef<HTMLIFrameElement>(null);
  const returnPoint = useRef<HTMLDivElement>(null);
  const wasActive = useRef(false);
  const [ready, setReady] = useState(false);
  const url = new URL(href, location.href);
  url.searchParams.set('embed', '1');
  url.searchParams.set('presentationOrigin', location.origin);
  const origin = url.origin;

  const receiveMessage = useEffectEvent((data: EmbedMessage) => {
    if (data.type === 'lab:demo-ready') setReady(true);
    if (data.type === 'lab:demo-focus') setScope(data.scope);
    if (data.type === 'lab:demo-return') setActive(false);
  });
  useEffect(() => {
    setActive(true);
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
  }, [origin, setActive, setScope]);

  const input = useEffectEvent((action: FocusAction) => {
    if (active) {
      frame.current?.contentWindow?.postMessage({ type: 'lab:demo-input', action }, origin);
      return true;
    }
    if (action !== 'select' || !ready) return false;
    setActive(true);
    return true;
  });
  useEffect(() => register(input), [register]);

  const post = useEffectEvent((type: 'lab:demo-enter' | 'lab:demo-exit') => {
    frame.current?.contentWindow?.postMessage({ type }, origin);
  });
  const restoreFocus = useEffectEvent(() => {
    if (active) frame.current?.focus();
    else if (wasActive.current) returnPoint.current?.focus();
  });
  useEffect(() => {
    if (!ready) return;
    post(active ? 'lab:demo-enter' : 'lab:demo-exit');
    restoreFocus();
    wasActive.current = active;
  }, [active, ready, origin]);

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
      <TVFooter active={active} exit={() => setActive(false)} />
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
