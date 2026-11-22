import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, act } from './game.ts';
import { soundFor, storyProgress } from './sound-events.ts';

test('musical milestones happen on earned progress, not repeated or wrong choices', () => {
  const first = initialState();
  assert.equal(soundFor(first, act(first, 'cup'), 'cup'), 'touch');
  const before = act(act(first, 'bun'), 'cake');
  const after = act(before, 'cup');
  assert.equal(soundFor(before, after, 'cup'), 'progress');
  assert.equal(storyProgress(after), 1);
  assert.equal(soundFor(after, act(after, 'cup'), 'cup'), 'touch');
  const attic = { ...after, room: 2, plate: true, inserted: true, horizontal: 1, vertical: 2 };
  const end = act(attic, 'project');
  assert.equal(soundFor(attic, end, 'project'), 'finale');
  assert.equal(storyProgress(end), 3);
  assert.equal(soundFor(end, act(end, 'project'), 'project'), 'brass');
  assert.equal(storyProgress(initialState()), 0);
});
test('doors, paper, and developing baths have distinct tactile sounds', () => {
  const s = initialState();
  assert.equal(soundFor(s, act(s, 'readnote'), 'readnote'), 'paper');
  const dark = { ...s, room: 1, breakfast: true, negative: true, bath: 2 };
  assert.equal(soundFor(dark, act(dark, 'fix'), 'fix'), 'developed');
  assert.equal(soundFor(dark, act(dark, 'breakfast'), 'breakfast'), 'door');
});
