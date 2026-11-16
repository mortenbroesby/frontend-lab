import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Each workspace runs Vite with its own directory as root and emits its own dist/.
export default defineConfig({
  base: './',
  define: { 'import.meta.env.LAB_STANDALONE': true },
  plugins: [react()],
});
