import type { Flight } from './engine';

const WIDTH = 960;
const HEIGHT = 600;

function stars(ctx: CanvasRenderingContext2D) {
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = i % 4 === 0 ? '#c5d8f0' : '#53667f';
    ctx.beginPath();
    ctx.arc(
      (((i * 15731 + i * i * 789) % 997) / 997) * WIDTH,
      (((i * 23131 + i * i * 193) % 991) / 991) * 440,
      i % 4 === 0 ? 1.4 : 0.7,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}

function landscape(ctx: CanvasRenderingContext2D) {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#080f23');
  sky.addColorStop(1, '#1c2940');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  stars(ctx);
  // A quiet planet and distant ridges; the foreground collision surface is flat.
  ctx.fillStyle = '#547a87';
  ctx.beginPath();
  ctx.arc(800, 105, 37, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0e182a';
  ctx.beginPath();
  ctx.arc(818, 91, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#26344b';
  ctx.beginPath();
  ctx.moveTo(0, 510);
  for (let x = 0; x <= WIDTH; x += 60)
    ctx.lineTo(x, 445 - Math.sin(x * 0.018) * 32 - Math.cos(x * 0.043) * 20);
  ctx.lineTo(WIDTH, 600);
  ctx.lineTo(0, 600);
  ctx.fill();
  ctx.fillStyle = '#101b2c';
  ctx.fillRect(0, 510, WIDTH, 90);
  ctx.strokeStyle = '#40516b';
  ctx.beginPath();
  ctx.moveTo(0, 510);
  ctx.lineTo(WIDTH, 510);
  ctx.stroke();
  for (let i = 0; i < 18; i++) {
    ctx.strokeStyle = '#28374b';
    ctx.beginPath();
    ctx.ellipse((i * 91) % WIDTH, 532 + ((i * 19) % 60), 7 + (i % 15), 3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#b7f67b';
  ctx.fillRect(610, 507, 140, 6);
  ctx.fillRect(610, 493, 3, 17);
  ctx.fillRect(747, 493, 3, 17);
  ctx.font = '12px ui-monospace, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TRANQUILITY / 01', 680, 548);
}

function exhaust(ctx: CanvasRenderingContext2D, time: number, reduced: boolean) {
  const flicker = reduced ? 0 : Math.sin(time * 0.05) * 5;
  ctx.fillStyle = '#f7b45e';
  ctx.beginPath();
  ctx.moveTo(-6, 12);
  ctx.lineTo(0, 36 + flicker);
  ctx.lineTo(6, 12);
  ctx.fill();
  ctx.fillStyle = '#fff1b6';
  ctx.beginPath();
  ctx.moveTo(-3, 12);
  ctx.lineTo(0, 25 + flicker);
  ctx.lineTo(3, 12);
  ctx.fill();
}

function spacecraft(ctx: CanvasRenderingContext2D, flight: Flight, time: number, reduced: boolean) {
  ctx.save();
  ctx.translate(flight.x, flight.y);
  ctx.rotate(flight.angle);
  if (flight.burning) exhaust(ctx, time, reduced);
  ctx.strokeStyle = flight.outcome === 2 ? '#fb927e' : '#b7f67b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-9, 6);
  ctx.lineTo(-16, 18);
  ctx.lineTo(-21, 18);
  ctx.moveTo(9, 6);
  ctx.lineTo(16, 18);
  ctx.lineTo(21, 18);
  ctx.stroke();
  ctx.fillStyle = flight.outcome === 2 ? '#a96560' : '#dce6ed';
  ctx.beginPath();
  ctx.moveTo(-11, 10);
  ctx.lineTo(-11, -8);
  ctx.lineTo(-6, -17);
  ctx.lineTo(6, -17);
  ctx.lineTo(11, -8);
  ctx.lineTo(11, 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#21394a';
  ctx.fillRect(-6, -8, 12, 8);
  ctx.fillStyle = '#90e4de';
  ctx.fillRect(-4, -6, 8, 3);
  ctx.restore();
}

export function paint(canvas: HTMLCanvasElement, flight: Flight, time: number, reduced: boolean) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio, 2);
  const width = Math.round(canvas.clientWidth * dpr);
  const height = Math.round((width * HEIGHT) / WIDTH);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(width / WIDTH, 0, 0, height / HEIGHT, 0, 0);
  landscape(ctx);
  ctx.setLineDash([3, 7]);
  ctx.strokeStyle = '#75879d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(flight.x, flight.y + 40);
  ctx.lineTo(flight.x, 501);
  ctx.stroke();
  ctx.setLineDash([]);
  spacecraft(ctx, flight, time, reduced);
}
