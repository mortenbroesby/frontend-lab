import assert from 'node:assert/strict';
import test from 'node:test';
import { isRemoteMessage, remoteRoom } from './remote-protocol.ts';

test('pairing accepts only a full random session token', () => {
  assert.equal(remoteRoom('#remote=' + 'a'.repeat(32)), 'a'.repeat(32));
  for (const hash of ['#welcome', '#remote=1234', '#remote=' + 'a'.repeat(33)])
    assert.equal(remoteRoom(hash), null);
});

test('commands are limited to one step, with a unique request id', () => {
  assert.ok(isRemoteMessage({ kind: 'move', delta: 1, request: 'request-1' }));
  assert.ok(isRemoteMessage({ kind: 'move', delta: -1, request: 'request-2' }));
  for (const value of [
    null,
    {},
    { kind: 'move', delta: 5, request: 'x' },
    { kind: 'move', delta: 1 },
    { kind: 'hello', role: 'anything' },
  ])
    assert.equal(isRemoteMessage(value), false);
});

test('snapshots have bounded text and valid slide positions', () => {
  const state = {
    kind: 'state',
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
