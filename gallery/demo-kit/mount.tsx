import { LabMark } from './LabMark';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { requirementLabels } from './types';
import type { ComponentType } from 'react';
import type { DemoDefinition } from './types';
import { galleryHref } from './gallery-link';
import { DemoBoundary } from './DemoBoundary';
import { Button } from '@lab/ui/button';
import '@lab/ui/styles.css';
import './styles.css';

/** Optional React starter; standalone apps may replace their entry with any framework. */
export function mountDemo(Component: ComponentType, demo: DemoDefinition, id: string) {
  document.title = demo.title;
  const trackHref = galleryHref(`/track/${demo.track}/examples`);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {trackHref && (
        <header className="site-header">
          <a className="wordmark" href={galleryHref('/')}>
            <LabMark />
            Front-End Lab
          </a>
          <nav aria-label="Lab">
            <Button variant="outline" asChild>
              <a href={trackHref}>← Back to track</a>
            </Button>
          </nav>
        </header>
      )}
      <main className="standalone-shell" id="content" tabIndex={-1}>
        <h1>{demo.title}</h1>
        <p>{demo.description}</p>
        {demo.requirements && (
          <p>{demo.requirements.map((id) => requirementLabels[id]).join(' · ')}</p>
        )}
        <section id={id} className="experiment">
          <DemoBoundary>
            <Component />
          </DemoBoundary>
        </section>
      </main>
    </StrictMode>,
  );
}
