import { useEffect, useState } from 'react';
import { PaperDialog } from './inspection';

export function DisplayControls({ reduced, onMotion }: { reduced: boolean; onMotion: () => void }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [help, setHelp] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(() => !!document.fullscreenEnabled);
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
      setScreenAvailable(false);
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
          aria-label="Begræns bevægelse"
          title={reduced ? 'Stilhed' : 'Levende lys'}
        >
          {reduced ? 'Stilhed' : 'Levende lys'}
        </button>
        {screenAvailable ? (
          <button
            className="fullscreen-control"
            onClick={() => void toggleScreen()}
            aria-label={fullscreen ? 'Forlad fuld skærm' : 'Åbn fuld skærm'}
            title="Fuld skærm"
          >
            ⛶
          </button>
        ) : (
          !appMode && (
            <button
              onClick={() => setHelp(true)}
              aria-label="Sådan åbner du appvisning"
              title="Vejledning til hjemmeskærmen"
            >
              Appvisning
            </button>
          )
        )}
      </div>
      {help && (
        <PaperDialog title="Spil uden browserens bjælker" onClose={() => setHelp(false)}>
          {appMode ? (
            <p>Du er allerede i appvisning.</p>
          ) : (
            <>
              <p>Denne browser kan ikke åbne spillet i fuld skærm.</p>
              <p>
                På iPhone: Del → Føj til hjemmeskærm. Slå “Åbn som webapp” til, hvis muligheden
                vises. Åbn derefter spillet via det nye ikon.
              </p>
            </>
          )}
          <button className="ink-button" onClick={() => setHelp(false)}>
            Spil videre
          </button>
        </PaperDialog>
      )}
    </>
  );
}
