import assert from 'node:assert/strict';
import test from 'node:test';
import { createGarden, targetFor, formations, families } from './model.ts';

test('the garden is deterministic and every connection has two real endpoints', () => {
  const a = createGarden();
  assert.deepEqual(a, createGarden());
  assert.equal(a.nodes.length, 384);
  const ids = new Set(a.nodes.map((node) => node.id));
  assert.equal(ids.size, a.nodes.length);
  for (const link of a.links) {
    assert(ids.has(link.source));
    assert(ids.has(link.target));
    assert.notEqual(link.source, link.target);
  }
  for (let group = 0; group < families.length; group++)
    assert.equal(a.nodes.filter((node) => node.group === group).length, 64);
});

test('all formations place finite targets inside the stage, including after rotation', () => {
  for (const mode of formations)
    for (const node of createGarden().nodes) {
      for (const time of [0, 30, 1000]) {
        const { x, y } = targetFor(node, mode.id, time);
        assert(Number.isFinite(x) && Number.isFinite(y));
        assert(Math.abs(x) < 460 && Math.abs(y) < 300);
      }
    }
});
