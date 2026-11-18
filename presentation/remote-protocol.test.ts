import assert from 'node:assert/strict';
import test from 'node:test';
import { isRemoteMessage, remoteRoom } from './remote-protocol.ts';

test('pairing accepts only a full random session token', () => {
  assert.equal(remoteRoom('#remote=' + 'a'.repeat(32)), 'a'.repeat(32));
  for (const hash of ['#welcome', '#remote=1234', '#remote=' + 'a'.repeat(33)])
    assert.equal(remoteRoom(hash), null);
});

test('commands are limited to one step, with a unique request id', () => {
  assert.ok(isRemoteMessage({ kind: 'input', action: 'right', request: 'request-1', slide: 2 }));
  assert.ok(isRemoteMessage({ kind: 'input', action: 'left', request: 'request-2', slide: 2 }));
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
    walkthrough: null,
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
  assert.ok(isRemoteMessage({ kind: 'input', action: 'back', request: 'return-1', slide: 2 }));
  assert.equal(isRemoteMessage({ kind: 'input', action: 'back', request: '' }), false);
});

test('walkthrough controls are bounded and target a known slide', () => {
  for (const action of ['next-slide', 'demo-play', 'demo-stop']) {
    assert.ok(isRemoteMessage({ kind: 'input', action, slide: 12, request: 'r' }));
    assert.equal(isRemoteMessage({ kind: 'input', action, slide: -1, request: 'r' }), false);
    assert.equal(isRemoteMessage({ kind: 'input', action, request: 'r' }), false);
  }
});
