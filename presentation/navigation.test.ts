import assert from 'node:assert/strict';
import { test } from 'node:test';
import { navigationDelta, moveSlide } from './navigation.ts';

test('presentation shortcuts leave interactions and held keys alone', () => {
  const key = {
    key: 'ArrowRight',
    repeat: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  };
  assert.equal(navigationDelta(key, false), 1);
  assert.equal(navigationDelta({ ...key, key: ' ' }, false), 1);
  assert.equal(navigationDelta({ ...key, key: 'ArrowLeft' }, false), -1);
  assert.equal(navigationDelta(key, true), 0);
  assert.equal(navigationDelta({ ...key, repeat: true }, false), 0);
  assert.equal(navigationDelta({ ...key, metaKey: true }, false), 0);
});

test('slide navigation stops at either end', () => {
  assert.equal(moveSlide(0, -1, 5), 0);
  assert.equal(moveSlide(4, 1, 5), 4);
  assert.equal(moveSlide(1, 1, 5), 2);
});
