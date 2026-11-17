import type { Programme } from './catalogue';
import { subtitleOptions, type TVState } from './navigation';
import { scenery } from './scenery';

/** A silent, original animated short, drawn across the whole TV canvas. */
export function playback(
  ctx: CanvasRenderingContext2D,
  programme: Programme,
  seconds: number,
  state: TVState,
  overlay: number,
) {
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

  ctx.save();
  ctx.translate(0, 200 * (1 - overlay));
  captions(ctx, state.subtitles, elapsed);
  ctx.restore();
  if (overlay === 0) return;
  ctx.save();
  ctx.translate(0, 250 * (1 - overlay));
  playbackControls(ctx, programme.title, elapsed, state);
  ctx.restore();
}

function playbackControls(
  ctx: CanvasRenderingContext2D,
  title: string,
  elapsed: number,
  state: TVState,
) {
  const shade = ctx.createLinearGradient(0, 470, 0, 720);
  shade.addColorStop(0, 'transparent');
  shade.addColorStop(0.35, '#101010e8');
  shade.addColorStop(1, '#101010');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 470, 1280, 250);
  ctx.fillStyle = '#f5f5f5';
  ctx.font = '600 28px system-ui, sans-serif';
  ctx.fillText(title, 56, 534);
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillStyle = '#a3a3a3';
  ctx.fillText('GENERATED SCENE · DEMO SUBTITLES', 56, 562);
  ctx.textAlign = 'right';
  ctx.fillText(`0:${String(Math.floor(elapsed)).padStart(2, '0')} / 0:45`, 1224, 534);
  ctx.fillText('← → Choose · OK Apply · ↑ / Back Hide', 1224, 562);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff30';
  ctx.fillRect(56, 586, 1168, 3);
  ctx.fillStyle = '#e50914';
  ctx.fillRect(56, 586, (elapsed / 45) * 1168, 3);
  subtitleOptions.forEach((label, index) => {
    const x = 56 + index * 200;
    ctx.beginPath();
    ctx.roundRect(x, 614, 180, 56, 8);
    ctx.fillStyle = index === state.subtitleFocus ? '#f5f5f5' : '#303030';
    ctx.fill();
    ctx.fillStyle = index === state.subtitleFocus ? '#171717' : '#f5f5f5';
    ctx.font = '500 18px system-ui, sans-serif';
    ctx.fillText(`${index === state.subtitles ? '✓ ' : ''}${label}`, x + 20, 649);
  });
}

const captionLines = [
  [
    'A little further, beyond the ridge.',
    'The lights are leading us home.',
    'There is more to discover.',
  ],
  [
    'Lidt længere, på den anden side af bjerget.',
    'Lysene viser os hjem.',
    'Der er mere at opdage.',
  ],
];
function captions(ctx: CanvasRenderingContext2D, language: number, elapsed: number) {
  if (language === 0) return;
  const text = captionLines[language - 1][Math.floor(elapsed / 5) % 3];
  ctx.font = '500 26px system-ui, sans-serif';
  const width = ctx.measureText(text).width;
  ctx.fillStyle = '#000000cc';
  ctx.beginPath();
  ctx.roundRect(620 - width / 2, 416, width + 40, 48, 6);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText(text, 640, 449);
  ctx.textAlign = 'left';
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
