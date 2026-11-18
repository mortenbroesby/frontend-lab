import { rows } from './catalogue.ts';
import { playbackMachine } from './playback-machine.ts';

// Column is a screen position; each row keeps its own continuous scroll origin.
export type TVState = {
  row: number;
  column: number;
  starts: number[];
  playback: typeof playbackMachine.initialState;
  subtitles: number;
  subtitleFocus: number;
};
export const initialState: TVState = {
  row: 0,
  column: 0,
  starts: rows.map(() => 0),
  playback: playbackMachine.initialState,
  subtitles: 0,
  subtitleFocus: 0,
};
export function programmeIndex(position: number, length: number) {
  return ((position % length) + length) % length;
}
export function selectedTitle(state: TVState) {
  const programmes = rows[state.row].programmes;
  return programmes[programmeIndex(state.starts[state.row] + state.column, programmes.length)];
}
export function navigate(state: TVState, key: string): TVState {
  if (key === 'presentation-exit') return { ...state, playback: playbackMachine.initialState };
  const [playback] = playbackMachine.transition(state.playback, {
    type: key === 'Backspace' ? 'Escape' : key,
  });
  if (playback !== state.playback) return { ...state, playback };
  if (playback.value === 'controls') return subtitleNavigation(state, key);
  if (playback.value === 'watching') return state;
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

export const subtitleOptions = ['Off', 'English', 'Dansk'];
export function playbackHint(state: TVState) {
  if (state.playback.value === 'watching')
    return `Demo subtitles: ${subtitleOptions[state.subtitles]}. Controls hidden. ↓ / OK show controls · Back browse.`;
  return `Demo subtitles: ${subtitleOptions[state.subtitles]}. Selected option: ${subtitleOptions[state.subtitleFocus]}. ← → choose · OK apply · ↑ / Back hide.`;
}
function subtitleNavigation(state: TVState, key: string): TVState {
  if (key === 'Enter') return { ...state, subtitles: state.subtitleFocus };
  if (key === 'ArrowLeft') return { ...state, subtitleFocus: Math.max(0, state.subtitleFocus - 1) };
  if (key === 'ArrowRight')
    return {
      ...state,
      subtitleFocus: Math.min(subtitleOptions.length - 1, state.subtitleFocus + 1),
    };
  return state;
}
