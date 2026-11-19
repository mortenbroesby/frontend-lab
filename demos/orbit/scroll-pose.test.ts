import assert from 'node:assert/strict';
import test from 'node:test';
import { scrollPose } from './scroll-pose.ts';

test('scroll tilts the speaker up, then down through visibly distinct chapter poses', () => {
  const detail = scrollPose(1 / 3);
  const turn = scrollPose(2 / 3);
  assert.ok(detail.pitch < -0.4, 'detail exposes the speaker from below');
  assert.ok(turn.pitch > 0.5 && turn.pitch < 1.2, 'turn tips down without ending a full flip');
  assert.ok(Math.cos(detail.yaw) > 0, 'detail keeps the front visible');
  assert.ok(Math.cos(turn.yaw) < -0.5, 'turn reveals the back');
});

test('the finish settles before handoff and clamps scroll overshoot', () => {
  assert.deepEqual(scrollPose(0.86), scrollPose(1));
  assert.deepEqual(scrollPose(2), scrollPose(1));
  assert.deepEqual(scrollPose(-1), scrollPose(0));
  assert.ok(Math.abs(scrollPose(1).pitch - 0.24) < 0.001);
});

test('poses remain continuous in both scroll directions at chapter boundaries', () => {
  for (const point of [1 / 3, 2 / 3, 0.86]) {
    const before = scrollPose(point - 0.0001);
    const after = scrollPose(point + 0.0001);
    for (const axis of ['pitch', 'yaw', 'roll'] as const) {
      assert.ok(Math.abs(before[axis] - after[axis]) < 0.01);
    }
  }
});
