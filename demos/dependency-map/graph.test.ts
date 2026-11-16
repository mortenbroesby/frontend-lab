import assert from 'node:assert/strict';
import { test } from 'node:test';
import { impactOf } from './graph.ts';

test('impact follows dependents, keeps shortest distance and terminates on cycles', () => {
  const links = [
    { source: 'app', target: 'ui' },
    { source: 'ui', target: 'react' },
    { source: 'app', target: 'react' },
    { source: 'react', target: 'ui' },
    { source: 'other', target: 'unrelated' },
  ];
  assert.deepEqual(
    [...impactOf('react', links)],
    [
      ['react', 0],
      ['ui', 1],
      ['app', 1],
    ],
  );
  assert.deepEqual([...impactOf('app', links)], [['app', 0]]);
});
