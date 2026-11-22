import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, act, hint } from './game.ts';

test('clues gate the three-room journey and survive backtracking', () => {
  let s = initialState();
  assert.equal(act(s, 'darkroom').room, 0);
  s = act(s, 'bun');
  s = act(s, 'cake');
  s = act(s, 'cup');
  assert.equal(s.breakfast, true);
  s = act(s, 'darkroom');
  assert.equal(s.room, 1);
  assert.equal(act(s, 'fix').plate, false);
  s = act(s, 'takeplate');
  s = act(s, 'develop');
  s = act(s, 'stop');
  s = act(s, 'fix');
  assert.equal(s.plate, true);
  s = act(s, 'breakfast');
  assert.equal(s.plate, true);
  s = act(act(s, 'darkroom'), 'attic');
  assert.equal(s.room, 2);
  assert.equal(act(s, 'project').revealed, false);
  s = act(act(s, 'insert'), 'horizontal');
  s = act(act(s, 'vertical'), 'vertical');
  s = act(s, 'project');
  assert.equal(s.revealed, true);
  assert.deepEqual(initialState(), {
    room: 0,
    sequence: [],
    breakfast: false,
    bath: 0,
    plate: false,
    negative: false,
    note: false,
    recipe: false,
    inserted: false,
    horizontal: 0,
    vertical: 0,
    revealed: false,
  });
});

test('incorrect choices preserve progress without skipping solutions', () => {
  const s = initialState();
  assert.equal(act(s, 'attic').room, 0);
  assert.equal(act(s, 'insert').inserted, false);
  assert.deepEqual(act(act(s, 'bun'), 'cup').sequence, ['bun']);
  assert.equal(act(act(s, 'bun'), 'cup').breakfast, false);
  let dark = act(act(act(act(s, 'bun'), 'cake'), 'cup'), 'darkroom');
  dark = act(dark, 'takeplate');
  dark = act(act(dark, 'develop'), 'fix');
  assert.equal(dark.bath, 1);
  dark = act(dark, 'stop');
  assert.equal(dark.bath, 2);
  assert.equal(act(dark, 'develop').bath, 2);
  assert.equal(dark.plate, false);
});

test('the notebook only records discovered clues and an exposed plate is required', () => {
  let s = initialState();
  assert.equal(s.note, false);
  assert.equal(s.recipe, false);
  s = act(s, 'readnote');
  assert.equal(s.note, true);
  for (const action of ['bun', 'cake', 'cup', 'darkroom'] as const) s = act(s, action);
  for (const action of ['develop', 'stop', 'fix'] as const) s = act(s, action);
  assert.equal(s.plate, false);
  assert.equal(s.bath, 0);
  s = act(s, 'readrecipe');
  s = act(s, 'takeplate');
  s = act(s, 'breakfast');
  assert.equal(s.negative, true);
  assert.equal(s.recipe, true);
  assert.equal(s.note, true);
});

test('after development, darkroom hints guide the player to the newly opened attic', () => {
  let s = initialState();
  for (const action of ['bun', 'cake', 'cup', 'darkroom', 'takeplate', 'develop', 'stop'] as const)
    s = act(s, action);
  assert.equal(act(s, 'attic').room, 1);
  assert.match(hint(s, 2), /stjernebadet/);
  s = act(s, 'fix');
  assert.match(hint(s), /Trappen til højre er åben/);
  assert.match(hint(s, 2), /Til loftet/);
  assert.equal(act(s, 'attic').room, 2);
  assert.match(hint(act(s, 'attic'), 2), /vandret II/);
});
