export type Snapshot = { title: string; row: string; playing: boolean };
export function isCommand(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(value)
  );
}
export function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== 'object') return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.title === 'string' &&
    data.title.length <= 200 &&
    typeof data.row === 'string' &&
    data.row.length <= 200 &&
    typeof data.playing === 'boolean'
  );
}
