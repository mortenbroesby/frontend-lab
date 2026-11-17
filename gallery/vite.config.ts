import { existsSync, globSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import tailwindcss from '@tailwindcss/vite';
import { demoLinks } from './mdx-demo-links';

const root = resolve(import.meta.dirname, '..');
const entries = globSync('demos/*/demo.config.ts', { cwd: root }).map((path) => {
  const entry = resolve(root, path.replace('demo.config.ts', 'index.html'));
  if (!existsSync(entry))
    throw new Error(`${path}: every demo needs an index.html entry. Use npm run demo:new.`);
  return entry;
});
const showcases = globSync('showcases/*/showcase.config.ts', { cwd: root }).map((path) => {
  const entry = resolve(root, path.replace('showcase.config.ts', 'index.html'));
  if (!existsSync(entry)) throw new Error(`${path}: every showcase needs an index.html entry.`);
  return entry;
});
export default defineConfig({
  root,
  plugins: [
    tailwindcss(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          [demoLinks, new Set(entries.map((entry) => basename(dirname(entry))))],
        ],
      }),
    },
    react({ include: /\.(jsx|js|mdx|tsx|ts)$/ }),
  ],
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: [
        resolve(root, 'index.html'),
        ...entries,
        ...showcases,
        resolve(root, 'presentation/index.html'),
      ],
    },
  },
});
