import assert from 'node:assert/strict';
import { test } from 'node:test';
import { discoverDemos } from '../src/demo-contract.ts';
import type { DemoDefinition } from '../src/demo-contract.ts';

const demo = {
  title: 'Example',
  track: 'modern-web',
  description: 'Try it',
  author: 'Lab',
} satisfies DemoDefinition;

test('discovery needs only metadata and returns stable IDs', () => {
  const definitions = discoverDemos({
    '../../demos/zebra/demo.config.ts': demo,
    '../../demos/alpha/demo.config.ts': demo,
  });
  assert.deepEqual(
    definitions.map((d) => d.id),
    ['alpha', 'zebra'],
  );
  assert.ok(definitions.every((d) => !('load' in d)));
});

test('invalid paths and metadata report the offending file', () => {
  for (const path of [
    '../../demos/Bad/demo.config.ts',
    '../../demos/template/demo.config.ts',
    '../../demos/nested/path/demo.config.ts',
  ]) {
    assert.throws(() => discoverDemos({ [path]: demo }), /Invalid demo folder/);
  }
  for (const value of [undefined, {}, { ...demo, title: '' }, { ...demo, track: 'e' }]) {
    assert.throws(
      () => discoverDemos({ '../../demos/broken/demo.config.ts': value }),
      /broken\/demo.config.ts/,
    );
  }
});

// Compile-time regression checks: the host cannot supply mandatory props.
const invalidTrack: DemoDefinition = {
  ...demo,
  // @ts-expect-error Track IDs are a closed union.
  track: 'e',
};
void invalidTrack;

test('runtime requirements are optional and reject unknown values', () => {
  const path = '../../demos/example/demo.config.ts';
  const requirements = ['internet', 'secure-context'] as const;
  assert.deepEqual(
    discoverDemos({ [path]: { ...demo, requirements } })[0].requirements,
    requirements,
  );
  assert.throws(
    () => discoverDemos({ [path]: { ...demo, requirements: ['mystery'] } }),
    /requirements/,
  );
  assert.throws(
    () => discoverDemos({ [path]: { ...demo, requirements: 'internet' } }),
    /requirements/,
  );
});

test('showcases have separate discovery and cannot accidentally enter the demo catalogue', () => {
  const path = '../../showcases/signal-garden/showcase.config.ts';
  assert.equal(discoverDemos({ [path]: demo }, 'showcases')[0].id, 'signal-garden');
  assert.throws(() => discoverDemos({ [path]: demo }), /Invalid demo folder/);
  assert.throws(() => discoverDemos({ '../../demos/alpha/demo.config.ts': demo }, 'showcases'));
  assert.throws(() => discoverDemos({ [path]: { ...demo, title: '' } }, 'showcases'), /title/);
});
