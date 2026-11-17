import { rows } from './catalogue.ts';
import type { TVState } from './navigation.ts';

export type View = {
  offsets: number[];
  x: number;
  y: number;
  scrollY: number;
  height: number;
  overlay: number;
};
export function cardHeight(row: number) {
  return rows[row].progress ? 174 : 126;
}
export function rowTop(row: number) {
  let top = 374;
  for (let i = 0; i < row; i++) top += cardHeight(i) + 44;
  return top;
}
export function targetView(state: TVState): View {
  const height = cardHeight(state.row);
  const top = rowTop(state.row);
  const scrollY = Math.max(0, top + height - 670);
  return {
    overlay: Number(state.playback.value === 'controls'),
    offsets: state.starts.map((start) => start * 242),
    x: 64 + state.column * 242,
    y: top - scrollY,
    scrollY,
    height,
  };
}
