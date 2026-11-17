import { rows, type Programme } from './catalogue';
import { selectedTitle, type TVState } from './navigation';

type Context = CanvasRenderingContext2D;
export type View = { offsets: number[]; x: number; y: number };
export function targetView(state: TVState): View {
  const offsets = state.columns.map((column) => Math.max(0, column - 3) * 242);
  return {
    offsets,
    x: 64 + state.columns[state.row] * 242 - offsets[state.row],
    y: 406 + state.row * 150,
  };
}
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
function panel(
  ctx: Context,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  colour: string,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = colour;
  ctx.fill();
}
// Deterministic original landscapes: no image requests or copyrighted programme art.
function landscape(
  ctx: Context,
  programme: Programme,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const { hue, seed } = programme;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.translate(x, y);
  ctx.scale(width / 800, height / 450);
  const sky = ctx.createLinearGradient(0, 0, 800, 450);
  sky.addColorStop(0, `hsl(${hue} 45% 9%)`);
  sky.addColorStop(1, `hsl(${hue} 52% 46%)`);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 800, 450);
  const halo = ctx.createRadialGradient(530, 140, 8, 530, 140, 210);
  halo.addColorStop(0, `hsla(${hue + 30} 80% 85% / .45)`);
  halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 800, 450);
  ctx.fillStyle = `hsl(${hue + 35} 60% 82%)`;
  ctx.beginPath();
  ctx.arc(530, 140, 40 + seed * 2, 0, Math.PI * 2);
  ctx.fill();
  for (let layer = 0; layer < 4; layer++) {
    ctx.beginPath();
    ctx.moveTo(0, 450);
    for (let step = 0; step <= 40; step++) {
      const px = step * 20;
      const py =
        250 + layer * 48 + Math.sin(px / (75 + seed * 8) + layer * 2 + seed) * (45 - layer * 7);
      ctx.lineTo(px, py);
    }
    ctx.lineTo(800, 450);
    ctx.fillStyle = `hsl(${hue + layer * 8} 30% ${22 - layer * 5}%)`;
    ctx.fill();
  }
  ctx.restore();
}
function hero(ctx: Context, programme: Programme) {
  landscape(ctx, programme, 440, 0, 840, 380);
  const shade = ctx.createLinearGradient(380, 0, 1150, 0);
  shade.addColorStop(0, '#080e12');
  shade.addColorStop(1, '#080e1200');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, 1280, 380);
  const floor = ctx.createLinearGradient(0, 210, 0, 380);
  floor.addColorStop(0, '#080e1200');
  floor.addColorStop(1, '#080e12');
  ctx.fillStyle = floor;
  ctx.fillRect(0, 210, 1280, 170);
  text(ctx, 'REMOTE', 64, 58, 24, '#b9f7d1', 700);
  text(ctx, 'A CANVAS ORIGINAL', 64, 132, 13, '#b9f7d1', 600);
  text(ctx, programme.title, 60, 200, 58, '#f4f6f5', 650);
  text(ctx, programme.genre, 64, 235, 13, '#a8b9bc', 500);
  text(ctx, programme.description, 64, 278, 18, '#c6d1d1');
}
function shelf(ctx: Context, state: TVState, view: View, rowIndex: number) {
  const row = rows[rowIndex];
  const y = 406 + rowIndex * 150;
  text(ctx, row.title, 64, y - 20, 19, state.row === rowIndex ? '#f4f6f5' : '#82949a', 600);
  ctx.save();
  ctx.beginPath();
  ctx.rect(50, y - 8, 1180, 136);
  ctx.clip();
  row.programmes.forEach((programme, index) => {
    const x = 64 + index * 242 - view.offsets[rowIndex];
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, 224, 100, 7);
    ctx.clip();
    landscape(ctx, programme, x, y, 224, 100);
    const shadow = ctx.createLinearGradient(0, y + 30, 0, y + 100);
    shadow.addColorStop(0, 'transparent');
    shadow.addColorStop(1, '#000b');
    ctx.fillStyle = shadow;
    ctx.fillRect(x, y, 224, 100);
    text(ctx, programme.title, x + 14, y + 80, 18, '#fff', 600);
    ctx.restore();
  });
  ctx.restore();
}
function details(ctx: Context, programme: Programme) {
  panel(ctx, 64, 352, 1152, 300, 12, '#142128');
  text(ctx, 'TITLE DETAILS', 96, 401, 14, '#b9f7d1', 600);
  text(ctx, programme.title, 96, 455, 36, '#f4f6f5', 600);
  text(ctx, programme.genre, 96, 495, 16, '#a8b9bc');
  text(ctx, 'Fictional catalogue. No video is streamed.', 96, 546, 20, '#c6d1d1');
  panel(ctx, 92, 576, 220, 48, 6, '#b9f7d1');
  text(ctx, 'Esc  /  Back to browse', 110, 607, 17, '#092018', 600);
}
export function paint(ctx: Context, state: TVState, view: View) {
  ctx.fillStyle = '#080e12';
  ctx.fillRect(0, 0, 1280, 720);
  const programme = selectedTitle(state);
  hero(ctx, programme);
  if (state.detail) {
    details(ctx, programme);
  } else {
    rows.forEach((_, index) => shelf(ctx, state, view, index));
    ctx.beginPath();
    ctx.roundRect(view.x - 5, view.y - 5, 234, 110, 10);
    ctx.strokeStyle = '#b9f7d1';
    ctx.lineWidth = 3;
    ctx.stroke();
    text(
      ctx,
      `${state.columns[state.row] + 1} / ${rows[state.row].programmes.length}`,
      1158,
      696,
      14,
      '#a8b9bc',
    );
  }
  text(ctx, '↑ ↓ ← →  Navigate      Enter  Details      Esc  Back', 64, 696, 14, '#a8b9bc');
}
