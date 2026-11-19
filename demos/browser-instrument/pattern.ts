export const initialPattern = ['1111111111111111', '1010101010101010', '1010101010101011'].map(
  (row) => [...row].map((step) => step === '1'),
);
export const frequency = (note: number, semitones = 0) => 440 * 2 ** ((note + semitones - 69) / 12);
export const stepDuration = (tempo: number) => 60 / tempo / 4;
export function toggleStep(pattern: boolean[][], row: number, step: number) {
  return pattern.map((line, index) =>
    index === row ? line.map((on, column) => (column === step ? !on : on)) : line,
  );
}

// Four bars per tune; the editable sixteen-step gate repeats over each bar.
export const songs = [
  {
    name: 'Midnight Circuit',
    mix: { tempo: 132, cutoff: 6200, echo: 0.18, levels: [0.7, 0.65, 0.7] },
    voice: {
      lead: 'square' as const,
      sustain: 0.85,
      arpeggio: 0.035,
      bassLength: 1.3,
      octave: 12,
      softness: 1,
    },
    melody: [
      76, 76, 79, 83, 81, 79, 76, 74, 76, 79, 83, 86, 83, 79, 78, 74, 72, 76, 79, 83, 81, 79, 76,
      72, 74, 76, 79, 81, 79, 76, 74, 72, 74, 74, 78, 81, 83, 81, 78, 74, 78, 81, 86, 85, 83, 81,
      78, 74, 71, 75, 78, 83, 81, 78, 75, 71, 75, 78, 83, 87, 86, 83, 78, 75,
    ],
    bass: [40, 36, 38, 35],
    thirds: [3, 4, 4, 4],
    pattern: initialPattern,
  },
  {
    name: 'Neon Coast',
    mix: { tempo: 86, cutoff: 2600, echo: 0.24, levels: [0.5, 0.95, 0.5] },
    voice: {
      lead: 'sine' as const,
      sustain: 3.6,
      arpeggio: 0,
      bassLength: 3.8,
      octave: 0,
      softness: 0.45,
    },
    melody: [
      76, 76, 76, 76, 76, 76, 71, 71, 71, 71, 74, 74, 74, 74, 74, 74, 72, 72, 72, 72, 72, 72, 67,
      67, 67, 67, 71, 71, 71, 71, 71, 71, 74, 74, 74, 74, 74, 74, 69, 69, 69, 69, 72, 72, 72, 72,
      72, 72, 71, 71, 71, 71, 71, 71, 66, 66, 66, 66, 69, 69, 69, 69, 69, 69,
    ],
    bass: [33, 29, 31, 28],
    thirds: [3, 4, 4, 3],
    pattern: ['1000001000100000', '1000001010000010', '1000100010101000'].map((row) =>
      [...row].map((step) => step === '1'),
    ),
  },
  {
    name: 'Moon Arcade',
    mix: { tempo: 118, cutoff: 4600, echo: 0.3, levels: [0.65, 0.7, 0.6] },
    voice: {
      lead: 'triangle' as const,
      sustain: 1.4,
      arpeggio: 0.015,
      bassLength: 1.8,
      octave: 12,
      softness: 0.8,
    },
    melody: [
      74, 77, 81, 86, 84, 81, 77, 74, 77, 81, 84, 81, 79, 77, 76, 74, 70, 74, 77, 82, 81, 77, 74,
      70, 74, 77, 81, 79, 77, 74, 72, 70, 72, 76, 79, 84, 86, 84, 79, 76, 79, 84, 88, 86, 84, 79,
      76, 72, 69, 73, 76, 81, 83, 81, 76, 73, 76, 81, 85, 88, 86, 85, 81, 73,
    ],
    bass: [38, 34, 36, 33],
    thirds: [3, 4, 4, 4],
    pattern: ['1111111011111110', '1010101010101011', '1010101010101011'].map((row) =>
      [...row].map((step) => step === '1'),
    ),
  },
];
