import assert from 'node:assert/strict';
import test from 'node:test';
import { isRemoteMessage, remoteRoom } from './remote-protocol.ts';

test('pairing accepts only a full random session token', () => {
  assert.equal(remoteRoom('#remote=' + 'a'.repeat(32)), 'a'.repeat(32));
  for (const hash of ['#welcome', '#remote=1234', '#remote=' + 'a'.repeat(33)])
    assert.equal(remoteRoom(hash), null);
});

test('commands are limited to one step, with a unique request id', () => {
  assert.ok(isRemoteMessage({ kind: 'input', action: 'right', request: 'request-1' }));
  assert.ok(isRemoteMessage({ kind: 'input', action: 'left', request: 'request-2' }));
  for (const value of [
    null,
    {},
    { kind: 'input', action: 'invalid', request: 'x' },
    { kind: 'input', action: 'right' },
    { kind: 'hello', role: 'anything' },
  ])
    assert.equal(isRemoteMessage(value), false);
});

test('snapshots have bounded text and valid slide positions', () => {
  const state = {
    kind: 'state',
    focus: 'slides',
    index: 2,
    total: 17,
    title: 'Tracks',
    notes: 'Introduce the choices.',
    next: 'Modern Web',
    elapsed: '00:32',
  };
  assert.ok(isRemoteMessage(state));
  for (const patch of [
    { index: -1 },
    { index: 17 },
    { index: 0.5 },
    { total: 0 },
    { notes: 'a'.repeat(12001) },
    { elapsed: 5 },
  ])
    assert.equal(isRemoteMessage({ ...state, ...patch }), false);
});

test('return-to-slides commands require a request id', () => {
  assert.ok(isRemoteMessage({ kind: 'input', action: 'back', request: 'return-1' }));
  assert.equal(isRemoteMessage({ kind: 'input', action: 'back', request: '' }), false);
});
