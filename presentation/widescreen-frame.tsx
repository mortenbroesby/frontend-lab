import { DemoFrame } from './demo-frame';
import { useEffect, useRef, useState } from 'react';

/** A fixed widescreen viewport keeps the live controls from wrapping inside a slide. */
export function WidescreenFrame({
  src,
  title,
  allow,
  fillWidth = false,
}: {
  src: string;
  title: string;
  allow: string;
  fillWidth?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ scale: 0, height: 720 });
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = fillWidth ? width / 1280 : Math.min(width / 1280, height / 720);
      setViewport({ scale, height: fillWidth && scale > 0 ? height / scale : 720 });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [fillWidth]);
  return (
    <div className="widescreen-frame" ref={container}>
      <DemoFrame
        src={src}
        title={title}
        allow={allow}
        style={{
          height: viewport.height,
          transform: `translate(-50%, -50%) scale(${viewport.scale})`,
        }}
      />
    </div>
  );
}
