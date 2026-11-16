import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { DemoComponent, DemoDefinition } from './types';
import { DemoBoundary } from './DemoBoundary';
import './styles.css';

/** Optional React starter; standalone apps may replace their entry with any framework. */
export function mountDemo(Component: DemoComponent, demo: DemoDefinition, id: string) {
  document.title = demo.title;
  createRoot(document.getElementById('root')!).render(<StrictMode>
    <main id="content" tabIndex={-1}>
      <h1>{demo.title}</h1><p>{demo.description}</p>
      <section id={id} className="experiment"><DemoBoundary><Component /></DemoBoundary></section>
    </main>
  </StrictMode>);
}
