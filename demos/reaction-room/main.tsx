import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import { mountDemo } from '@lab/demo-kit/mount';
import Demo from './index';
import definition from './demo.config';

if (new URLSearchParams(location.search).get('embed') === '1') {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <main className="reaction-embedded">
        <DemoBoundary>
          <Demo />
        </DemoBoundary>
      </main>
    </StrictMode>,
  );
} else mountDemo(Demo, definition, 'reaction-room');
