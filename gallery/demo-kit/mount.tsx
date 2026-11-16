import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { requirementLabels } from './types';
import type { ComponentType } from 'react';
import type { DemoDefinition } from './types';
import { galleryHref } from './gallery-link';
import { DemoBoundary } from './DemoBoundary';
import './styles.css';

/** Optional React starter; standalone apps may replace their entry with any framework. */
export function mountDemo(Component: ComponentType, demo: DemoDefinition, id: string) {
  document.title = demo.title;
  const trackHref = galleryHref(`/track/${demo.track}/examples`);
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <main className="standalone-shell" id="content" tabIndex={-1}>
        {trackHref && (
          <a className="demo-back-link" href={trackHref}>
            ← Back to track demos
          </a>
        )}
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
