import assert from 'node:assert/strict';
import { test } from 'node:test';
import { discoverDemos } from '../src/demo-contract.ts';
import type { DemoDefinition } from '../src/demo-contract.ts';

const demo = {
  title: 'Example', track: 'modern-web', description: 'Try it', author: 'Lab',
} satisfies DemoDefinition;

test('discovery derives stable IDs and does not load inactive demos', () => {
  const definitions = discoverDemos({
    '../../demos/zebra/demo.config.ts': demo,
    '../../demos/alpha/demo.config.ts': demo,
  }, {
    '../../demos/zebra/index.tsx': () => { throw new Error('eager load'); },
    '../../demos/alpha/index.tsx': async () => ({ default: () => null }),
  });
  assert.deepEqual(definitions.map(d => d.id), ['alpha', 'zebra']);
});

test('invalid paths and metadata report the offending file', () => {
  for (const path of ['../../demos/Bad/demo.config.ts', '../../demos/template/demo.config.ts', '../../demos/nested/path/demo.config.ts']) {
    assert.throws(() => discoverDemos({ [path]: demo }), /Invalid demo folder/);
  }
  for (const value of [undefined, {}, { ...demo, title: '' }, { ...demo, track: 'e' }, { ...demo, presentation: 'invalid' }]) {
    assert.throws(() => discoverDemos({ '../../demos/broken/demo.config.ts': value }), /broken\/demo.config.ts/);
  }
});

// Compile-time regression checks: the host cannot supply mandatory props.
const invalidTrack: DemoDefinition = { ...demo,
  // @ts-expect-error Track IDs are a closed union.
  track: 'e',
};
// @ts-expect-error Inline components cannot require host-supplied props.
const invalidComponent: import('@lab/demo-kit/types').DemoComponent = (_props: { required: string }) => null;
void invalidTrack;
void invalidComponent;


test('standalone metadata needs no React loader, but inline demos do', () => {
  const path = '../../demos/vanilla/demo.config.ts';
  const standalone = { title: 'Vanilla', track: 'modern-web', description: 'No React', author: 'Lab', presentation: 'standalone' };
  assert.equal(discoverDemos({ [path]: standalone })[0].id, 'vanilla');
  assert.throws(() => discoverDemos({ [path]: { ...standalone, presentation: 'inline' } }));
  assert.throws(() => discoverDemos({ [path]: { ...standalone, presentation: 'invalid' } }));
});

test('inline discovery reports a missing conventional component entry', () => {
  assert.throws(() => discoverDemos({ '../../demos/missing/demo.config.ts': demo }), /missing.*index.tsx/);
});
