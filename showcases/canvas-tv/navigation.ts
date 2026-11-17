import { rows } from './catalogue.ts';
export type TVState = { row: number; columns: number[]; detail: boolean };
export const initialState: TVState = { row: 0, columns: rows.map(() => 0), detail: false };
export function selectedTitle(state: TVState) {
  return rows[state.row].programmes[state.columns[state.row]];
}
export function navigate(state: TVState, key: string): TVState {
  if (key === 'Escape' || key === 'Backspace') return { ...state, detail: false };
  if (state.detail) return state;
  if (key === 'Enter') return { ...state, detail: true };
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
