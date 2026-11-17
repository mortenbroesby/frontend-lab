import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import CanvasTV from './index';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoBoundary>
      <CanvasTV />
    </DemoBoundary>
  </StrictMode>,
);
