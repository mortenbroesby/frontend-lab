export const initialPattern = [
  [
    true,
    false,
    true,
    true,
    false,
    true,
    true,
    false,
    true,
    false,
    true,
    true,
    false,
    true,
    false,
    true,
  ],
  [
    true,
    false,
    false,
    true,
    true,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
    true,
    false,
    true,
    false,
  ],
  [
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
  ],
];
const melody = [72, 79, 84, 79, 75, 79, 82, 79, 70, 77, 82, 77, 68, 75, 79, 82];
export const frequency = (note: number, semitones = 0) => 440 * 2 ** ((note + semitones - 69) / 12);
export const stepDuration = (tempo: number) => 60 / tempo / 4;
export function toggleStep(pattern: boolean[][], row: number, step: number) {
  return pattern.map((line, index) =>
    index === row ? line.map((on, column) => (column === step ? !on : on)) : line,
  );
}

export const songs = [
  { name: 'Midnight Circuit', melody, bass: [36, 39, 34, 32], pattern: initialPattern },
  {
    name: 'Neon Coast',
    melody: [76, 79, 83, 86, 83, 79, 76, 74, 72, 76, 79, 83, 81, 79, 76, 74],
    bass: [40, 36, 43, 38],
    pattern: ['1010101110101011', '1000100010101000', '1010101010101010'].map((row) =>
      [...row].map((step) => step === '1'),
    ),
  },
  {
    name: 'Moon Arcade',
    melody: [69, 72, 76, 81, 79, 76, 72, 76, 65, 69, 72, 77, 76, 72, 71, 68],
    bass: [33, 29, 36, 40],
    pattern: ['1001101010011010', '1010010010100100', '1000101010001011'].map((row) =>
      [...row].map((step) => step === '1'),
    ),
  },
];
