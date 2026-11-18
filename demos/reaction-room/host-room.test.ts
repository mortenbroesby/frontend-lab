import test from 'node:test';
import assert from 'node:assert/strict';
import { createHostRoom } from './host-room.ts';

test('host relays a guest reaction to everyone except its sender', () => {
  const local: unknown[] = [];
  const host = createHostRoom(
    (batch, sender) => local.push({ batch, sender }),
    () => {},
  );
  const a: unknown[] = [],
    b: unknown[] = [];
  host.join('a', (message) => a.push(message));
  host.join('b', (message) => b.push(message));
  a.length = b.length = 0;
  host.receive('a', ['🚀']);
  assert.deepEqual(local, [{ batch: ['🚀'], sender: 'a' }]);
  assert.equal(a.length, 0);
  assert.deepEqual(b, [{ type: 'reactions', sender: 'a', emojis: ['🚀'] }]);
  host.publish(['💜']);
  assert.deepEqual(a, [{ type: 'reactions', sender: 'host', emojis: ['💜'] }]);
});

test('host caps rooms, frees departed seats, and ignores malformed or unknown senders', () => {
  let received = 0;
  const host = createHostRoom(
    () => received++,
    () => {},
  );
  for (let i = 0; i < 29; i++)
    assert.equal(
      host.join(String(i), () => {}),
      true,
    );
  assert.equal(
    host.join('overflow', () => {}),
    false,
  );
  host.receive('unknown', ['🚀']);
  host.receive('0', ['nope']);
  assert.equal(received, 0);
  host.leave('0');
  assert.equal(
    host.join('replacement', () => {}),
    true,
  );
});

test('host bounds rapid senders and reports the current connected count', () => {
  let received = 0;
  let count = 0;
  const host = createHostRoom(
    () => received++,
    (peers) => {
      count = peers;
    },
  );
  host.join('a', () => {});
  assert.equal(count, 1);
  for (let i = 0; i < 100; i++) host.receive('a', ['🚀', '✨']);
  assert.equal(received, 10);
  host.leave('a');
  assert.equal(count, 0);
});

test('repeated admission acknowledges the same guest without taking another seat', () => {
  let count = 0;
  const messages: unknown[] = [];
  const host = createHostRoom(
    () => {},
    (peers) => {
      count = peers;
    },
  );
  host.join('a', () => {});
  host.join('a', (message) => messages.push(message));
  assert.equal(count, 1);
  assert.deepEqual(messages, [{ type: 'welcome', count: 2 }]);
});
