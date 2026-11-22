import { test } from 'node:test';
import assert from 'node:assert/strict';
import { birthdayMelody, nisseMelody } from './birthday-melody.ts';

test('the birthday rendition contains a complete finite melody, distinct from the nisse reward', () => {
  assert.ok(birthdayMelody.length > 30, 'the verified birthday melody must be present');
  for (const [pitch, beats] of [...birthdayMelody, ...nisseMelody]) {
    assert.ok(Number.isInteger(pitch) && pitch >= 0 && pitch < 100);
    assert.ok(Number.isFinite(beats) && beats > 0);
  }
  const seconds = birthdayMelody.reduce((sum, [, beats]) => sum + (beats * 60) / 84, 0);
  assert.ok(seconds > 15 && seconds < 65);
  assert.notDeepEqual(birthdayMelody, nisseMelody);
});
