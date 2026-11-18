import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import '@lab/ui/styles.css';
import Orbit from './index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoBoundary>
      <Orbit />
    </DemoBoundary>
  </StrictMode>,
);
