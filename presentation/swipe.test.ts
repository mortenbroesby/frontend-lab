import assert from 'node:assert/strict';
import { test } from 'node:test';
import { swipeDelta } from './swipe.ts';

test('deliberate horizontal swipes move one slide in either direction', () => {
  assert.equal(swipeDelta(-100, 10, 300), 1);
  assert.equal(swipeDelta(100, -10, 300), -1);
});
test('taps, vertical scrolling, diagonals and long drags do not navigate', () => {
  assert.equal(swipeDelta(30, 0, 200), 0);
  assert.equal(swipeDelta(80, 100, 300), 0);
  assert.equal(swipeDelta(80, 70, 300), 0);
  assert.equal(swipeDelta(100, 0, 1500), 0);
});
