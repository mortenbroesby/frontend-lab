import { rows } from './catalogue.ts';

// Column is a screen position; each row keeps its own continuous scroll origin.
export type TVState = { row: number; column: number; starts: number[]; playing: boolean };
export const initialState: TVState = {
  row: 0,
  column: 0,
  starts: rows.map(() => 0),
  playing: false,
};
export function programmeIndex(position: number, length: number) {
  return ((position % length) + length) % length;
}
export function selectedTitle(state: TVState) {
  const programmes = rows[state.row].programmes;
  return programmes[programmeIndex(state.starts[state.row] + state.column, programmes.length)];
}
export function navigate(state: TVState, key: string): TVState {
  if (key === 'Escape' || key === 'Backspace') return { ...state, playing: false };
  if (state.playing) return state;
  if (key === 'Enter') return { ...state, playing: true };
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    return {
      ...state,
      row: Math.max(0, Math.min(rows.length - 1, state.row + (key === 'ArrowDown' ? 1 : -1))),
    };
  }
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return state;
  const direction = key === 'ArrowRight' ? 1 : -1;
  const column = state.column + direction;
  if (column >= 0 && column < 4) return { ...state, column };
  const starts = [...state.starts];
  starts[state.row] += direction;
  return { ...state, starts };
}
