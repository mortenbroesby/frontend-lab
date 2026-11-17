import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { frequency, stepDuration, toggleStep, initialPattern } from './pattern.ts';
test('concert pitch and sixteenth-note timing', () => {
  assert.equal(frequency(69), 440);
  assert.equal(stepDuration(120), 0.125);
});
test('editing a step preserves the original loop', () => {
  const edited = toggleStep(initialPattern, 0, 0);
  assert.equal(edited[0][0], !initialPattern[0][0]);
  assert.equal(initialPattern[0][0], true);
  assert.deepEqual(edited[1], initialPattern[1]);
});
