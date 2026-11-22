import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import type { ModelTools } from './room-model';

export function textiles(t: ModelTools) {
  const wallpaper = new DynamicTexture(
    'woven botanical wallpaper',
    { width: 512, height: 512 },
    t.scene,
    true,
  );
  const c = wallpaper.getContext() as CanvasRenderingContext2D;
  c.fillStyle = '#31534c';
  c.fillRect(0, 0, 512, 512);
  c.strokeStyle = '#6c7960';
  c.fillStyle = '#5b7057';
  c.lineWidth = 1;
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < 6; x++) {
      const px = x * 100 + (y % 2) * 50,
        py = y * 100;
      sprig(c, px, py);
    }
  wallpaper.update();
  t.palette.wall.diffuseTexture = wallpaper;
  t.palette.wall.diffuseColor.set(0.85, 0.85, 0.85);
  const rug = t.material('woven heirloom rug', '#ffffff');
  const weave = new DynamicTexture('rug medallions', { width: 1024, height: 512 }, t.scene, true);
  const r = weave.getContext() as CanvasRenderingContext2D;
  r.fillStyle = '#632e38';
  r.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 5; i++) {
    r.strokeStyle = i % 2 ? '#b79c68' : '#314c4d';
    r.lineWidth = 5;
    r.strokeRect(12 + i * 10, 12 + i * 10, 1000 - i * 20, 488 - i * 20);
  }
  for (let x = 90; x < 1000; x += 120)
    for (let y = 90; y < 500; y += 90) {
      r.save();
      r.translate(x, y);
      r.scale(1, 0.7);
      r.rotate(Math.PI / 4);
      r.strokeStyle = '#a88661';
      r.lineWidth = 2;
      r.strokeRect(-23, -23, 46, 46);
      r.fillStyle = '#2b4244';
      r.fillRect(-8, -8, 16, 16);
      r.restore();
    }
  for (let i = 0; i < 512; i += 3) {
    r.fillStyle = '#ffffff08';
    r.fillRect(0, i, 1024, 1);
  }
  weave.update();
  rug.diffuseTexture = weave;
  return rug;
}

export function keepsakes(t: ModelTools, tall: boolean) {
  const { box, round, ball, palette: p } = t;
  const x = tall ? 0.7 : 1.4,
    y = tall ? 4.1 : 3;
  box('shelf of well-loved books', [2.8, 0.12, 0.6], [x, y, 2.2], p.wood);
  const bindings = [p.red, p.trim, p.cream, p.wood];
  for (let i = 0; i < 7; i++) {
    const h = 0.35 + (i % 3) * 0.12;
    box('clothbound book', [0.17, h, 0.32], [x - 1 + i * 0.2, y + h / 2, 2.15], bindings[i % 4]!);
    for (const offset of [-1, 1])
      box(
        'book spine gold tooling',
        [0.12, 0.02, 0.015],
        [x - 1 + i * 0.2, y + h / 2 + offset * h * 0.31, 1.98],
        p.gold,
      );
  }
  round('small pottery jug', 0.27, 0.4, [x + 0.9, y + 0.23, 2.15], p.cream);
  ball('jug shoulder', [0.33, 0.3, 0.33], [x + 0.9, y + 0.18, 2.15], p.cream);
}

function sprig(c: CanvasRenderingContext2D, px: number, py: number) {
  c.beginPath();
  c.moveTo(px, py - 34);
  c.quadraticCurveTo(px - 14, py, px, py + 34);
  c.stroke();
  for (const side of [-1, 1])
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.ellipse(px + side * 8, py - 18 + i * 16, 9, 3, side * 0.6, 0, Math.PI * 2);
      c.fill();
    }
}
