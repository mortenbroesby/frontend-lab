import assert from 'node:assert/strict';
import test from 'node:test';
import { isEmbedMessage } from './embed-protocol.ts';

test('embed messages require the expected window, origin and known action', () => {
  const source = {};
  const event = { source, origin: 'https://lab.example', data: { type: 'lab:demo-return' } };
  assert.ok(isEmbedMessage(event, source, event.origin));
  assert.equal(isEmbedMessage(event, {}, event.origin), false);
  assert.equal(isEmbedMessage(event, source, 'https://other.example'), false);
  assert.equal(isEmbedMessage({ ...event, data: null }, source, event.origin), false);
  assert.equal(
    isEmbedMessage({ ...event, data: { type: 'unknown' } }, source, event.origin),
    false,
  );
});
