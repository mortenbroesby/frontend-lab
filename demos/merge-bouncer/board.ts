import Phaser from 'phaser';
import { reviewStart, type Round } from './rules';

const ink = 0x0b0b19;
const mint = 0x70f7e9;
const amber = 0xffd783;
const crimson = 0xff92ba;
const pink = 0xf56bb5;
const grid = 0x534675;
const cssColor = (value: number) => '#' + value.toString(16).padStart(6, '0');

type Graphics = Phaser.GameObjects.Graphics;
type Label = Phaser.GameObjects.Text;
type RequestCard = Round['cards'][number];

function metrics(width: number, height: number) {
  const gutter = width < 460 ? 5 : 15;
  const laneWidth = (width - 2 * gutter) / 3;
  const entry = 125;
  const exit = height - 61;
  const yAt = (progress: number) => entry + progress * (exit - entry);
  return { gutter, laneWidth, yAt, zone: yAt(reviewStart), exit, width, height };
}
type Floor = ReturnType<typeof metrics>;

function drawFloor(g: Graphics, floor: Floor, selected: number) {
  const { width, height } = floor;
  g.clear().fillStyle(ink).fillRect(0, 0, width, height);
  for (let lane = 0; lane < 3; lane++) drawLane(g, floor, lane, lane === selected);
}

function drawDesks(g: Graphics, x: number, zone: number, screen: number) {
  // Cubicle desks face each aisle; a bright screen and a keyboard read from overhead.
  for (let deskY = 67; deskY < zone - 36; deskY += 84) {
    const deskX = x + 5 + 3 * Math.sin(deskY);
    g.fillStyle(0x28223d).fillRoundedRect(deskX, deskY, 19, 25, 6);
    g.fillStyle(0x47405d).fillRect(deskX, deskY + 22, 19, 2);
    g.fillStyle(0x0c0f20).fillRect(deskX + 2, deskY + 3, 15, 10);
    g.fillStyle(screen).fillRect(deskX + 4, deskY + 5, 11, 5);
    g.fillStyle(0x59516d).fillRect(deskX + 4, deskY + 16, 10, 3);
    g.fillStyle(0x443453).fillEllipse(deskX + 9, deskY + 30, 10, 7);
    g.lineStyle(2, 0x785268).strokeEllipse(deskX + 29, deskY + 17, 10, 7);
    g.fillStyle(0xe7ab89).fillCircle(deskX + 20, deskY + 11, 3);
  }
}

function drawLane(
  g: Graphics,
  { gutter, laneWidth, height, zone }: Floor,
  lane: number,
  selected: boolean,
) {
  const palette = selected
    ? { floor: 0x162238, zone: 0x19374a, rail: mint, screen: 0x377780 }
    : { floor: 0x161426, zone: 0x292035, rail: pink, screen: 0x644364 };
  const x = gutter + lane * laneWidth;
  const center = x + laneWidth / 2;
  g.fillStyle(palette.floor).fillRect(x + 2, 4, laneWidth - 4, height - 8);
  g.fillStyle(palette.zone).fillRect(x + 2, zone, laneWidth - 4, height - zone - 4);
  g.lineStyle(1, grid).strokeRoundedRect(x + 2, 4, laneWidth - 4, height - 8, 12);
  for (let y = 59; y < zone - 8; y += 32) {
    // Scuffed carpet and wandering footsteps between the cubicles.
    const footX = center + Math.sin(y / 29 + lane) * 9;
    g.fillStyle(0x393149).fillEllipse(footX - 3, y, 4, 6);
    g.fillStyle(0x332b41).fillEllipse(footX + 4, y + 7, 4, 6);
  }
  const rail = palette.rail;
  g.fillStyle(rail, 0.13).fillRect(x + 3, zone - 5, laneWidth - 6, 14);
  g.fillStyle(rail, 0.8).fillRect(x + 3, zone - 1, laneWidth - 6, 2);
  for (let mark = x + 6; mark < x + laneWidth - 11; mark += 14) {
    g.lineStyle(2, rail, 0.65).lineBetween(mark, zone + 7, mark + 5, zone + 2);
  }
  g.fillStyle(0x111021).fillRect(x + 3, 5, laneWidth - 6, 38);
  g.lineStyle(1, grid).lineBetween(x + 3, 43, x + laneWidth - 3, 43);
  drawDesks(g, x, zone, palette.screen);
}

// One pixel per cell keeps the plume, visor, ID badge and raised sword crisp at any lane width.
const knight = [
  '...........ppp...........',
  '.........pppppp..........',
  '........pppmmmp..........',
  '.......pppmm.............',
  '.........mmm.............',
  '........aaaaa...........w',
  '......aallllla.........ww',
  '......allwwlla........ws.',
  '.....alllllllla......ws..',
  '.....addcccccda.....ws...',
  '.....addrcccdda....ws....',
  '......adddddda....ws.....',
  '....aalllalalalaa.g......',
  '...alwllaalllllwagg......',
  '...allla.bbb.allaag......',
  '....adaabutubaaddd.......',
  '.....aaabuuubaa..........',
  '.......abbbbbaa..........',
  '.......ammmmma...........',
  '......aamm.mmaa..........',
  '......add...dda..........',
  '......ddd...ddd..........',
];
const armor: Record<string, number> = {
  p: 0xeb58ac,
  m: 0xa63280,
  a: 0x575778,
  l: 0xa9a8ce,
  w: 0xe7ffff,
  s: 0x72ffee,
  d: 0x292a48,
  c: 0x45caea,
  r: 0xbbffff,
  g: 0xffcf79,
  b: 0x48496a,
  u: 0xf3e3af,
  t: 0x69838c,
};

function knightTexture(scene: Phaser.Scene) {
  const texture = scene.textures.createCanvas('office-knight', 50, 44);
  if (!texture) return;
  const ctx = texture.context;
  knight.forEach((row, y) =>
    Array.from(row).forEach((cell, x) => {
      if (cell === '.') return;
      ctx.fillStyle = cssColor(armor[cell]);
      ctx.fillRect(2 * x, 2 * y, 2, 2);
    }),
  );
  texture.refresh();
}

function label(scene: Phaser.Scene, size: number, color: number, title = false) {
  return scene.add
    .text(0, 0, '', {
      fontFamily: title ? 'system-ui, sans-serif' : 'Menlo, Consolas, monospace',
      fontSize: size + 'px',
      fontStyle: title ? 'bold' : 'normal',
      color: cssColor(color),
    })
    .setResolution(Math.min(2, window.devicePixelRatio || 1))
    .setDepth(1);
}

function cardLabels(scene: Phaser.Scene) {
  return {
    title: label(scene, 14, 0xf7f5ff, true),
    size: label(scene, 11, 0xd1cfe6),
    signal: label(scene, 11, mint),
  };
}
type CardLabels = ReturnType<typeof cardLabels>;

function cardSignal(card: RequestCard) {
  if (card.verdict === 'clean') return { text: 'CLEAN PR', color: mint };
  if (card.verdict === 'bad') return { text: 'BAD PR', color: crimson };
  return card.green
    ? { text: 'Build passed', color: mint }
    : { text: 'Build failed', color: amber };
}

function drawCard(
  g: Graphics,
  labels: CardLabels,
  card: RequestCard,
  floor: Floor,
  selected: number,
) {
  const width = Math.min(floor.laneWidth - 10, 226);
  const x = floor.gutter + (card.lane + 0.5) * floor.laneWidth - width / 2;
  const y = floor.yAt(card.progress);
  const top = y - 78;
  const active = card.lane === selected && card.progress >= reviewStart;
  drawCardFrame(g, x, top, width, active);
  positionCardLabels(labels, card, x, top, width);
}

function drawCardFrame(g: Graphics, x: number, top: number, width: number, active: boolean) {
  const y = top + 78;
  const { border, fill, weight } = active
    ? { border: mint, fill: 0x1a384c, weight: 2 }
    : { border: 0x837ba8, fill: 0x23243d, weight: 1 };
  if (active) g.fillStyle(mint, 0.17).fillRect(x - 3, top - 3, width + 6, 84);
  g.fillStyle(0x04040d, 0.6).fillRoundedRect(x + 2, top + 4, width, 78, 2);
  g.fillStyle(fill).fillRoundedRect(x, top, width, 78, 2);
  g.lineStyle(weight, border).strokeRoundedRect(x, top, width, 78, 2);
  g.fillStyle(border).fillTriangle(
    x + width / 2 - 4,
    y,
    x + width / 2 + 4,
    y,
    x + width / 2,
    y + 4,
  );
}

function positionCardLabels(
  labels: CardLabels,
  card: RequestCard,
  x: number,
  top: number,
  width: number,
) {
  labels.title.setPosition(x + 5, top + 4).setText(card.title);
  if (labels.title.style.wordWrapWidth !== width - 10) {
    labels.title.setFontSize(width < 125 ? 12 : 14).setWordWrapWidth(width - 10, true);
  }
  labels.size.setPosition(x + 5, top + 46).setText(card.lines + ' lines');
  const status = cardSignal(card);
  labels.signal.setPosition(x + 5, top + 61).setText(status.text);
  if (labels.signal.style.color !== cssColor(status.color))
    labels.signal.setColor(cssColor(status.color));
}

// Rubber-duck debugging is a two-person job on this shift.
function drawSquire(g: Graphics, x: number, y: number) {
  g.fillStyle(0x100f21, 0.6).fillEllipse(x, y + 7, 23, 7);
  g.fillStyle(0xffcf69)
    .fillEllipse(x, y + 2, 19, 12)
    .fillCircle(x + 4, y - 5, 6);
  g.fillStyle(0xffec9c).fillEllipse(x - 2, y + 1, 9, 6);
  g.fillStyle(0xff9973).fillEllipse(x + 10, y - 4, 7, 3);
  g.fillStyle(ink).fillCircle(x + 6, y - 6, 1.4);
  g.fillStyle(0xf07fce).fillTriangle(x - 10, y + 2, x - 12, y - 4, x - 5, y);
}
class Depot extends Phaser.Scene {
  private readonly getRound: () => Round;
  constructor(getRound: () => Round) {
    super();
    this.getRound = getRound;
  }
  private floorArt!: Graphics;
  private movingArt!: Graphics;
  private reviewer!: Phaser.GameObjects.Image;
  private headers: Label[] = [];
  private signals: Label[] = [];
  private zoneLabel!: Label;
  private captions = new Map<number, CardLabels>();
  private floor!: Floor;
  private floorKey = '';

  create() {
    this.floorArt = this.add.graphics();
    this.movingArt = this.add.graphics();
    knightTexture(this);
    this.reviewer = this.add.image(0, 0, 'office-knight').setDepth(2);
    for (let i = 0; i < 3; i++) {
      this.headers.push(
        label(this, 12, 0xe0e6ff)
          .setText('LANE 0' + (i + 1))
          .setOrigin(0.5, 0),
      );
      this.signals.push(label(this, 10, amber).setOrigin(0.5, 0));
    }
    this.zoneLabel = label(this, 10, mint).setOrigin(0, 0.5);
  }

  private layout(lane: number) {
    const { width, height } = this.scale;
    const key = `${width}/${height}/${lane}`;
    if (this.floorKey !== key) {
      this.floor = metrics(width, height);
      drawFloor(this.floorArt, this.floor, lane);
      this.floorKey = key;
    }
    return this.floor;
  }

  update() {
    const round = this.getRound();
    const floor = this.layout(round.lane);
    const g = this.movingArt.clear();
    const { height } = floor;
    this.headers.forEach((head, lane) => {
      const center = floor.gutter + (lane + 0.5) * floor.laneWidth;
      head.setPosition(center, 8);
      const next = round.pending.find((item) => item.lane === lane);
      this.signals[lane]
        .setPosition(center, 26)
        .setText(next ? 'TEST IN ' + Math.max(0, Math.ceil(next.due - round.elapsed)) + 's' : '');
    });
    this.zoneLabel.setPosition(floor.gutter + 8, floor.zone + 16).setText('GATE');
    const reviewerX = Math.round(floor.gutter + (round.lane + 0.5) * floor.laneWidth);
    g.fillStyle(pink, 0.13).fillEllipse(reviewerX, height - 18, 47, 12);
    this.reviewer.setPosition(reviewerX, height - 28);
    drawSquire(g, reviewerX - 27, height - 19);
    this.drawRequests(round, floor);
  }

  private drawRequests(round: Round, floor: Floor) {
    for (const card of round.cards) {
      const captions = this.captions.get(card.id) ?? cardLabels(this);
      this.captions.set(card.id, captions);
      drawCard(this.movingArt, captions, card, floor, round.lane);
    }
    this.removeDepartedCards(round.cards);
  }

  private removeDepartedCards(cards: RequestCard[]) {
    for (const [id, captions] of this.captions) {
      if (cards.some((card) => card.id === id)) continue;
      for (const text of Object.values(captions)) text.destroy();
      this.captions.delete(id);
    }
  }
}

export function mountBoard(parent: HTMLElement, getRound: () => Round) {
  const game = new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    width: Math.max(1, parent.clientWidth),
    height: Math.max(1, parent.clientHeight),
    backgroundColor: ink,
    scene: new Depot(getRound),
    banner: false,
    autoFocus: false,
    audio: { noAudio: true },
    input: { keyboard: false, mouse: false, touch: false, gamepad: false },
  });
  const resize = new ResizeObserver(() => {
    if (game.isBooted && parent.clientWidth && parent.clientHeight)
      game.scale.resize(parent.clientWidth, parent.clientHeight);
  });
  resize.observe(parent);
  return () => {
    resize.disconnect();
    game.destroy(true);
  };
}
