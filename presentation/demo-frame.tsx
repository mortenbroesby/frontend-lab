import { useEffect, useState, type ComponentProps } from 'react';

/** Keep the loading document out of view until it has had a chance to paint. */
export function DemoFrame(props: ComponentProps<'iframe'>) {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [loaded]);

  return (
    <iframe
      {...props}
      loading="lazy"
      onLoad={(event) => {
        setLoaded(true);
        props.onLoad?.(event);
      }}
      style={{ ...props.style, visibility: visible ? 'visible' : 'hidden' }}
    />
  );
}
