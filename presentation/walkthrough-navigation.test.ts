import assert from 'node:assert/strict';
import test from 'node:test';
import { walkthroughAction } from './walkthrough-navigation.ts';

test('demo controls hand back to slides at either boundary and never consume Next slide', () => {
  const state = { index: -1, total: 4, label: 'Ready', playing: false, message: '' };
  assert.equal(walkthroughAction('back', state), null);
  assert.equal(walkthroughAction('right', state), 'next');
  assert.equal(walkthroughAction('back', { ...state, index: 0 }), null);
  assert.equal(walkthroughAction('back', { ...state, index: 1 }), 'back');
  assert.equal(walkthroughAction('right', { ...state, index: 3 }), null);
  assert.equal(walkthroughAction('next-slide', { ...state, index: 2 }), null);
  assert.equal(walkthroughAction('demo-play', state), 'play');
  assert.equal(walkthroughAction('demo-stop', state), 'stop');
});
