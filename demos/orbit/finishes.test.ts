import assert from 'node:assert/strict';
import test from 'node:test';
import { finishAt, finishes } from './finishes.ts';

test('each named stop produces its exact finish', () => {
  for (const stop of finishes) assert.equal(finishAt(stop.at).shell, stop.shell);
});

test('the slider blends between stops, rather than snapping to presets', () => {
  const between = finishAt(10);
  assert.notEqual(between.shell, finishes[0]!.shell);
  assert.notEqual(between.shell, finishes[1]!.shell);
  assert.match(between.shell, /^#[0-9a-f]{6}$/);
  assert.match(between.name, /Moonstone.*Terracotta/);
});

test('slider endpoints clamp safely', () => {
  assert.deepEqual(finishAt(-10), finishAt(0));
  assert.deepEqual(finishAt(110), finishAt(100));
  assert.deepEqual(finishAt(Number.NaN), finishAt(0));
});
