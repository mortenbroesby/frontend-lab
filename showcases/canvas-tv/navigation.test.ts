import assert from 'node:assert/strict';
import test from 'node:test';
import { initialState, navigate, selectedTitle } from './navigation.ts';

test('remote navigation clamps edges and remembers the column per row', () => {
  assert.deepEqual(navigate(initialState, 'ArrowLeft'), initialState);
  let state = navigate(navigate(initialState, 'ArrowRight'), 'ArrowRight');
  state = navigate(state, 'ArrowDown');
  assert.equal(state.columns[1], 0);
  state = navigate(state, 'ArrowUp');
  assert.equal(state.columns[0], 2);
  for (let i = 0; i < 20; i++) state = navigate(state, 'ArrowRight');
  assert.equal(state.columns[0], 5);
});

test('opening details freezes catalogue navigation and Back restores selection', () => {
  const selected = navigate(initialState, 'ArrowRight');
  const detail = navigate(selected, 'Enter');
  assert.equal(detail.detail, true);
  assert.equal(selectedTitle(detail).title, selectedTitle(selected).title);
  assert.deepEqual(navigate(detail, 'ArrowDown'), detail);
  assert.deepEqual(navigate(detail, 'Escape'), selected);
  assert.deepEqual(navigate(initialState, 'Escape'), initialState);
});
