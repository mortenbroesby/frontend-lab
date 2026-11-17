import { rows } from './catalogue.ts';
export type TVState = { row: number; columns: number[]; playing: boolean };
export const initialState: TVState = { row: 0, columns: rows.map(() => 0), playing: false };
export function selectedTitle(state: TVState) {
  return rows[state.row].programmes[state.columns[state.row]];
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
  const columns = [...state.columns];
  columns[state.row] = Math.max(
    0,
    Math.min(
      rows[state.row].programmes.length - 1,
      columns[state.row] + (key === 'ArrowRight' ? 1 : -1),
    ),
  );
  return { ...state, columns };
}
