import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { commandReport } from './commands.mjs';

test('sorts commands into a useful inventory', () => {
  assert.equal(commandReport({ scripts: { test: 'node --test', dev: 'vite' } }), 'dev: vite\ntest: node --test');
});
test('empty projects explain what is missing', () => {
  assert.equal(commandReport({}), 'No npm scripts defined.');
  assert.equal(commandReport({ scripts: {} }), 'No npm scripts defined.');
});
test('rejects malformed script entries instead of presenting misleading commands', () => {
  for (const value of [null, [], { scripts: [] }, { scripts: { dev: 123 } }]) {
    assert.throws(() => commandReport(value), /object|strings/);
  }
});
test('CLI reports a missing file without running any scripts', () => {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('./commands.mjs', import.meta.url)), 'file-that-does-not-exist.json'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot read command inventory/);
  assert.equal(result.stdout, '');
});
