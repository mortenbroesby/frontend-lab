import { useDemoConnection } from './use-demo-connection';
import { DemoLoading } from './demo-loading';
import { useEffect, useRef } from 'react';
import { isFocusAction } from '@lab/demo-kit/focus';
import { DemoFrame } from './demo-frame';
import { usePresentationFocus } from './presentation-focus';

export function TVFrame({ href, onExit }: { href: string; onExit?: () => void }) {
  const { setActive, setScope } = usePresentationFocus();
  const frame = useRef<HTMLIFrameElement>(null);
  const leaving = useRef(false);
  const url = new URL(href, location.href);
  url.searchParams.set('embed', '1');
  url.searchParams.set('presentationOrigin', location.origin);
  const origin = url.origin;
  const exit = () => {
    if (leaving.current) return;
    leaving.current = true;
    setActive(false);
    onExit?.();
  };
  const connection = useDemoConnection(
    frame,
    url.href,
    (data) => {
      if (data.type === 'lab:demo-ready') {
        frame.current?.contentWindow?.postMessage({ type: 'lab:demo-enter' }, origin);
        frame.current?.focus();
      }
      if (data.type === 'lab:demo-focus') setScope(data.scope);
      if (data.type === 'lab:demo-return') exit();
    },
    (action) => {
      if (!isFocusAction(action)) return false;
      frame.current?.contentWindow?.postMessage({ type: 'lab:demo-input', action }, origin);
      return true;
    },
  );
  useEffect(() => {
    setActive(true);
    return () => setActive(false);
  }, [setActive]);

  return (
    <div className="tv-slide remote-slide" aria-label="TV presentation slide">
      <div className="tv-handoff-stage">
        <DemoFrame
          key={connection.attempt}
          inert={connection.status !== 'ready'}
          ref={frame}
          title="Canvas TV — interactive remote navigation"
          src={url.href}
        />
        <DemoLoading status={connection.status} retry={connection.retry} />
      </div>
      <div className="tv-slide-footer">
        <a href="#next-directions">Continue presentation →</a>
      </div>
    </div>
  );
}
