import assert from 'node:assert/strict';
import test from 'node:test';
import { createWalkthrough, isWalkthroughState } from './walkthrough.ts';

test('steps are bounded and rapid commands cancel previous work', async () => {
  const signals: AbortSignal[] = [];
  const steps: number[] = [];
  const tour = createWalkthrough(
    ['Sound', 'Tone'],
    (index, signal) => {
      steps.push(index);
      signals.push(signal);
    },
    () => {},
    () => {},
  );
  tour.command('back');
  assert.deepEqual(steps, []);
  tour.command('next');
  tour.command('next');
  tour.command('next');
  assert.deepEqual(steps, [0, 1]);
  assert.equal(signals[0].aborted, true);
  tour.dispose();
  assert.equal(signals[1].aborted, true);
});

test('stopping a pending play prevents delayed advancement', async () => {
  let finish: () => void = () => {};
  let calls = 0;
  let stopped = 0;
  const tour = createWalkthrough(
    ['One', 'Two'],
    () => {
      calls++;
      return new Promise<void>((resolve) => {
        finish = resolve;
      });
    },
    () => {
      stopped++;
    },
    () => {},
  );
  tour.command('play');
  tour.command('stop');
  finish();
  await Promise.resolve();
  assert.equal(calls, 1);
  assert.equal(stopped, 1);
  tour.dispose();
});

test('state rejects invalid positions and unbounded remote text', () => {
  const valid = { index: -1, total: 5, label: 'Ready', playing: false, message: '' };
  assert.ok(isWalkthroughState(valid));
  for (const patch of [
    { index: 5 },
    { index: -2 },
    { total: 0 },
    { playing: 1 },
    { label: 'x'.repeat(201) },
  ])
    assert.equal(isWalkthroughState({ ...valid, ...patch }), false);
});

test('autoplay ends on the final step, stops resources, and never navigates slides', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const applied: number[] = [];
  let stopped = 0;
  let playing = false;
  const tour = createWalkthrough(
    ['One', 'Two'],
    (index) => {
      applied.push(index);
    },
    () => {
      stopped++;
    },
    (state) => {
      playing = state.playing;
    },
  );
  tour.command('play');
  await Promise.resolve();
  t.mock.timers.tick(5000);
  await Promise.resolve();
  t.mock.timers.tick(5000);
  assert.deepEqual(applied, [0, 1]);
  assert.equal(playing, false);
  assert.equal(stopped, 1);
  tour.dispose();
});

test('manual interruption cancels autoplay without stopping the manually controlled demo', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let applied = 0;
  let stopped = 0;
  const tour = createWalkthrough(
    ['One', 'Two'],
    () => {
      applied++;
    },
    () => {
      stopped++;
    },
    () => {},
  );
  tour.command('play');
  await Promise.resolve();
  tour.interrupt();
  t.mock.timers.tick(10000);
  assert.equal(applied, 1);
  assert.equal(stopped, 0);
  tour.dispose();
});

test('a failed step reports why and leaves no running sequence', async () => {
  let message = '';
  let playing = true;
  const tour = createWalkthrough(
    ['Sound'],
    () => {
      throw new Error('Enable audio on the audience screen');
    },
    () => {},
    (state) => {
      message = state.message;
      playing = state.playing;
    },
  );
  tour.command('play');
  await Promise.resolve();
  assert.equal(message, 'Enable audio on the audience screen');
  assert.equal(playing, false);
  tour.dispose();
});
