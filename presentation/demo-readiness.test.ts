import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoReadiness } from './demo-readiness.ts';

test('an unanswered demo becomes unavailable; a late ready response can recover', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const states: string[] = [];
  const demo = createDemoReadiness((state) => states.push(state));
  assert.equal(demo.status, 'loading');
  t.mock.timers.tick(8000);
  assert.equal(demo.status, 'unavailable');
  demo.ready();
  assert.equal(demo.status, 'ready');
  assert.deepEqual(states, ['loading', 'unavailable', 'ready']);
  demo.dispose();
});

test('ready cancels the deadline and disposed attempts cannot update the current frame', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const states: string[] = [];
  const demo = createDemoReadiness((state) => states.push(state));
  demo.ready();
  t.mock.timers.tick(8000);
  demo.dispose();
  demo.ready();
  assert.deepEqual(states, ['loading', 'ready']);
});
