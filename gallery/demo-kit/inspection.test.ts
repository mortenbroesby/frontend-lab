import assert from 'node:assert/strict';
import { test } from 'node:test';
import { describeDemo } from './inspection.ts';

test('only offers supported scripts and uses the workspace folder, not package name', () => {
  assert.deepEqual(
    describeDemo('my-demo', { dev: 'vite', build: 'vite build', deploy: 'publish' }),
    {
      source: 'demos/my-demo/',
      commands: [
        { label: 'Run locally', command: 'npm run dev --workspace ./demos/my-demo' },
        { label: 'Build', command: 'npm run build --workspace ./demos/my-demo' },
      ],
    },
  );
  assert.deepEqual(describeDemo('no-tests', {}).commands, []);
  assert.equal(
    describeDemo('tested', { test: 'node --test' }).commands[0].command,
    'npm run test --workspace ./demos/tested',
  );
});

test('rejects paths and shell syntax in demo IDs', () => {
  for (const id of ['../outside', 'demo;whoami', 'two words', '']) {
    assert.throws(() => describeDemo(id, {}), /Invalid demo ID/);
  }
});
