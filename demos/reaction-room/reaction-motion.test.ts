import assert from 'node:assert/strict';
import { test } from 'node:test';
import { reactionActivity, stepSpring } from './reaction-motion.ts';

const taps = (count: number, people = 1) =>
  Array.from({ length: count }, (_, id) => ({
    id,
    emoji: '🚀',
    sender: `person-${id % people}`,
    at: 1000 + id * 100,
  }));
test('one tap stays visible, fades after inactivity and is revived by another tap', () => {
  const first = taps(1);
  assert.equal(reactionActivity(first, 1200).opacity, 1);
  assert.ok(reactionActivity(first, 4000).opacity < 1);
  assert.equal(reactionActivity(first, 5000).opacity, 0);
  assert.equal(reactionActivity([...first, { ...first[0], id: 1, at: 4500 }], 4600).opacity, 1);
});
test('solo bursts warm up, group bursts burn brighter and both cool down', () => {
  assert.equal(reactionActivity(taps(7), 1700).heat, 1);
  assert.equal(reactionActivity(taps(9, 3), 1900).heat, 2);
  assert.equal(reactionActivity(taps(2), 1200).heat, 0);
  assert.equal(reactionActivity(taps(9, 3), 5000).heat, 0);
  assert.ok(reactionActivity(taps(9), 1900).energy > reactionActivity(taps(1), 1900).energy);
});
test('spring momentum overshoots then settles without exploding after a delayed frame', () => {
  let spring = { position: 0, velocity: 4 };
  let crossed = false;
  for (let i = 0; i < 300; i++) {
    spring = stepSpring(spring, 0.5, 1 / 60);
    if (spring.position < 0) crossed = true;
    assert.ok(Math.abs(spring.position) < 0.5);
  }
  assert.equal(crossed, true);
  assert.ok(Math.abs(spring.position) + Math.abs(spring.velocity) < 0.001);
  assert.ok(Number.isFinite(stepSpring({ position: 0, velocity: 4 }, 1, 60).position));
});
