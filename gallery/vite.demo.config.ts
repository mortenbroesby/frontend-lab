import { defineConfig } from 'vite';
import { themeBootstrap } from './theme-bootstrap.ts';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Each workspace runs Vite with its own directory as root and emits its own dist/.
export default defineConfig({
  base: './',
  define: { 'import.meta.env.LAB_STANDALONE': true },
  plugins: [themeBootstrap(), tailwindcss(), react()],
});
