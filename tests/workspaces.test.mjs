import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const kit = read('gallery/demo-kit/package.json');

test('React versions agree across the gallery, kit and independent demos', () => {
  const paths = [
    'gallery/package.json',
    'gallery/demo-kit/package.json',
    ...globSync('demos/*/package.json'),
    ...globSync('showcases/*/package.json'),
    ...globSync('shared/*/package.json'),
  ];
  for (const path of paths) {
    const { dependencies = {} } = read(path);
    for (const name of ['react', 'react-dom']) {
      if (dependencies[name])
        assert.equal(dependencies[name], kit.dependencies[name], `${path}: ${name} drift`);
    }
  }
});
