import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import type { DemoDefinition } from './types';
import { DemoBoundary } from './DemoBoundary';
import './styles.css';

/** Optional React starter; standalone apps may replace their entry with any framework. */
export function mountDemo(demo: DemoDefinition & { load: NonNullable<DemoDefinition['load']> }, id: string) {
  const Component = lazy(demo.load);
  document.title = demo.title;
  createRoot(document.getElementById('root')!).render(<StrictMode>
    <main id="content" tabIndex={-1}>
      <h1>{demo.title}</h1><p>{demo.description}</p>
      <section id={id} className="experiment"><DemoBoundary><Suspense fallback={<p role="status">Loading experiment…</p>}><Component /></Suspense></DemoBoundary></section>
    </main>
  </StrictMode>);
}
