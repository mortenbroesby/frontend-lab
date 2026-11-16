import assert from 'node:assert/strict';
import { test } from 'node:test';
import { makeDots } from '../src/demos/art/art.ts';

test('a saved seed reproduces the same artwork while a remix changes it', () => {
  assert.deepEqual(makeDots(42, 90), makeDots(42, 90));
  assert.notDeepEqual(makeDots(42, 90), makeDots(43, 90));
});

test('art stays inside its viewBox even at the supported extremes', () => {
  for (const seed of [0, -1, 42, 4294967295]) {
    const dots = makeDots(seed, 400);
    assert.equal(dots.length, 400);
    for (const dot of dots) {
      assert.ok(dot.x >= 20 && dot.x <= 620);
      assert.ok(dot.y >= 20 && dot.y <= 400);
      assert.ok(dot.radius >= 3 && dot.radius <= 25);
    }
  }
  assert.deepEqual(makeDots(1, 0), []);
  assert.throws(() => makeDots(1, 401), RangeError);
  assert.throws(() => makeDots(NaN, 1), RangeError);
});
