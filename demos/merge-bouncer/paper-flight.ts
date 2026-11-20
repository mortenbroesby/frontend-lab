import type Phaser from 'phaser';

import { chewPaper, shredderInset, shredderHeightAboveGate } from './shredder';
import type { ImpactKind } from './rules';

// All destinations use playfield coordinates, including on high-density screens.
export function dispatchPaper(
  scene: Phaser.Scene,
  kind: ImpactKind,
  x: number,
  gate: number,
  width: number,
) {
  const dest = destination(kind, x, gate, width);
  if (!dest) return;
  const slip = scene.add.graphics().fillStyle(0xffefbe).fillRoundedRect(-33, -15, 66, 30, 2);
  slip.lineStyle(1, 0x645343).strokeRoundedRect(-30, -12, 60, 24, 2);
  const print = scene.add
    .text(0, 0, dest.text, {
      fontFamily: 'monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: dest.color,
    })
    .setOrigin(0.5);
  const paper = scene.add.container(x, gate, [slip, print]).setDepth(2);
  scene.tweens.add({ targets: paper, angle: -10, scaleX: 1.18, scaleY: 0.7, duration: 75 });
  scene.tweens.add({
    targets: paper,
    x: dest.x,
    y: dest.y,
    angle: dest.angle,
    scaleX: 0.42,
    scaleY: 0.35,
    alpha: 0.15,
    delay: 90,
    duration: 310,
    ease: 'Quad.easeIn',
    onComplete: () => {
      paper.destroy();
      if (kind === 'block' || kind === 'reject') chewPaper(scene, dest.x, dest.y);
    },
  });
}

function destination(kind: ImpactKind, x: number, gate: number, width: number) {
  const side = x < width / 2 ? -1 : 1;
  const destinations = {
    block: {
      x: side < 0 ? shredderInset : width - shredderInset,
      y: gate - shredderHeightAboveGate,
      angle: side * 130,
      text: 'BOUNCED',
      color: '#ae3a24',
    },
    test: { x, y: 25, angle: -22, text: 'LAB', color: '#6351a5' },
    merge: { x, y: gate + 22, angle: -7, text: 'SHIPPED', color: '#19705c' },
  };
  const routes: Partial<Record<ImpactKind, keyof typeof destinations>> = {
    reject: 'block',
    block: 'block',
    merge: 'merge',
    test: 'test',
  };
  const route = routes[kind];
  return route && destinations[route];
}
