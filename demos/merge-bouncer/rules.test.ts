import assert from 'node:assert/strict';
import test from 'node:test';
import { act, initialRound, step } from './rules.ts';

test('early and wrong-lane inputs cannot merge a PR', () => {
  const r = initialRound();
  act(r, 'merge');
  assert.equal(r.merges, 0);
  step(r, 4.5);
  act(r, 'right');
  act(r, 'merge');
  assert.equal(r.cards[0].id, 1);
  act(r, 'left');
  act(r, 'merge');
  assert.equal(r.merges, 1);
});

test('test return is announced, stays in lane and has a definitive verdict', () => {
  const r = initialRound();
  step(r, 9);
  act(r, 'left');
  act(r, 'test');
  const { due, lane } = r.pending[0];
  assert.equal(lane, 0);
  assert.equal(
    r.cards.some((c) => c.id === 2),
    false,
  );
  step(r, due - r.elapsed);
  const card = r.cards.find((c) => c.id === 2);
  assert.equal(card?.lane, lane);
  assert.equal(card?.verdict, 'bad');
  assert.equal(r.pending.length, 0);
});

test('two simultaneous arrivals force a choice even with perfect timing', () => {
  const r = initialRound();
  step(r, 19.5);
  act(r, 'bounce');
  act(r, 'right');
  act(r, 'right');
  act(r, 'merge');
  step(r, 1.63);
  assert.equal(r.merges, 0);
  assert.equal(r.regressions, 1);
  assert.equal(
    r.cards.some((c) => c.id === 4 || c.id === 5),
    false,
  );
});

test('a full release can be won without guessing the ambiguous typo', () => {
  const r = initialRound();
  const play = (time: number, lane: number, decision: 'merge' | 'test' | 'bounce') => {
    step(r, time - r.elapsed);
    while (r.lane !== lane) act(r, lane < r.lane ? 'left' : 'right');
    act(r, decision);
  };
  play(4.5, 1, 'merge');
  play(9, 0, 'test');
  play(14.5, 2, 'merge');
  play(16.5, 0, 'bounce');
  play(19.5, 1, 'bounce');
  play(25.5, 1, 'merge');
  play(29.5, 2, 'bounce');
  play(34, 0, 'merge');
  play(38.5, 1, 'bounce');
  play(44.5, 0, 'merge');
  assert.equal(r.status, 'won');
  assert.equal(r.merges, 5);
  assert.equal(r.regressions, 0);
  step(r, 90);
  act(r, 'left');
  assert.equal(r.elapsed, 44.5);
  assert.equal(r.lane, 0);
});

test('a missed clean PR earns nothing and the third missed bad PR ends play immediately', () => {
  const r = initialRound();
  step(r, 6);
  assert.equal(r.regressions, 0);
  assert.equal(r.merges, 0);
  step(r, 100);
  assert.equal(r.regressions, 3);
  assert.equal(r.status, 'lost');
  assert.equal(r.elapsed, 31);
  act(r, 'extend');
  assert.equal(r.extended, false);
});

test('extending near the deadline buys ten seconds exactly once', () => {
  const r = initialRound();
  for (let i = 0; i < 59; i++) {
    step(r, 1);
    const card = r.cards.find((c) => c.progress >= 0.75 && [2, 4, 7, 9, 13].includes(c.id));
    if (card) {
      while (r.lane !== card.lane) act(r, card.lane < r.lane ? 'left' : 'right');
      act(r, 'bounce');
    }
  }
  assert.equal(r.remaining, 1);
  act(r, 'extend');
  act(r, 'extend');
  assert.equal(r.remaining, 11);
  step(r, 30);
  assert.equal(r.elapsed, 70);
  assert.equal(r.remaining, 0);
  assert.equal(r.status, 'lost');
});

test('merging a bad PR costs one regression without scoring', () => {
  const r = initialRound();
  step(r, 9);
  act(r, 'left');
  act(r, 'merge');
  assert.equal(r.regressions, 1);
  assert.equal(r.merges, 0);
  step(r, 2);
  assert.equal(r.regressions, 1);
});
