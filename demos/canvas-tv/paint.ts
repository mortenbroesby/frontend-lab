import { scenery, poster } from './scenery';
import { playback } from './playback';
import { rows, type Programme } from './catalogue';
import { selectedTitle, programmeIndex, type TVState } from './navigation';

import { rowTop, cardHeight, type View } from './layout';

type Context = CanvasRenderingContext2D;
function text(
  ctx: Context,
  value: string,
  x: number,
  y: number,
  size: number,
  colour = '#f4f6f5',
  weight = 400,
) {
  ctx.fillStyle = colour;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.fillText(value, x, y);
}
function hero(ctx: Context, programme: Programme, seconds: number) {
  scenery(ctx, programme, seconds);
  const shade = ctx.createLinearGradient(0, 0, 1100, 0);
  shade.addColorStop(0, '#141414');
  shade.addColorStop(0.5, '#141414b0');
  shade.addColorStop(1, '#14141400');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 1280, 720);
  const floor = ctx.createLinearGradient(0, 200, 0, 520);
  floor.addColorStop(0, '#14141400');
  floor.addColorStop(1, '#141414');
  ctx.fillStyle = floor;
  ctx.fillRect(0, 200, 1280, 520);
  text(ctx, 'REMOTE', 64, 53, 28, '#e50914', 900);
  text(ctx, 'A collection of imagined worlds', 228, 51, 15, '#c4c4c4');
  text(ctx, 'CANVAS ORIGINAL', 64, 120, 12, '#ddd', 700);
  text(ctx, programme.title, 60, 187, 60, '#fff', 800);
  text(ctx, programme.genre, 64, 224, 13, '#ddd', 600);
  text(ctx, programme.description, 64, 250, 17, '#ddd');
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(64, 270, 186, 42, 4);
  ctx.fill();
  text(ctx, '▶  Enter to play', 82, 297, 17, '#141414', 700);
  text(ctx, 'Procedural short films', 268, 296, 14, '#aaa');
}
function shelf(ctx: Context, state: TVState, view: View, rowIndex: number) {
  const row = rows[rowIndex];
  const y = rowTop(rowIndex) - view.scrollY;
  const height = cardHeight(rowIndex);
  text(ctx, row.title, 64, y - 12, 19, state.row === rowIndex ? '#fff' : '#b3b3b3', 600);
  ctx.save();
  ctx.beginPath();
  ctx.rect(50, y - 8, 1180, height + 14);
  ctx.clip();
  // Only paint the visible slice, including one card either side during transitions.
  const first = Math.floor(view.offsets[rowIndex] / 242) - 1;
  for (let index = first; index < first + 8; index++) {
    const programme = row.programmes[programmeIndex(index, row.programmes.length)];
    const x = 64 + index * 242 - view.offsets[rowIndex];
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, 224, height, 4);
    ctx.clip();
    ctx.drawImage(poster(programme), x, y, 224, height);
    const shadow = ctx.createLinearGradient(0, y + 40, 0, y + height);
    shadow.addColorStop(0, 'transparent');
    shadow.addColorStop(1, '#000b');
    ctx.fillStyle = shadow;
    ctx.fillRect(x, y, 224, height);
    text(ctx, programme.title, x + 14, y + height - 21, 18, '#fff', 600);
    ctx.restore();
    if (row.progress) {
      const progress = row.progress[programmeIndex(index, row.programmes.length)];
      ctx.fillStyle = '#555';
      ctx.fillRect(x + 12, y + height - 10, 200, 3);
      ctx.fillStyle = '#e50914';
      ctx.fillRect(x + 12, y + height - 10, 200 * progress, 3);
    }
  }
  ctx.restore();
}
export function paint(ctx: Context, state: TVState, view: View, seconds: number) {
  ctx.fillStyle = '#141414';
  ctx.fillRect(0, 0, 1280, 720);
  const programme = selectedTitle(state);
  if (state.playing) {
    playback(ctx, programme, seconds);
    return;
  }
  hero(ctx, programme, seconds);
  ctx.save();
  ctx.beginPath();
  ctx.rect(48, 340, 1188, 338);
  ctx.clip();
  rows.forEach((_, index) => {
    const y = rowTop(index) - view.scrollY;
    if (y + cardHeight(index) >= 340 && y <= 676) shelf(ctx, state, view, index);
  });
  ctx.beginPath();
  ctx.roundRect(view.x - 5, view.y - 5, 234, view.height + 10, 7);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.restore();
  text(
    ctx,
    `${programmeIndex(state.starts[state.row] + state.column, rows[state.row].programmes.length) + 1} / ${rows[state.row].programmes.length}`,
    1158,
    696,
    14,
    '#aaa',
  );
  text(ctx, `ROW ${state.row + 1} OF ${rows.length}`, 950, 696, 13, '#aaa');
  text(ctx, '↑ ↓ ← →  Browse      Enter  Play      Esc  Back', 64, 696, 14, '#aaa');
}
