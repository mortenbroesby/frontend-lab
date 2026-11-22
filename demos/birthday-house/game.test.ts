import { test } from 'node:test';
import assert from 'node:assert/strict';
import { currentLanguage, selectLanguage } from './language.ts';
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
  assert.equal(act(s, 'mirror2').plate, false);
  s = act(s, 'takeplate');
  for (const action of [
    'mirror0',
    'mirror0',
    'mirror0',
    'mirror1',
    'mirror1',
    'mirror1',
    'mirror2',
  ] as const)
    s = act(s, action);
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
    mirrors: [0, 0, 0],
    nisseGift: false,
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
  dark = act(dark, 'mirror2');
  assert.equal(dark.plate, false);
  assert.deepEqual(dark.mirrors, [0, 0, 1]);
  dark = act(dark, 'mirror0');
  assert.deepEqual(dark.mirrors, [1, 0, 1]);
  assert.equal(dark.plate, false);
});

test('the notebook only records discovered clues and an exposed plate is required', () => {
  let s = initialState();
  assert.equal(s.note, false);
  assert.equal(s.recipe, false);
  s = act(s, 'readnote');
  assert.equal(s.note, true);
  for (const action of ['bun', 'cake', 'cup', 'darkroom'] as const) s = act(s, action);
  for (const action of ['mirror0', 'mirror1', 'mirror2'] as const) s = act(s, action);
  assert.equal(s.plate, false);
  assert.deepEqual(s.mirrors, [0, 0, 0]);
  s = act(s, 'readrecipe');
  s = act(s, 'takeplate');
  s = act(s, 'breakfast');
  assert.equal(s.negative, true);
  assert.equal(s.recipe, true);
  assert.equal(s.note, true);
});

test('after development, darkroom hints guide the player to the newly opened attic', () => {
  let s = initialState();
  for (const action of [
    'bun',
    'cake',
    'cup',
    'darkroom',
    'takeplate',
    'mirror0',
    'mirror0',
    'mirror0',
    'mirror1',
    'mirror1',
    'mirror1',
  ] as const)
    s = act(s, action);
  assert.equal(act(s, 'attic').room, 1);
  assert.match(hint(s, 2), /Spejl 3/);
  s = act(s, 'mirror2');
  assert.match(hint(s), /Trappen til højre er åben/);
  assert.match(hint(s, 2), /Til loftet/);
  assert.equal(act(s, 'attic').room, 2);
  assert.match(hint(act(s, 'attic'), 2), /vandret II/);
});

test('the optional cup reward never gates the journey and resets with a new game', () => {
  const s = initialState();
  const rewarded = act(s, 'nissegift');
  assert.equal(rewarded.nisseGift, true);
  assert.equal(rewarded.breakfast, false);
  assert.equal(rewarded.plate, false);
  assert.equal(act(rewarded, 'attic').room, 0);
  assert.equal(initialState().nisseGift, false);
});

test('puzzle hints follow the selected language without resetting progress', () => {
  const previous = currentLanguage();
  const room = initialState();
  try {
    selectLanguage('en');
    assert.equal(hint(room, 2), 'Touch the buns, then the cake, then the coffee cup.');
    selectLanguage('da');
    assert.equal(hint(room, 2), 'Rør ved bollerne, så kagen og til sidst kaffekoppen.');
  } finally {
    selectLanguage(previous);
  }
});
