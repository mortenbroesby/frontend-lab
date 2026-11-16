import assert from 'node:assert/strict';
import { test } from 'node:test';
import { discoverDemos } from '../src/demo-contract.ts';
import type { DemoDefinition } from '../src/demo-contract.ts';

const demo = {
  title: 'Example', track: 'a', description: 'Try it', author: 'Lab',
  load: async () => ({ default: () => null }),
} satisfies DemoDefinition;

test('discovery derives stable IDs and does not load inactive demos', () => {
  const definitions = discoverDemos({
    './demos/zebra/demo.config.ts': { ...demo, load: () => { throw new Error('eager load'); } },
    './demos/alpha/demo.config.ts': demo,
  });
  assert.deepEqual(definitions.map(d => d.id), ['alpha', 'zebra']);
});

test('invalid paths and metadata report the offending file', () => {
  for (const path of ['./demos/Bad/demo.config.ts', './demos/template/demo.config.ts', './demos/nested/path/demo.config.ts']) {
    assert.throws(() => discoverDemos({ [path]: demo }), /Invalid demo folder/);
  }
  for (const value of [undefined, {}, { ...demo, title: '' }, { ...demo, track: 'e' }, { ...demo, load: null }]) {
    assert.throws(() => discoverDemos({ './demos/broken/demo.config.ts': value }), /broken\/demo.config.ts/);
  }
});

// Compile-time regression checks: the host cannot supply mandatory props.
const invalidTrack: DemoDefinition = { ...demo,
  // @ts-expect-error Track IDs are a closed union.
  track: 'e',
};
const invalidComponent: DemoDefinition = { ...demo,
  // @ts-expect-error A component requiring props cannot mount in the host.
  load: async () => ({ default: (_props: { required: string }) => null }),
};
void invalidTrack;
void invalidComponent;
