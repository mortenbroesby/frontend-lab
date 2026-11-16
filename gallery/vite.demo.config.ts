import { demoInspections } from './demo-inspections.ts';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Each workspace runs Vite with its own directory as root and emits its own dist/.
export default defineConfig({
  base: './',
  define: {
    'import.meta.env.LAB_STANDALONE': true,
    'import.meta.env.LAB_DEMO_INSPECTIONS': demoInspections(),
  },
  plugins: [tailwindcss(), react()],
});
