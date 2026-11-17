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
export const melody = [72, 79, 84, 79, 75, 79, 82, 79, 70, 77, 82, 77, 68, 75, 79, 82];
export const frequency = (note: number) => 440 * 2 ** ((note - 69) / 12);
export const stepDuration = (tempo: number) => 60 / tempo / 4;
export function toggleStep(pattern: boolean[][], row: number, step: number) {
  return pattern.map((line, index) =>
    index === row ? line.map((on, column) => (column === step ? !on : on)) : line,
  );
}
