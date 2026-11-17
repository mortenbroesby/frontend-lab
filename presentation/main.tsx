import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoBoundary } from '@lab/demo-kit/boundary';
import { Presentation } from './Presentation';
import './presentation.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoBoundary>
      <Presentation />
    </DemoBoundary>
  </StrictMode>,
);
