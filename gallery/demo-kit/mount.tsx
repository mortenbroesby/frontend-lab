import { ExploreCode } from './ExploreCode';
import { CommandMenu } from './CommandMenu';
import { LabMark } from './LabMark';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { requirementLabels } from './types';
import type { ComponentType } from 'react';
import type { DemoDefinition } from './types';
import { galleryHref, demoTrack } from './gallery-link';
import { DemoBoundary } from './DemoBoundary';
import { Button } from '@lab/ui/button';
import '@lab/ui/styles.css';
import './styles.css';

/** Optional React starter; standalone apps may replace their entry with any framework. */
export function mountDemo(Component: ComponentType, demo: DemoDefinition, id: string) {
  document.title = demo.title;
  const track = demoTrack(demo, location.search);
  const trackHref = galleryHref(`/track/${track}/examples`);
  const commands = [
    ['/demos', 'All demos'],
    [`/track/${track}/examples`, 'Back to track'],
  ].flatMap(([route, label]) => {
    const href = galleryHref(route);
    return href ? [{ label, group: 'Navigation', href }] : [];
  });
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {trackHref && (
        <header className="site-header">
          <a className="wordmark" href={galleryHref('/')}>
            <LabMark />
            Frontend Lab
          </a>
          <nav aria-label="Lab">
            <CommandMenu links={commands} />
            <Button variant="outline" asChild>
              <a href={trackHref}>← Back to track</a>
            </Button>
          </nav>
        </header>
      )}
      {!trackHref && (
        <div className="standalone-tools">
          <CommandMenu />
        </div>
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
        <ExploreCode demo={demo} id={id} />
      </main>
    </StrictMode>,
  );
}
