import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const kit = read('gallery/demo-kit/package.json');

test('React versions agree across the gallery, kit and independent demos', () => {
  const paths = [
    'gallery/package.json',
    'presentation/package.json',
    'gallery/demo-kit/package.json',
    ...globSync('demos/*/package.json'),
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

test('demo editing guidance names real files, commands and guides', async () => {
  for (const path of globSync('demos/*/demo.config.ts')) {
    const { default: demo } = await import(new URL(`../${path}`, import.meta.url));
    if (!demo.explore) continue;
    const folder = path.slice(0, -'demo.config.ts'.length);
    assert.ok(
      readFileSync(new URL(`../${folder}${demo.explore.file}`, import.meta.url)).length,
      path,
    );
    const manifest = read(`${folder}package.json`);
    assert.equal(manifest.name, `@lab/demo-${folder.split('/')[1]}`);
    assert.ok(manifest.scripts.dev);
    if (demo.explore.guide) {
      const document = demo.explore.guide.replace('/track/', 'gallery/src/content/tracks/');
      assert.ok(readFileSync(new URL(`../${document}.mdx`, import.meta.url)).length, path);
    }
  }
});
