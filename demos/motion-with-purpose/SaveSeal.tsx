import { useEffect, useRef } from 'react';
import lottie from 'lottie-web/build/player/lottie_light';
import animationData from './save-seal.json';

/** The save already happened. This player only illustrates its confirmation. */
export function SaveSeal({ animate }: { animate: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const player = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: structuredClone(animationData),
    });
    const start = () => {
      if (animate) player.goToAndPlay(0, true);
      else player.goToAndStop(player.totalFrames - 1, true);
    };
    player.addEventListener('DOMLoaded', start);
    if (player.isLoaded) start();
    return () => player.destroy();
  }, [animate]);
  return <div className="motion-seal" ref={container} aria-hidden="true" />;
}
