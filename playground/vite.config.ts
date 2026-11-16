import { existsSync, globSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = import.meta.dirname;
const entries = globSync('src/demos/*/demo.config.ts', { cwd: root }).map(path => {
  const entry = resolve(root, path.replace('demo.config.ts', 'index.html'));
  if (!existsSync(entry)) throw new Error(`${path}: every demo needs an index.html entry. Use npm run demo:new.`);
  return entry;
});
export default defineConfig({
  plugins: [react()],
  build: { rollupOptions: { input: [resolve(root, 'index.html'), ...entries] } },
});
