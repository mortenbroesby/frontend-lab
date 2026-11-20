import { useEffect, useState } from 'react';
import { demoTrack, galleryHref } from '@lab/demo-kit/gallery-link';
import definition from './demo.config';

export function ScreenTools() {
  const [full, setFull] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const sync = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);
  const href = galleryHref('/track/' + demoTrack(definition, location.search) + '/examples');
  async function toggle() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setError('');
    } catch {
      setError('Browser fullscreen unavailable.');
    }
  }
  return (
    <nav className="mb-tools" aria-label="Game screen">
      {href && <a href={href}>← Gallery</a>}
      {document.fullscreenEnabled && (
        <button onClick={() => void toggle()} aria-pressed={full}>
          {full ? 'Exit fullscreen' : 'Fullscreen'}
        </button>
      )}
      <span role="status" hidden={!error}>
        {error}
      </span>
    </nav>
  );
}
