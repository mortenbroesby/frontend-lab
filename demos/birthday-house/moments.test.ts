import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finaleAt, developmentAt } from './moments.ts';

test('the finale gathers light before opening the shutters and only then offers the photo', () => {
  assert.equal(finaleAt(0).open, 0);
  assert.equal(finaleAt(1800).open, 0);
  assert.ok(finaleAt(1800).shade > 0.5);
  assert.ok(finaleAt(3200).travel > 0);
  assert.equal(finaleAt(3200).open, 0);
  assert.ok(finaleAt(5000).open > 0);
  assert.equal(finaleAt(6000).ready, false);
  assert.equal(finaleAt(6500).ready, true);
  assert.equal(finaleAt(9000).open, 1);
  assert.equal(finaleAt(9000).shade, 0);
});
test('stars rise out of the bath before the developed constellation appears', () => {
  assert.equal(developmentAt(0).etched, false);
  assert.ok(developmentAt(1200).rise > 0);
  assert.equal(developmentAt(1200).etched, false);
  assert.equal(developmentAt(2400).etched, true);
  assert.equal(developmentAt(5000).rise, 1);
  assert.equal(developmentAt(5000).glow, 0);
});
