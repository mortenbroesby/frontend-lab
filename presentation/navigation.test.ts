import assert from 'node:assert/strict';
import { test } from 'node:test';
import { navigationAction, moveSlide } from './navigation.ts';

test('presentation shortcuts leave interactions and held keys alone', () => {
  const key = {
    key: 'ArrowRight',
    repeat: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  };
  assert.equal(navigationAction(key, false), 'right');
  assert.equal(navigationAction({ ...key, key: ' ' }, false), 'right');
  assert.equal(navigationAction({ ...key, key: 'ArrowLeft' }, false), 'left');
  assert.equal(navigationAction(key, true), undefined);
  assert.equal(navigationAction({ ...key, repeat: true }, false), undefined);
  assert.equal(navigationAction({ ...key, metaKey: true }, false), undefined);
});

test('slide navigation stops at either end', () => {
  assert.equal(moveSlide(0, -1, 5), 0);
  assert.equal(moveSlide(4, 1, 5), 4);
  assert.equal(moveSlide(1, 1, 5), 2);
});
