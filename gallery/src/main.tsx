import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import '@lab/demo-kit/styles.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
