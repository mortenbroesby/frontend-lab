import type { MelodyNote } from './birthday-melody';
import type { createVoices } from './sound-voices';
const frequency = (pitch: number) => 440 * 2 ** ((pitch - 69) / 12);
const beatSeconds = 60 / 72;

/** Schedule only a short horizon, keeping long songs below the synthesis voice cap. */
export function createMelodyPlayer(getVoices: () => Pick<ReturnType<typeof createVoices>, 'tone'>) {
  let notes: readonly MelodyNote[] = [];
  let cursor = 0;
  let nextAt = 0;
  let endsAt = 0;
  return {
    start(score: readonly MelodyNote[], at: number) {
      notes = score;
      cursor = 0;
      nextAt = at;
      endsAt = at;
    },
    clear() {
      notes = [];
      cursor = 0;
      endsAt = 0;
    },
    tick(now: number) {
      if (cursor < notes.length && nextAt < now - 0.5) nextAt = now + 0.08;
      while (cursor < notes.length && nextAt < now + 0.5) {
        const [pitch, beats] = notes[cursor]!;
        const duration = beats * beatSeconds;
        const synth = getVoices();
        if (pitch > 0) {
          synth.tone(frequency(pitch), nextAt, Math.max(0.35, duration * 1.45), 0.072, -0.08);
          if (cursor % 8 === 0) synth.tone(frequency(pitch - 24), nextAt, 3, 0.018, 0.2, 'pad');
        }
        endsAt = nextAt + Math.max(duration, 3.5);
        nextAt += duration;
        cursor++;
      }
      return cursor < notes.length || now < endsAt;
    },
  };
}
