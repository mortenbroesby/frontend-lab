import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import '@lab/ui/styles.css';
import Demo from './index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoBoundary>
      <Demo />
    </DemoBoundary>
  </StrictMode>,
);
