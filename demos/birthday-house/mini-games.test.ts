import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mirrorTargets, connectedMirrors, lightPath, swapCups, cupAt } from './mini-games.ts';
test('lantern light only reaches the plate through three correctly aimed mirrors', () => {
  assert.equal(connectedMirrors([0, 0, 0]), 0);
  assert.equal(connectedMirrors([3, 0, 1]), 1);
  assert.equal(connectedMirrors([0, 3, 1]), 0);
  assert.equal(connectedMirrors(mirrorTargets), 3);
  assert.deepEqual(lightPath(mirrorTargets).at(-1), [73, 55]);
  assert.notDeepEqual(lightPath([0, 3, 1]).at(-1), [73, 55]);
});
test('cup shuffles preserve identities and the button follows its cup', () => {
  const original = [0, 1, 2];
  const once = swapCups(original, 0, 2);
  assert.deepEqual(original, [0, 1, 2]);
  assert.deepEqual(once, [2, 1, 0]);
  assert.equal(cupAt(once, 0), 2);
  assert.deepEqual(swapCups(once, 0, 2), original);
});
