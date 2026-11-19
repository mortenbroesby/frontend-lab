import assert from 'node:assert/strict';
import test from 'node:test';
import { createRemotePeer } from './remote-peer.ts';

test('retries greetings until the opposite role responds, even if the first greeting was lost', () => {
  let now = 0;
  const peer = createRemotePeer(true, () => now);
  peer.joined('host');
  assert.deepEqual(peer.targets(), ['host']);
  now = 1000;
  assert.deepEqual(peer.targets(), ['host']);
  assert.equal(peer.accept({ kind: 'hello', role: 'remote' }, 'host'), false);
  assert.equal(peer.alive(), false);
  assert.equal(peer.accept({ kind: 'hello', role: 'host' }, 'host'), true);
  assert.equal(peer.alive(), true);
});

test('only the paired peer can refresh liveness or send commands', () => {
  let now = 0;
  const peer = createRemotePeer(false, () => now);
  peer.joined('phone');
  assert.equal(peer.accept({ kind: 'hello', role: 'remote' }, 'phone'), true);
  assert.equal(peer.accept({ kind: 'hello', role: 'remote' }, 'other'), false);
  now = 11000;
  assert.equal(peer.alive(), false);
  assert.equal(peer.retryDue(30000), false);
  now = 31000;
  assert.equal(peer.retryDue(30000), true);
  peer.accept({ kind: 'hello', role: 'remote' }, 'phone');
  assert.equal(peer.alive(), true);
  assert.equal(peer.retryDue(30000), false);
});

test('an abandoned join retries and a departed phone releases the pairing', () => {
  let now = 0;
  const peer = createRemotePeer(false, () => now);
  now = 31000;
  assert.equal(peer.retryDue(30000), true);
  peer.joined('phone');
  peer.accept({ kind: 'hello', role: 'remote' }, 'phone');
  peer.left('phone');
  assert.equal(peer.alive(), false);
  assert.deepEqual(peer.targets(), []);
  peer.joined('replacement');
  assert.equal(peer.accept({ kind: 'hello', role: 'remote' }, 'replacement'), true);
});
