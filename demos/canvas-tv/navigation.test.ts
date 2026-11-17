import assert from 'node:assert/strict';
import test from 'node:test';
import { initialState, navigate, selectedTitle } from './navigation.ts';

test('vertical movement keeps the visible column after independently scrolling rows', () => {
  let state = initialState;
  for (let i = 0; i < 9; i++) state = navigate(state, 'ArrowRight');
  const upper = selectedTitle(state);
  const slot = state.column;
  state = navigate(state, 'ArrowDown');
  assert.equal(state.column, slot);
  assert.equal(state.row, 1);
  assert.equal(state.starts[1], 0);
  state = navigate(state, 'ArrowUp');
  assert.equal(selectedTitle(state), upper);
  assert.equal(state.column, slot);
  assert.deepEqual(navigate(state, 'ArrowUp'), state);
});

test('rows loop in both directions without resetting the scroll position', () => {
  let state = navigate(initialState, 'ArrowLeft');
  assert.equal(selectedTitle(state).title, 'Elsewhere');
  assert.equal(state.starts[0], -1);
  state = navigate(state, 'ArrowRight');
  assert.equal(selectedTitle(state).title, 'The Quiet Orbit');
  for (let i = 0; i < 120; i++) state = navigate(state, 'ArrowRight');
  assert.equal(selectedTitle(state).title, 'The Quiet Orbit');
  assert.equal(state.column, 3);
  assert.equal(state.starts[0], 117);
  for (let i = 0; i < 120; i++) state = navigate(state, 'ArrowLeft');
  assert.equal(selectedTitle(state).title, 'The Quiet Orbit');
});

test('starting playback freezes catalogue navigation and Back restores selection', () => {
  const selected = navigate(initialState, 'ArrowRight');
  const playback = navigate(selected, 'Enter');
  assert.equal(playback.playing, true);
  assert.equal(selectedTitle(playback).title, selectedTitle(selected).title);
  assert.deepEqual(navigate(playback, 'ArrowDown'), playback);
  assert.deepEqual(navigate(playback, 'Escape'), selected);
  assert.deepEqual(navigate(initialState, 'Escape'), initialState);
});
