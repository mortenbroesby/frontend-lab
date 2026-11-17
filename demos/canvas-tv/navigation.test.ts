import assert from 'node:assert/strict';
import test from 'node:test';
import { targetView } from './layout.ts';
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
  assert.equal(playback.playback.value, 'controls');
  assert.equal(selectedTitle(playback).title, selectedTitle(selected).title);
  assert.deepEqual(navigate(playback, 'ArrowDown'), playback);
  assert.deepEqual(navigate(navigate(playback, 'Escape'), 'Escape'), selected);
  assert.deepEqual(navigate(initialState, 'Escape'), initialState);
});

test('all twelve rows stay reachable and visible, including the taller shelf', () => {
  let state = navigate(initialState, 'ArrowRight');
  for (let row = 0; row < 12; row++) {
    assert.equal(state.row, row);
    assert.equal(state.column, 1);
    const view = targetView(state);
    assert.ok(view.y >= 374);
    assert.ok(view.y + view.height <= 670);
    if (row === 2) assert.equal(view.height, 174);
    state = navigate(state, 'ArrowDown');
  }
  assert.equal(state.row, 11);
  for (let row = 11; row > 0; row--) state = navigate(state, 'ArrowUp');
  assert.equal(targetView(state).scrollY, 0);
});

test('playback arrows choose subtitles without moving the catalogue; OK applies them', () => {
  const playing = navigate(initialState, 'Enter');
  const english = navigate(playing, 'ArrowRight');
  assert.equal(english.subtitleFocus, 1);
  assert.equal(english.subtitles, 0);
  const applied = navigate(english, 'Enter');
  assert.equal(applied.subtitles, 1);
  assert.equal(selectedTitle(applied), selectedTitle(initialState));
  assert.equal(navigate(navigate(applied, 'ArrowRight'), 'ArrowRight').subtitleFocus, 2);
  assert.equal(navigate(navigate(applied, 'ArrowLeft'), 'Enter').subtitles, 0);
  assert.equal(navigate(applied, 'Escape').playback.value, 'watching');
});

test('Back and Up dismiss playback controls; Down or OK reopen without changing subtitles', () => {
  const playing = navigate(navigate(navigate(initialState, 'Enter'), 'ArrowRight'), 'Enter');
  const hidden = navigate(playing, 'Escape');
  assert.equal(hidden.playback.value, 'watching');
  assert.equal(hidden.subtitles, 1);
  assert.deepEqual(navigate(playing, 'ArrowUp'), hidden);
  assert.deepEqual(navigate(hidden, 'ArrowUp'), hidden);
  assert.deepEqual(navigate(hidden, 'ArrowRight'), hidden);
  assert.deepEqual(navigate(hidden, 'ArrowDown'), playing);
  assert.deepEqual(navigate(hidden, 'Enter'), playing);
  assert.equal(navigate(hidden, 'Backspace').playback.value, 'browsing');
  assert.equal(targetView(hidden).overlay, 0);
  assert.equal(targetView(playing).overlay, 1);
});
