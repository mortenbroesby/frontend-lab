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
    melody: [
      81, 76, 81, 84, 83, 81, 79, 76, 81, 84, 88, 86, 84, 83, 81, 79, 77, 81, 84, 88, 86, 84, 81,
      77, 81, 84, 89, 88, 86, 84, 81, 77, 79, 83, 86, 91, 89, 86, 83, 79, 83, 86, 88, 86, 84, 83,
      81, 79, 76, 80, 83, 88, 86, 83, 80, 76, 80, 83, 88, 92, 91, 88, 83, 80,
    ],
    bass: [33, 29, 31, 28],
    thirds: [3, 4, 4, 4],
    pattern: ['1110111011101111', '1010101110101010', '1010101010101011'].map((row) =>
      [...row].map((step) => step === '1'),
    ),
  },
  {
    name: 'Moon Arcade',
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
