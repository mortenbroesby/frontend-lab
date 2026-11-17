import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { frequency, stepDuration, toggleStep, initialPattern, songs } from './pattern.ts';
test('concert pitch and sixteenth-note timing', () => {
  assert.equal(frequency(69), 440);
  assert.equal(stepDuration(120), 0.125);
});
test('editing a step preserves the original loop', () => {
  const edited = toggleStep(initialPattern, 0, 0);
  assert.equal(edited[0][0], !initialPattern[0][0]);
  assert.equal(initialPattern[0][0], true);
  assert.deepEqual(edited[1], initialPattern[1]);
});

test('three original tunes have complete, distinct sixteen-step arrangements', () => {
  assert.equal(songs.length, 3);
  assert.equal(new Set(songs.map((song) => song.name)).size, 3);
  assert.equal(new Set(songs.map((song) => song.melody.join(','))).size, 3);
  for (const song of songs) {
    assert.equal(song.melody.length, 16);
    assert.equal(song.bass.length, 4);
    assert.equal(song.pattern.length, 3);
    for (const voice of song.pattern) {
      assert.equal(voice.length, 16);
      assert.ok(voice.some(Boolean));
    }
    const edited = toggleStep(song.pattern, 0, 0);
    assert.notEqual(edited[0][0], song.pattern[0][0]);
  }
});

test('octave transposition doubles or halves pitch', () => {
  assert.equal(frequency(69, 12), 880);
  assert.equal(frequency(69, -12), 220);
  assert.equal(frequency(69, 0), 440);
});
