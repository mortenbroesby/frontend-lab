import assert from 'node:assert/strict';
import test from 'node:test';
import { advanceKonami } from '../src/app/presentation-discovery.ts';

const code = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];
const enter = (keys: string[]) => keys.reduce(advanceKonami, 0);
test('Konami completes only the full sequence, including upper-case letters', () => {
  assert.equal(enter(code), code.length);
  assert.equal(enter(code.slice(0, -1)), code.length - 1);
  assert.equal(enter([...code.slice(0, -2), 'B', 'A']), code.length);
});
test('wrong keys reset; overlapping up-arrow prefixes can restart', () => {
  assert.equal(enter([...code.slice(0, 4), 'x']), 0);
  assert.equal(enter(['ArrowUp', ...code]), code.length);
  assert.equal(enter([...code.slice(0, 5), ...code]), code.length);
});
