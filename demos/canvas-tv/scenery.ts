import type { Programme } from './catalogue';

type Context = CanvasRenderingContext2D;

function ridge(x: number, seed: number, layer: number) {
  return (
    Math.sin(x * 0.009 + seed) * 58 +
    Math.sin(x * 0.021 + layer) * 27 +
    Math.sin(x * 0.047 + seed * 3) * 10
  );
}
function mountains(ctx: Context, programme: Programme, seconds: number) {
  for (let layer = 0; layer < 6; layer++) {
    const base = 245 + layer * 66;
    const travel = seconds * (3 + layer * 2);
    const points = Array.from({ length: 163 }, (_, i) => {
      const x = i * 8 - 8;
      return [x, base + ridge(x + travel, programme.seed, layer) * (1 - layer * 0.08)];
    });
    ctx.beginPath();
    ctx.moveTo(-8, 720);
    for (const [x, y] of points) ctx.lineTo(x, y);
    ctx.lineTo(1288, 720);
    ctx.fillStyle = `hsl(${programme.hue + layer * 5} 32% ${33 - layer * 5}%)`;
    ctx.fill();
    ctx.beginPath();
    for (const [x, y] of points) ctx.lineTo(x, y);
    ctx.strokeStyle = `hsla(${programme.hue + 25} 60% 85% / ${0.32 - layer * 0.04})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
function atmosphere(ctx: Context, hue: number, seconds: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let band = 0; band < 3; band++) {
    const x = 620 + Math.sin(seconds * 0.12 + band * 2) * 270;
    const y = 270 + band * 90;
    const mist = ctx.createRadialGradient(x, y, 10, x, y, 450);
    mist.addColorStop(0, `hsla(${hue + 30} 60% 80% / .10)`);
    mist.addColorStop(1, 'transparent');
    ctx.fillStyle = mist;
    ctx.fillRect(0, 0, 1280, 720);
  }
  ctx.restore();
}
/** Original procedural panorama. Time changes parallax and light, not the terrain seed. */
export function scenery(ctx: Context, programme: Programme, seconds: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, `hsl(${programme.hue + 35} 40% 8%)`);
  sky.addColorStop(0.45, `hsl(${programme.hue} 42% 39%)`);
  sky.addColorStop(1, '#080e12');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1280, 720);
  for (let i = 0; i < 65; i++) {
    const x = (i * 173.7 + programme.seed * 37) % 1280;
    const y = (i * 61.3) % 230;
    ctx.fillStyle = `rgba(235,255,245,${0.2 + (Math.sin(seconds * 0.6 + i) + 1) * 0.2})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  const glow = ctx.createRadialGradient(940, 150, 10, 940, 150, 340);
  glow.addColorStop(0, `hsla(${programme.hue + 40} 80% 85% / .5)`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1280, 720);
  ctx.beginPath();
  ctx.arc(940, 150, 57, 0, Math.PI * 2);
  ctx.fillStyle = '#dceee3';
  ctx.fill();
  mountains(ctx, programme, seconds);
  atmosphere(ctx, programme.hue, seconds);
}

const posters = new Map<number, HTMLCanvasElement>();
export function poster(programme: Programme) {
  const existing = posters.get(programme.seed);
  if (existing) return existing;
  const canvas = document.createElement('canvas');
  canvas.width = 448;
  canvas.height = 252;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.scale(448 / 1280, 252 / 720);
  scenery(ctx, programme, 0);
  posters.set(programme.seed, canvas);
  return canvas;
}
