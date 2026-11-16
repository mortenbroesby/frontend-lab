import assert from 'node:assert/strict';
import { test } from 'node:test';
import { observeFrames } from './frames.ts';

test('includes the frame after work ends, rejects hidden samples and cleans up', (t) => {
  let now = 0;
  let frame: FrameRequestCallback | undefined;
  const events = new EventTarget();
  const doc = Object.assign(events, { hidden: false });
  const originals = ['document', 'requestAnimationFrame', 'cancelAnimationFrame'].map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  Object.defineProperties(globalThis, {
    document: { configurable: true, value: doc },
    requestAnimationFrame: {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        frame = callback;
        return 1;
      },
    },
    cancelAnimationFrame: {
      configurable: true,
      value: () => {
        frame = undefined;
      },
    },
  });
  t.mock.method(performance, 'now', () => now);
  const step = (time: number) => {
    now = time;
    const callback = frame;
    frame = undefined;
    callback?.(time);
  };
  const samples: (number | null)[] = [];
  const first = observeFrames();
  step(16);
  now = 116; // Synchronous work blocked the next callback.
  first.finish((gap) => samples.push(gap));
  assert.equal(samples.length, 0);
  step(120);
  assert.equal(samples.length, 1);
  assert.equal(samples[0], 104);
  assert.equal(frame, undefined);

  const hidden = observeFrames();
  doc.hidden = true;
  doc.dispatchEvent(new Event('visibilitychange'));
  doc.hidden = false;
  hidden.finish((gap) => samples.push(gap));
  assert.equal(samples.length, 2);
  assert.equal(samples[1], null);
  assert.equal(frame, undefined);

  const abandoned = observeFrames();
  abandoned.finish(() => assert.fail('Disposed observer must not publish a sample'));
  abandoned.dispose();
  step(200);
});
