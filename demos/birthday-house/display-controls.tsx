import { tr } from './language';
import { useEffect, useState } from 'react';
import { PaperDialog } from './inspection';

export function DisplayControls() {
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
        {screenAvailable ? (
          <button
            className="fullscreen-control"
            onClick={() => void toggleScreen()}
            aria-label={
              fullscreen
                ? tr('Forlad fuld skærm', 'Exit fullscreen')
                : tr('Åbn fuld skærm', 'Enter fullscreen')
            }
            title={tr('Fuld skærm', 'Fullscreen')}
          >
            ⛶
          </button>
        ) : (
          !appMode && (
            <button
              onClick={() => setHelp(true)}
              aria-label={tr('Sådan åbner du appvisning', 'How to open in app mode')}
              title={tr('Vejledning til hjemmeskærmen', 'Home Screen instructions')}
            >
              {tr('Appvisning', 'App mode')}
            </button>
          )
        )}
      </div>
      {help && <DisplayHelp appMode={appMode} close={() => setHelp(false)} />}
    </>
  );
}

function DisplayHelp({ appMode, close }: { appMode: boolean | undefined; close: () => void }) {
  return (
    <PaperDialog
      title={tr('Spil uden browserens bjælker', 'Play without browser controls')}
      onClose={close}
    >
      {appMode ? (
        <p>{tr('Du er allerede i appvisning.', 'You are already in app mode.')}</p>
      ) : (
        <>
          <p>
            {tr(
              'Denne browser kan ikke åbne spillet i fuld skærm.',
              'This browser cannot open the game in fullscreen.',
            )}
          </p>
          <p>
            {tr(
              'På iPhone: Del → Føj til hjemmeskærm. Slå “Åbn som webapp” til, hvis muligheden vises. Åbn derefter spillet via det nye ikon.',
              'On iPhone, tap Share → Add to Home Screen. Turn on “Open as Web App” if available, then open the game from its new icon.',
            )}
          </p>
        </>
      )}
      <button className="ink-button" onClick={close}>
        {tr('Spil videre', 'Keep playing')}
      </button>
    </PaperDialog>
  );
}
