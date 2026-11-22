import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, act } from './game.ts';
import { reactionFor } from './reactions.ts';

test('feedback celebrates earned progress, not wrong or repeated choices', () => {
  let before = initialState();
  assert.equal(reactionFor(before, act(before, 'cake')), null);
  assert.deepEqual(reactionFor(before, act(before, 'readnote')), {
    object: 'note',
    kind: 'collect',
  });
  before = act(before, 'readnote');
  assert.equal(reactionFor(before, act(before, 'readnote')), null);
  assert.deepEqual(reactionFor(before, act(before, 'bun')), {
    object: 'cabinet',
    kind: 'progress',
  });
  before = act(act(before, 'bun'), 'cake');
  const complete = act(before, 'cup');
  assert.deepEqual(reactionFor(before, complete), { object: 'cabinet', kind: 'complete' });
  assert.equal(reactionFor(complete, act(complete, 'cup')), null);
  assert.equal(reactionFor(complete, act(complete, 'darkroom')), null);
  assert.equal(reactionFor(complete, initialState()), null);
});

test('later discoveries and completion point to their actual room objects', () => {
  const dark = { ...initialState(), room: 1, breakfast: true, negative: true, bath: 2 };
  assert.deepEqual(reactionFor(dark, act(dark, 'fix')), { object: 'fix', kind: 'complete' });
  const attic = { ...dark, room: 2, plate: true, inserted: true, horizontal: 1, vertical: 2 };
  assert.deepEqual(reactionFor(attic, act(attic, 'project')), {
    object: 'frame',
    kind: 'complete',
  });
  assert.equal(reactionFor(attic, { ...attic }), null);
});
