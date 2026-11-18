import assert from 'node:assert/strict';
import { test } from 'node:test';
import { navigationAction, moveSlide, navigateToSlide } from './navigation.ts';

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

test('backward arrival does not enter a demo; forward arrival does', () => {
  const afterTV = { index: 15, autoEnter: true };
  const tv = navigateToSlide(afterTV, 14, 17);
  assert.deepEqual(tv, { index: 14, autoEnter: false });
  assert.deepEqual(navigateToSlide(tv, 13, 17), { index: 13, autoEnter: false });
  assert.deepEqual(navigateToSlide({ index: 13, autoEnter: false }, 14, 17), {
    index: 14,
    autoEnter: true,
  });
  assert.equal(navigateToSlide(tv, 14, 17), tv);
  const first = { index: 0, autoEnter: false };
  assert.equal(navigateToSlide(first, -1, 17), first);
});
