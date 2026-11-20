import Phaser from 'phaser';
import knightUrl from './office-knight.png';
import { drawShredder, shredderInset, shredderHeightAboveGate } from './shredder';
import { dispatchPaper } from './paper-flight';
import depotUrl from './depot.jpg';
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
  const entry = Math.min(125, height * 0.39);
  const exit = height - Math.min(62, height * 0.15);
  const yAt = (progress: number) => entry + progress * (exit - entry);
  return { gutter, laneWidth, yAt, zone: yAt(reviewStart), exit, width, height };
}
type Floor = ReturnType<typeof metrics>;

function drawFloor(g: Graphics, floor: Floor, selected: number) {
  g.clear();
  for (let lane = 0; lane < 3; lane++) drawLane(g, floor, lane, lane === selected);
  for (const x of [shredderInset, floor.width - shredderInset])
    drawShredder(g, x, floor.zone - shredderHeightAboveGate);
}

function drawLane(
  g: Graphics,
  { gutter, laneWidth, height, zone }: Floor,
  lane: number,
  selected: boolean,
) {
  const x = gutter + lane * laneWidth;
  const rail = selected ? 0xffdf8a : 0xc69860;
  if (selected) g.fillStyle(mint, 0.05).fillRect(x, 0, laneWidth, height);
  g.fillStyle(rail, 0.09).fillRoundedRect(x + 3, zone, laneWidth - 6, height - zone, 6);
  g.fillStyle(rail, 0.13).fillRect(x + 3, zone - 5, laneWidth - 6, 14);
  g.fillStyle(rail, 0.8).fillRect(x + 3, zone - 1, laneWidth - 6, 2);
  for (let mark = x + 6; mark < x + laneWidth - 11; mark += 14) {
    g.lineStyle(2, rail, 0.65).lineBetween(mark, zone + 7, mark + 5, zone + 2);
  }
  g.fillStyle(0x111021, 0.74).fillRect(x + 3, 5, laneWidth - 6, 38);
  g.lineStyle(1, grid).lineBetween(x + 3, 43, x + laneWidth - 3, 43);
}

function label(scene: Phaser.Scene, size: number, color: number, title = false) {
  return scene.add
    .text(0, 0, '', {
      fontFamily: title ? 'system-ui, sans-serif' : 'Menlo, Consolas, monospace',
      fontSize: size + 'px',
      fontStyle: title ? 'bold' : 'normal',
      color: cssColor(color),
    })
    .setDepth(1);
}

function cardLabels(scene: Phaser.Scene) {
  return {
    title: label(scene, 14, 0x211c30, true),
    size: label(scene, 11, 0x453d48),
    signal: label(scene, 11, mint),
  };
}
type CardLabels = ReturnType<typeof cardLabels>;

function cardSignal(card: RequestCard) {
  if (card.verdict === 'clean') return { text: 'CLEAN PR', color: 0x186048 };
  if (card.verdict === 'bad') return { text: 'BAD PR', color: 0x943619 };
  return card.green
    ? { text: 'Build passed', color: 0x186048 }
    : { text: 'Build failed', color: 0x943619 };
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
  if (card.id % 3 === 2) {
    // Someone in accounts put their espresso on the paperwork again.
    g.lineStyle(2, 0x9e663e, 0.23)
      .beginPath()
      .arc(x + width - 21, top + 35, 11, 0.45, 5.8)
      .strokePath();
    g.fillStyle(0xa4754b, 0.24).fillEllipse(x + width - 12, top + 46, 4, 3);
  }
  positionCardLabels(labels, card, x, top, width);
}

function drawCardFrame(g: Graphics, x: number, top: number, width: number, active: boolean) {
  const edge = active ? 0xffbd64 : 0xa78c67;
  g.fillStyle(ink, 0.6).fillRoundedRect(x + 3, top + 5, width, 78, 4);
  g.fillStyle(0xffefc8).fillRoundedRect(x, top, width, 78, 4);
  g.lineStyle(active ? 3 : 1, edge).strokeRoundedRect(x, top, width, 78, 4);
  g.lineStyle(1, edge, 0.55).lineBetween(x + 8, top + 40, x + width - 9, top + 40);
  g.fillStyle(0xc3a47d).fillTriangle(
    x + width - 13,
    top + 78,
    x + width,
    top + 65,
    x + width,
    top + 78,
  );
  g.lineStyle(2, 0x586178).strokeRoundedRect(x + width - 18, top - 3, 5, 12, 2);
}

function positionCardLabels(
  labels: CardLabels,
  card: RequestCard,
  x: number,
  top: number,
  width: number,
) {
  labels.title.setPosition(x + 8, top + 4).setText(card.title);
  if (labels.title.style.wordWrapWidth !== width - 10) {
    labels.title.setFontSize(width < 125 ? 12 : 14).setWordWrapWidth(width - 10, true);
  }
  labels.size.setPosition(x + 8, top + 46).setText('+' + card.lines + ' lines');
  const status = cardSignal(card);
  labels.signal.setPosition(x + 8, top + 61).setText(status.text);
  if (labels.signal.style.color !== cssColor(status.color))
    labels.signal.setColor(cssColor(status.color));
}

class Depot extends Phaser.Scene {
  private readonly getRound: () => Round;
  private readonly ready: () => void;
  private readonly reduceMotion: () => boolean;
  constructor(getRound: () => Round, reduceMotion: () => boolean, ready: () => void) {
    super();
    this.getRound = getRound;
    this.ready = ready;
    this.reduceMotion = reduceMotion;
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

  private backdrop!: Phaser.GameObjects.Image;
  private result!: Label;
  private lastImpact?: Round['impact'];
  private readonly systemMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  private get reduced() {
    return this.systemMotion.matches || this.reduceMotion();
  }

  preload() {
    this.load.image('depot', depotUrl);
    this.load.image('office-knight', knightUrl);
  }

  create() {
    this.backdrop = this.add.image(0, 0, 'depot').setOrigin(0).setAlpha(0.62);
    this.floorArt = this.add.graphics();
    this.movingArt = this.add.graphics();

    this.reviewer = this.add.image(0, 0, 'office-knight').setDisplaySize(76, 76).setDepth(2);
    this.result = label(this, 17, mint, true).setOrigin(0.5).setDepth(3).setVisible(false);
    for (let i = 0; i < 3; i++) {
      this.headers.push(
        label(this, 12, 0xe0e6ff)
          .setText('LANE 0' + (i + 1))
          .setOrigin(0.5, 0),
      );
      this.signals.push(label(this, 10, amber).setOrigin(0.5, 0));
    }
    this.zoneLabel = label(this, 10, mint).setOrigin(0, 0.5);
    this.ready();
  }

  private layout(lane: number) {
    const { clientWidth: width, clientHeight: height } = this.game.canvas;
    const zoom = this.scale.width / width;
    this.cameras.main.setOrigin(0, 0).setZoom(zoom);
    this.backdrop.setDisplaySize(width, height);
    const key = `${width}/${height}/${lane}`;
    if (this.floorKey !== key) {
      this.floor = metrics(width, height);
      drawFloor(this.floorArt, this.floor, lane);
      this.floorKey = key;
    }
    return this.floor;
  }

  update(_time: number, delta: number) {
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
    this.zoneLabel.setPosition(floor.gutter + 8, floor.zone + 16).setText('REVIEW');
    const reviewerX = Math.round(floor.gutter + (round.lane + 0.5) * floor.laneWidth);
    g.fillStyle(pink, 0.13).fillEllipse(reviewerX, height - 18, 47, 12);
    this.drawKnight(reviewerX, height, delta, round);
    this.showImpact(round, floor);
    this.drawRequests(round, floor);
  }

  private drawKnight(reviewerX: number, height: number, delta: number, round: Round) {
    let x = reviewerX;
    let strike = 0;
    if (!this.reduced) {
      x = Phaser.Math.Linear(this.reviewer.x || reviewerX, reviewerX, 1 - Math.exp(-delta / 40));
      if (round.impact) strike = Math.max(0, 1 - (round.elapsed - round.impact.at) / 0.25);
    }
    this.reviewer
      .setPosition(x, height - 27 - Math.sin(strike * Math.PI) * 17)
      .setAngle((x - reviewerX) * 0.1 + Math.sin(strike * Math.PI * 2) * 15);
  }

  private showImpact(round: Round, floor: Floor) {
    const impact = round.impact;
    if (this.lastImpact === impact) return;
    this.lastImpact = impact;
    this.tweens.killTweensOf(this.result);
    this.result.setVisible(Boolean(impact));
    if (impact) this.animateVerdict(impact, floor, round.chain);
  }

  private animateVerdict(impact: NonNullable<Round['impact']>, floor: Floor, chain: number) {
    const styles = {
      merge: ['SHIPPED', mint],
      block: ['PARRIED', amber],
      reject: ['CLEAN PR', pink],
      scout: ['SCANNED', amber],
      test: ['TO THE LAB', 0xa5beff],
      regression: ['REGRESSION', crimson],
      miss: ['DROPPED', pink],
    } as const;
    const [word, color] = styles[impact.kind];
    const x = floor.gutter + (impact.lane + 0.5) * floor.laneWidth;
    const y = floor.zone - 16;
    this.result
      .setPosition(x, y)
      .setColor(cssColor(color))
      .setStroke('#101021', 5)
      .setFontSize(Math.min(24, floor.laneWidth / 8))
      .setText(impact.points ? word + ' ×' + Math.min(5, chain) : word)
      .setAlpha(1);
    this.tweens.add({
      targets: this.result,
      y: y - (this.reduced ? 0 : 26),
      alpha: 0,
      delay: 320,
      duration: 400,
    });
    if (this.reduced) return;
    dispatchPaper(this, impact.kind, x, floor.zone, floor.width);
    this.drawBurst(x, floor, color);
  }

  private drawBurst(x: number, floor: Floor, color: number) {
    const burst = this.add.graphics().setPosition(x, floor.zone).setDepth(2);
    burst.lineStyle(3, color).strokeEllipse(0, 0, floor.laneWidth * 0.5, 21);
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * i) / 5;
      burst.lineBetween(Math.cos(a) * 20, Math.sin(a) * 11, Math.cos(a) * 34, Math.sin(a) * 21);
    }
    this.tweens.add({
      targets: burst,
      scale: 1.7,
      alpha: 0,
      duration: 240,
      onComplete: () => burst.destroy(),
    });
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

export function mountBoard(
  parent: HTMLElement,
  getRound: () => Round,
  reduceMotion: () => boolean,
  ready: () => void,
) {
  const density = Math.min(window.devicePixelRatio || 1, 2);
  const game = new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    width: Math.max(1, Math.round(parent.clientWidth * density)),
    height: Math.max(1, Math.round(parent.clientHeight * density)),
    backgroundColor: ink,
    scene: new Depot(getRound, reduceMotion, ready),
    banner: false,
    autoFocus: false,
    audio: { noAudio: true },
    input: { keyboard: false, mouse: false, touch: false, gamepad: false },
  });
  const resize = new ResizeObserver(() => {
    if (game.isBooted && parent.clientWidth && parent.clientHeight)
      game.scale.resize(
        Math.round(parent.clientWidth * density),
        Math.round(parent.clientHeight * density),
      );
  });
  resize.observe(parent);
  return () => {
    resize.disconnect();
    game.destroy(true);
  };
}
