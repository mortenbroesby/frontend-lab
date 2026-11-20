import type Phaser from 'phaser';

// Brass paper-eaters sit on either end of the review rail.
export function drawShredder(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x181725).fillRoundedRect(x - 19, y - 15, 38, 35, 7);
  g.fillStyle(0x91613b).fillRoundedRect(x - 18, y - 17, 36, 34, 6);
  g.fillStyle(0xf2ca86).fillRoundedRect(x - 17, y - 19, 34, 33, 5);
  g.fillStyle(0x38414a).fillRoundedRect(x - 14, y - 4, 28, 12, 3);
  for (const eye of [-7, 7]) {
    g.fillStyle(0xffefd1).fillCircle(x + eye, y - 11, 5);
    g.fillStyle(0x272336).fillCircle(x + eye + 1, y - 10, 2.5);
  }
  for (let tooth = -10; tooth <= 10; tooth += 5) {
    g.fillStyle(0xcad8cb).fillTriangle(x + tooth - 2, y - 4, x + tooth + 2, y - 4, x + tooth, y);
  }
  g.fillStyle(0xc58949).fillRect(x - 10, y + 10, 20, 2);
}

export function chewPaper(scene: Phaser.Scene, x: number, y: number) {
  // A few bent strips, drawn as one object and discarded together.
  const strips = scene.add
    .graphics()
    .setPosition(x, y + 5)
    .setDepth(3);
  for (let i = -2; i <= 2; i++) {
    const dx = i * 5;
    strips
      .lineStyle(2, i % 2 === 0 ? 0xffebbb : 0xde9d9d)
      .beginPath()
      .moveTo(dx, 0)
      .lineTo(dx + 2, 4)
      .lineTo(dx - 1, 8)
      .strokePath();
  }
  scene.tweens.add({
    targets: strips,
    y: y + 24,
    scaleX: 1.25,
    alpha: 0,
    duration: 340,
    onComplete: () => strips.destroy(),
  });
}

export const shredderInset = 20;
export const shredderHeightAboveGate = 18;
