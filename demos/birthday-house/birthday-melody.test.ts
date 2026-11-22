import { test } from 'node:test';
import assert from 'node:assert/strict';
import { birthdayMelody } from './birthday-melody.ts';

test('the birthday rendition contains a complete finite melody', () => {
  assert.ok(birthdayMelody.length > 30, 'the verified birthday melody must be present');
  for (const [pitch, beats] of birthdayMelody) {
    assert.ok(Number.isInteger(pitch) && pitch >= 0 && pitch < 100);
    assert.ok(Number.isFinite(beats) && beats > 0);
  }
  const seconds = birthdayMelody.reduce((sum, [, beats]) => sum + (beats * 60) / 72, 0);
  assert.ok(seconds > 15 && seconds < 65);
});
