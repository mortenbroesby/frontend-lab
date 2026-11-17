import { useEffect, useRef, useState } from 'react';

/** A fixed widescreen viewport keeps the live controls from wrapping inside a slide. */
export function InstrumentFrame({
  src,
  title,
  allow,
}: {
  src: string;
  title: string;
  allow: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(entry.contentRect.width / 1280, entry.contentRect.height / 720));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="instrument-frame" ref={container}>
      <iframe
        src={src}
        title={title}
        allow={allow}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      />
    </div>
  );
}
