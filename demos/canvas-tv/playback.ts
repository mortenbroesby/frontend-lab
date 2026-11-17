import type { Programme } from './catalogue';
import { scenery } from './scenery';

/** A silent, original animated short, drawn across the whole TV canvas. */
export function playback(ctx: CanvasRenderingContext2D, programme: Programme, seconds: number) {
  const elapsed = seconds % 45;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (45 - elapsed) / 1.5);
  const zoom = 1.08 + Math.sin(elapsed * 0.08) * 0.04;
  ctx.translate(640, 360);
  ctx.scale(zoom, zoom);
  ctx.translate(-640 + Math.sin(elapsed * 0.1) * 20, -360);
  scenery(ctx, programme, elapsed * 4);
  lights(ctx, programme.hue, elapsed);
  ctx.restore();

  const shade = ctx.createLinearGradient(0, 530, 0, 720);
  shade.addColorStop(0, 'transparent');
  shade.addColorStop(1, '#04080dd9');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 530, 1280, 190);
  ctx.fillStyle = '#f4f6f5';
  ctx.font = '500 30px system-ui, sans-serif';
  ctx.fillText(programme.title, 56, 623);
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillStyle = '#b9d3cb';
  ctx.fillText('CANVAS ANIMATION · 45 SECOND LOOP', 56, 653);
  ctx.textAlign = 'right';
  ctx.fillText('Esc / Back to browse', 1224, 653);
  ctx.fillText(`0:${String(Math.floor(elapsed)).padStart(2, '0')} / 0:45`, 1224, 623);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff30';
  ctx.fillRect(56, 681, 1168, 3);
  ctx.fillStyle = '#b9f7d1';
  ctx.fillRect(56, 681, (elapsed / 45) * 1168, 3);
}

function lights(ctx: CanvasRenderingContext2D, hue: number, seconds: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 24; i++) {
    const x = ((i * 137 + seconds * (18 + (i % 5))) % 1440) - 80;
    const y = 340 + Math.sin(seconds * 0.3 + i * 1.7) * 95 + (i % 4) * 60;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
    glow.addColorStop(0, `hsla(${hue + 70} 80% 85% / .65)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(x - 10, y - 10, 20, 20);
  }
  ctx.restore();
}
