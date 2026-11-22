import { currentLanguage, subscribeLanguage, tr } from './language';
import { StrictMode, useLayoutEffect, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import '@lab/ui/styles.css';
import Demo from './index';

function BirthdayHouse() {
  const language = useSyncExternalStore(subscribeLanguage, currentLanguage);
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.title = tr('Fødselsdagshuset', 'The Birthday House');
    document
      .querySelector('meta[name="apple-mobile-web-app-title"]')
      ?.setAttribute('content', document.title);
  }, [language]);
  return <Demo />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoBoundary>
      <BirthdayHouse />
    </DemoBoundary>
  </StrictMode>,
);
