import assert from 'node:assert/strict';
import { test } from 'node:test';
import { countPrimes, MAX_LIMIT } from '../src/examples/compute.ts';

test('counts primes inclusively, including boundary and composite limits', () => {
  for (const [limit, count] of [[2, 1], [3, 2], [4, 2], [10, 4], [100, 25], [100000, 9592]]) {
    assert.equal(countPrimes(limit), count);
  }
});

test('rejects invalid and unbounded workloads', () => {
  for (const value of [-1, 0, 1, 2.5, NaN, Infinity, MAX_LIMIT + 1]) {
    assert.throws(() => countPrimes(value), RangeError);
  }
});

test('the largest selectable workload has a known correct result', () => {
  assert.equal(countPrimes(MAX_LIMIT), 148933);
});
