import { DemoLoading } from './demo-loading';
import { useFrameWalkthrough } from './use-frame-walkthrough';
import { DemoFrame } from './demo-frame';
import { useEffect, useRef, useState } from 'react';

/** Fixed widescreen controls by default; responsive demos use the actual available viewport. */
export function WidescreenFrame({
  src,
  title,
  allow,
  responsive = false,
}: {
  src: string;
  title: string;
  allow: string;
  responsive?: boolean;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const url = new URL(src, location.href);
  url.searchParams.set('presentationOrigin', location.origin);
  const connection = useFrameWalkthrough(frame, url.href);
  const container = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ scale: 0, height: 720 });
  useEffect(() => {
    const element = container.current;
    if (!element || responsive) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width / 1280, height / 720);
      setViewport({ scale, height: 720 });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [responsive]);
  return (
    <div className="widescreen-frame" data-responsive={responsive} ref={container}>
      <DemoFrame
        ref={frame}
        key={connection.attempt}
        inert={connection.status !== 'ready'}
        src={url.href}
        title={title}
        allow={allow}
        style={
          responsive
            ? undefined
            : {
                height: viewport.height,
                transform: `translate(-50%, -50%) scale(${viewport.scale})`,
              }
        }
      />
      <DemoLoading status={connection.status} retry={connection.retry} />
    </div>
  );
}
