import { StrictMode, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import { PresentationFocus } from './presentation-focus';
import { Presentation } from './Presentation';
import './presentation.css';
import { remoteRoom } from './remote-protocol';
import { PresenterRemote } from './presenter-remote';

function subscribeToHash(listener: () => void) {
  window.addEventListener('hashchange', listener);
  return () => window.removeEventListener('hashchange', listener);
}
function PresentationEntry() {
  const room = useSyncExternalStore(subscribeToHash, () => remoteRoom(location.hash));
  return room ? (
    <PresenterRemote code={room} />
  ) : (
    <PresentationFocus>
      <Presentation />
    </PresentationFocus>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoBoundary>
      <PresentationEntry />
    </DemoBoundary>
  </StrictMode>,
);
