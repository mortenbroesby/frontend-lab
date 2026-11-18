import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { FocusAction } from '@lab/demo-kit/focus';
import { isEmbedMessage, type EmbedMessage } from '@lab/demo-kit/embed-protocol';
import { DemoFrame } from './demo-frame';
import { usePresentationFocus } from './presentation-focus';

export function TVFrame({ href, onExit }: { href: string; onExit?: () => void }) {
  const { setActive, setScope, register } = usePresentationFocus();
  const frame = useRef<HTMLIFrameElement>(null);
  const leaving = useRef(false);
  const [ready, setReady] = useState(0);
  const url = new URL(href, location.href);
  url.searchParams.set('embed', '1');
  url.searchParams.set('presentationOrigin', location.origin);
  const origin = url.origin;
  const exit = useEffectEvent(() => {
    if (leaving.current) return;
    leaving.current = true;
    setActive(false);
    onExit?.();
  });
  const receiveMessage = useEffectEvent((data: EmbedMessage) => {
    if (data.type === 'lab:demo-ready') setReady((revision) => revision + 1);
    if (data.type === 'lab:demo-focus') setScope(data.scope);
    if (data.type === 'lab:demo-return') exit();
  });
  useEffect(() => {
    setActive(true);
    const source = frame.current?.contentWindow;
    const receive = (event: MessageEvent) => {
      if (isEmbedMessage(event, source, origin)) receiveMessage(event.data);
    };
    window.addEventListener('message', receive);
    return () => {
      window.removeEventListener('message', receive);
      setActive(false);
    };
  }, [origin, setActive]);

  const input = useEffectEvent((action: FocusAction) => {
    if (ready)
      frame.current?.contentWindow?.postMessage({ type: 'lab:demo-input', action }, origin);
    else if (action === 'back') exit();
    return true;
  });
  useEffect(() => register(input), [register]);
  useEffect(() => {
    if (!ready) return;
    frame.current?.contentWindow?.postMessage({ type: 'lab:demo-enter' }, origin);
    frame.current?.focus();
  }, [ready, origin]);

  return (
    <div className="tv-slide remote-slide" aria-label="TV presentation slide">
      <div className="tv-handoff-stage">
        <DemoFrame ref={frame} title="Canvas TV — interactive remote navigation" src={url.href} />
      </div>
      <div className="tv-slide-footer">
        <a href="#next-directions">Continue presentation →</a>
      </div>
    </div>
  );
}
