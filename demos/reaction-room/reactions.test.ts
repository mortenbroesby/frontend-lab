import { parseHostMessage } from './room-protocol.ts';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRoomCode, validRoomCode, validBatch } from './reactions.ts';

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
test('host messages reject malformed values and impossible room counts', () => {
  for (const value of [
    null,
    {},
    { type: 'toString' },
    { type: 'presence', count: 31 },
    { type: 'welcome', count: 0 },
    { type: 'reactions', sender: 'a', emojis: ['no'] },
  ])
    assert.equal(parseHostMessage(value), null);
  assert.deepEqual(parseHostMessage({ type: 'presence', count: 30 }), {
    type: 'presence',
    count: 30,
  });
});
