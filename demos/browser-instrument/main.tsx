import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import { mountDemo } from '@lab/demo-kit/mount';
import Demo from './index';
import definition from './demo.config';

if (new URLSearchParams(window.location.search).has('embed')) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <DemoBoundary>
        <main className="instrument-performance-page">
          <Demo />
        </main>
      </DemoBoundary>
    </StrictMode>,
  );
} else {
  mountDemo(Demo, definition, 'browser-instrument');
}
