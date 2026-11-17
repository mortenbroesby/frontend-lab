import { useEffect, useState, type RefObject } from 'react';
import { Button } from '@lab/ui/button';

export function PerformanceControls({ stage }: { stage: RefObject<HTMLDivElement | null> }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === stage.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, [stage]);
  async function toggle() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stage.current?.requestFullscreen();
      setError('');
    } catch {
      setError('Fullscreen is unavailable. Performance view still works here.');
    }
  }
  return (
    <>
      <Button variant="outline" onClick={() => void toggle()}>
        {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      </Button>
      <Button variant="ghost" asChild>
        <a href={window.location.pathname}>Back to demo</a>
      </Button>
      {error && <span role="status">{error}</span>}
    </>
  );
}
