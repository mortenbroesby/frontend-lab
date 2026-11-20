import assert from 'node:assert/strict';
import test from 'node:test';
import { act, initialRound, step } from './rules.ts';

test('early and wrong-lane inputs cannot merge a PR', () => {
  const r = initialRound();
  act(r, 'merge');
  assert.equal(r.merges, 0);
  step(r, 3.24);
  act(r, 'right');
  act(r, 'merge');
  assert.equal(r.cards[0].id, 1);
  act(r, 'left');
  act(r, 'merge');
  assert.equal(r.merges, 1);
});

test('test return is announced, stays in lane and has a definitive verdict', () => {
  const r = initialRound();
  step(r, 6.48);
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
  step(r, 14.05);
  act(r, 'bounce');
  act(r, 'right');
  act(r, 'right');
  act(r, 'merge');
  step(r, 1.1736);
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
  play(3.2550000000000003, 1, 'merge');
  play(6.495, 0, 'test');
  play(10.455, 2, 'merge');
  play(11.895000000000001, 0, 'bounce');
  play(14.055, 1, 'bounce');
  play(18.375, 1, 'merge');
  play(21.255, 2, 'bounce');
  play(24.495, 0, 'merge');
  play(27.735, 1, 'bounce');
  play(32.055, 0, 'merge');
  assert.equal(r.status, 'won');
  assert.equal(r.merges, 5);
  assert.equal(r.regressions, 0);
  step(r, 90);
  act(r, 'left');
  assert.equal(r.elapsed, 32.055);
  assert.equal(r.lane, 0);
});

test('a missed clean PR earns nothing and the third missed bad PR ends play immediately', () => {
  const r = initialRound();
  step(r, 4.32);
  assert.equal(r.regressions, 0);
  assert.equal(r.merges, 0);
  step(r, 100);
  assert.equal(r.regressions, 3);
  assert.equal(r.status, 'lost');
  assert.equal(r.elapsed, 22.32);
  act(r, 'extend');
  assert.equal(r.extended, false);
});

test('extending near the deadline buys ten seconds exactly once', () => {
  const r = initialRound();
  for (let i = 0; i < 44; i++) {
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
  assert.equal(r.elapsed, 55);
  assert.equal(r.remaining, 0);
  assert.equal(r.status, 'lost');
});

test('merging a bad PR costs one regression without scoring', () => {
  const r = initialRound();
  step(r, 6.48);
  act(r, 'left');
  act(r, 'merge');
  assert.equal(r.regressions, 1);
  assert.equal(r.merges, 0);
  step(r, 2);
  assert.equal(r.regressions, 1);
});

test('the duck earns one scout, waits for a target, then reveals it across lanes', () => {
  const r = initialRound();
  step(r, 3.24);
  act(r, 'bounce');
  assert.equal(r.duckReady, false);
  step(r, 3.24);
  act(r, 'left');
  act(r, 'bounce');
  assert.equal(r.duckReady, true);
  act(r, 'scout');
  assert.equal(r.duckReady, true);
  step(r, 0.8);
  act(r, 'scout');
  assert.equal(r.cards[0].verdict, 'clean');
  assert.equal(r.duckReady, false);
  assert.equal(r.lane, 0);
  assert.equal(r.merges, 0);
});

test('successive catches build score, testing preserves the chain and a miss breaks it', () => {
  const r = initialRound();
  step(r, 3.25);
  act(r, 'merge');
  step(r, 3.25);
  act(r, 'left');
  act(r, 'bounce');
  assert.equal(r.chain, 2);
  assert.equal(r.score, 300);
  assert.equal(r.impact?.kind, 'block');
  step(r, 4);
  act(r, 'right');
  act(r, 'right');
  act(r, 'test');
  assert.equal(r.chain, 2);
  step(r, 6);
  assert.equal(r.chain, 0);
  assert.equal(r.score, 300);
});
