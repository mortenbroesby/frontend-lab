import assert from 'node:assert/strict';
import test from 'node:test';
import { isCommand, isSnapshot } from './remote-protocol.ts';
test('remote boundary accepts only navigation commands and bounded display snapshots', () => {
  assert.equal(isCommand('ArrowDown'), true);
  assert.equal(isCommand('Enter'), true);
  for (const value of [null, {}, 'reload', '<script>']) assert.equal(isCommand(value), false);
  assert.equal(isSnapshot({ title: 'Orbit', row: 'Explore', playing: false }), true);
  for (const value of [
    null,
    {},
    { title: 'x', row: 'x', playing: 'yes' },
    { title: 'x'.repeat(201), row: 'x', playing: true },
  ])
    assert.equal(isSnapshot(value), false);
});
