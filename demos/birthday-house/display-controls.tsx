import { useEffect, useState } from 'react';
import { PaperDialog } from './inspection';

export function DisplayControls({ reduced, onMotion }: { reduced: boolean; onMotion: () => void }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [help, setHelp] = useState(false);
  useEffect(() => {
    const changed = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', changed);
    return () => document.removeEventListener('fullscreenchange', changed);
  }, []);
  async function toggleScreen() {
    if (!document.fullscreenEnabled) {
      setHelp(true);
      return;
    }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setHelp(true);
    }
  }
  const appMode =
    matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone;
  return (
    <>
      <div className="header-actions">
        <button
          onClick={onMotion}
          aria-pressed={reduced}
          aria-label="Reduce motion"
          title={reduced ? 'Stillness' : 'Living light'}
        >
          {reduced ? 'Stillness' : 'Living light'}
        </button>
        <button
          onClick={() => void toggleScreen()}
          aria-label={fullscreen ? 'Exit full screen' : 'Enter full screen'}
          title="Full screen"
        >
          ⛶
        </button>
      </div>
      {help && (
        <PaperDialog title="Play without browser bars" onClose={() => setHelp(false)}>
          {appMode ? (
            <p>You’re already in app view.</p>
          ) : (
            <>
              <p>This browser cannot expand the game to fullscreen.</p>
              <p>
                On iPhone: Share → Add to Home Screen. Enable “Open as Web App” if offered, then
                launch the new icon.
              </p>
            </>
          )}
          <button className="ink-button" onClick={() => setHelp(false)}>
            Keep playing
          </button>
        </PaperDialog>
      )}
    </>
  );
}
