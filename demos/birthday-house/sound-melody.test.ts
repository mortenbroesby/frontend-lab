import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMelodyPlayer } from './sound-melody.ts';
import type { MelodyNote } from './birthday-melody.ts';

function recording() {
  const calls: { pitch: number; at: number; duration: number }[] = [];
  const player = createMelodyPlayer(() => ({
    tone(pitch, at, duration) {
      calls.push({ pitch, at, duration });
    },
  }));
  return { calls, player };
}
test('long melodies stream within a short horizon instead of exhausting the voice cap', () => {
  const { calls, player } = recording();
  const score: MelodyNote[] = Array.from({ length: 100 }, () => [74, 0.5] as const);
  player.start(score, 0.1);
  assert.equal(player.tick(0), true);
  assert.ok(calls.length < 5);
  assert.ok(calls.every((note) => note.at < 0.5));
  let maximum = 0;
  for (let now = 0.2; now < 42; now += 0.2) {
    player.tick(now);
    maximum = Math.max(
      maximum,
      calls.filter((note) => note.at <= now && note.at + note.duration > now).length,
    );
  }
  assert.equal(calls.filter((note) => note.pitch > 500).length, 100);
  assert.ok(maximum < 12);
  assert.equal(player.tick(45), false);
});
test('clear cancels queued notes and a late tick does not cause a catch-up burst', () => {
  const { calls, player } = recording();
  player.start(
    [
      [74, 1],
      [77, 1],
      [81, 1],
    ],
    0.1,
  );
  player.tick(0);
  const before = calls.length;
  player.tick(30);
  assert.ok(calls.length - before <= 2);
  assert.ok(calls.slice(before).every((note) => note.at >= 30));
  player.clear();
  const cancelled = calls.length;
  assert.equal(player.tick(31), false);
  assert.equal(calls.length, cancelled);
});
