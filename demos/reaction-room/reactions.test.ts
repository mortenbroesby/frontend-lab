import { parseServerMessage } from './room-protocol.ts';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRoomCode, validRoomCode, validBatch, hotReactions } from './reactions.ts';

test('room codes are readable, valid and independently generated', () => {
  const codes = new Set(Array.from({ length: 100 }, createRoomCode));
  assert.equal(codes.size, 100);
  for (const code of codes) assert.equal(validRoomCode(code), true);
  assert.equal(validRoomCode(''), false);
  assert.equal(validRoomCode('a'.repeat(25)), false);
});
test('reaction messages are small and contain only supported icons', () => {
  assert.equal(validBatch(['🚀', '💜']), true);
  for (const value of [null, '🚀', [], ['nope'], ['🚀', '🚀', '🚀']])
    assert.equal(validBatch(value), false);
});
test('fire requires a recent burst from several participants and cools down', () => {
  const now = 5000;
  const burst = Array.from({ length: 9 }, (_, i) => ({
    emoji: '🚀',
    sender: `person-${i % 3}`,
    at: now,
  }));
  assert.deepEqual(hotReactions(burst, now), ['🚀']);
  assert.deepEqual(
    hotReactions(
      burst.map((e) => ({ ...e, sender: 'one' })),
      now,
    ),
    [],
  );
  assert.deepEqual(hotReactions(burst.slice(0, 3), now), []);
  assert.deepEqual(hotReactions(burst, now + 4001), []);
});

test('server messages reject malformed values and impossible room counts', () => {
  for (const value of [
    null,
    {},
    { type: 'toString' },
    { type: 'presence', count: 31 },
    { type: 'welcome', count: 0 },
    { type: 'reactions', sender: 'a', emojis: ['no'] },
  ])
    assert.equal(parseServerMessage(value), null);
  assert.deepEqual(parseServerMessage({ type: 'presence', count: 30 }), {
    type: 'presence',
    count: 30,
  });
});
