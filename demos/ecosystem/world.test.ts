import test from 'node:test';
import assert from 'node:assert/strict';
import { stepWorld, type World } from './world.ts';

const world: World = { creatures: [{ x: 100, y: 100, angle: 0 }], food: [{ x: 140, y: 100 }], eaten: 0, time: 0 };

test('creatures approach visible food without mutating the previous world', () => {
  const next = stepWorld(world, 0.05, 50, 100);
  assert.ok(next.creatures[0].x > 100);
  assert.equal(next.creatures[0].y, 100);
  assert.equal(world.creatures[0].x, 100);
});

test('food is eaten only once even when creatures overlap', () => {
  const next = stepWorld({ ...world, creatures: [world.creatures[0], world.creatures[0]], food: [{ x: 100, y: 100 }] }, 0.05, 50, 100);
  assert.equal(next.eaten, 1);
  assert.equal(next.food.length, 0);
});

test('an empty pond remains bounded and finite over a long run', () => {
  let next: World = { ...world, food: [] };
  for (let i = 0; i < 2000; i++) next = stepWorld(next, 0.05, 100, 0);
  const { x, y } = next.creatures[0];
  assert.ok(x >= 12 && x <= 788 && y >= 12 && y <= 448);
});
