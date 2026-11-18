import assert from 'node:assert/strict';
import test from 'node:test';
import { focusAction, focusKey, isFocusAction, slideDelta } from './focus.ts';

test('keyboard and remote share six bounded commands', () => {
  for (const action of ['up', 'down', 'left', 'right', 'select', 'back'] as const)
    assert.equal(focusAction(focusKey(action)), action);
  assert.equal(focusAction('Backspace'), 'back');
  assert.equal(focusAction('a'), undefined);
  assert.equal(isFocusAction('constructor'), false);
});
test('Back moves to the previous slide while OK keeps the current slide', () => {
  assert.equal(slideDelta('select'), 0);
  assert.equal(slideDelta('back'), -1);
  assert.equal(slideDelta('left'), -1);
  assert.equal(slideDelta('right'), 1);
});
