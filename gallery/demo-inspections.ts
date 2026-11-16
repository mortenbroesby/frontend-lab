import { globSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describeDemo } from './demo-kit/inspection.ts';

/** Build-time metadata only: no package contents or source code shipped to the browser. */
export function demoInspections() {
  const root = resolve(import.meta.dirname, '..');
  return Object.fromEntries(
    globSync('demos/*/demo.config.ts', { cwd: root }).map((path) => {
      const id = path.split('/')[1];
      const manifest = JSON.parse(readFileSync(resolve(root, `demos/${id}/package.json`), 'utf8'));
      return [id, describeDemo(id, manifest.scripts ?? {})];
    }),
  );
}
