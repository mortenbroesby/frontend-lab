import Phaser from 'phaser';
import knightUrl from './office-knight.png';
import { drawShredder, shredderInset, shredderHeightAboveGate } from './shredder';
import { dispatchPaper } from './paper-flight';
import depotUrl from './mail-hall.jpg';
import courierUrl from './courier.png';
import trollUrl from './merge-troll.png';
import runnerUrl from './runner.png';
import { hall, type Floor } from './hall';
import { trollId, reviewStart, type Round } from './rules';

const ink = 0x0b0b19;
const mint = 0x70f7e9;
const amber = 0xffd783;
const crimson = 0xff92ba;
const pink = 0xf56bb5;

const cssColor = (value: number) => '#' + value.toString(16).padStart(6, '0');

type Graphics = Phaser.GameObjects.Graphics;
type Label = Phaser.GameObjects.Text;
type RequestCard = Round['cards'][number];

function drawFloor(g: Graphics, floor: Floor, selected: number) {
  const { xAt, yAt, threshold, zone, width } = floor;
  g.clear();
  for (let i = 0; i < 4; i++) {
    g.lineStyle(1, mint, 0.34).lineBetween(xAt(i - 0.5, 0), yAt(0), xAt(i - 0.5, 1), yAt(1));
  }
  const left = selected - 0.5,
    right = selected + 0.5;
  g.fillStyle(mint, 0.1)
    .beginPath()
    .moveTo(xAt(left, 0), yAt(0))
    .lineTo(xAt(right, 0), yAt(0))
    .lineTo(xAt(right, 1), yAt(1))
    .lineTo(xAt(left, 1), yAt(1))
    .closePath()
    .fillPath();
  g.lineStyle(4, 0xe4b56e, 0.72).lineBetween(xAt(-0.5, threshold), zone, xAt(2.5, threshold), zone);
  for (let lane = 0; lane < 3; lane++) {
    g.fillStyle(0xffe8a8).fillEllipse(xAt(lane, threshold), zone, 8, 3);
  }
  for (const x of [shredderInset, width - shredderInset])
    drawShredder(g, x, zone - shredderHeightAboveGate);
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

function actor(scene: Phaser.Scene, card: RequestCard) {
  return {
    body: scene.add
      .image(0, 0, card.id === trollId ? 'troll' : card.runner ? 'runner' : 'courier')
      .setOrigin(0.5, 1),
    title: label(scene, 13, 0xfff0ce, true).setText(card.title).setDepth(4),
    info: label(scene, 11, 0xffedce)
      .setText('PR #' + card.id + ' · +' + card.lines)
      .setDepth(4),
    signal: label(scene, 11, mint).setDepth(4),
  };
}
type Actor = ReturnType<typeof actor>;
function cardSignal(card: RequestCard) {
  if (card.id === trollId)
    return { text: card.verdict ? 'BAD PR · BOUNCE' : 'SHIELD · TEST', color: amber };
  return buildSignal(card);
}

function buildSignal(card: RequestCard) {
  if (card.verdict === 'clean') return { text: 'CLEAN PR', color: 0xb4ffdb };
  if (card.verdict === 'bad') return { text: 'BAD PR', color: 0xffaf99 };
  return card.green
    ? { text: '✓ Build passed', color: 0xb4ffdb }
    : { text: '× Build failed', color: 0xffaf99 };
}

function drawCourier(g: Graphics, art: Actor, card: RequestCard, floor: Floor, walkTime: number) {
  const stride = Math.sin(walkTime * (card.runner ? 14 : 8));
  const distance = floor.depth(card.progress);
  const x = floor.xAt(card.lane, card.progress),
    feet = floor.yAt(card.progress);
  const size =
    Math.min(122, floor.height * 0.26) * (0.4 + distance * 0.6) * (card.id === trollId ? 1.45 : 1);
  const lift = Math.abs(stride) * size * 0.055;
  g.fillStyle(ink, 0.46).fillEllipse(x, feet, size * 0.69, size * 0.16);
  art.body
    .setDisplaySize(size, size)
    .setPosition(x, feet - lift)
    .setAngle(stride * 4)
    .setDepth(1 + distance);
  drawNameplate(g, art, card, floor, x, feet - size - lift);
}

function drawNameplate(
  g: Graphics,
  art: Actor,
  card: RequestCard,
  floor: Floor,
  x: number,
  crown: number,
) {
  const column = floor.width / 3;
  const width = Math.min(167, column - 5);
  const left = Phaser.Math.Clamp(
    x - width / 2,
    column * card.lane + 2,
    column * (card.lane + 1) - width - 2,
  );
  if (art.title.style.wordWrapWidth !== width - 8) {
    art.title.setWordWrapWidth(width - 8, true).setFontSize(width < 117 ? 11 : 13);
  }
  const height = art.title.height + 32;
  const top = Math.max(2, crown - height - 3);
  g.lineStyle(1, 0xffdc9a, 0.75).lineBetween(left + width / 2, top + height, x, crown + 2);
  g.fillStyle(0x101923, 0.93).fillRoundedRect(left, top, width, height, 4);
  g.lineStyle(1, 0xad9365, 0.9).strokeRoundedRect(left, top, width, height, 4);
  art.info.setPosition(left + 4, top + 2);
  art.title.setPosition(left + 4, top + 15);
  const status = cardSignal(card);
  art.signal.setPosition(left + 4, top + height - 15);
  if (art.signal.text !== status.text)
    art.signal.setColor(cssColor(status.color)).setText(status.text);
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
  private couriers = new Map<number, Actor>();
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
    this.load.image('courier', courierUrl);
    this.load.image('troll', trollUrl);
    this.load.image('runner', runnerUrl);
    this.load.image('office-knight', knightUrl);
  }

  create() {
    this.backdrop = this.add.image(0, 0, 'depot').setOrigin(0).setAlpha(0.91);
    this.floorArt = this.add.graphics();
    this.movingArt = this.add.graphics();

    this.reviewer = this.add.image(0, 0, 'office-knight').setOrigin(0.5, 1).setDepth(2);
    this.result = label(this, 17, mint, true).setOrigin(0.5).setDepth(3).setVisible(false);
    for (let i = 0; i < 3; i++) {
      this.headers.push(
        label(this, 12, 0xe0e6ff)
          .setText('LANE 0' + (i + 1))
          .setOrigin(0.5, 0),
      );
      this.signals.push(label(this, 10, amber).setOrigin(0.5, 0));
    }
    this.zoneLabel = label(this, 11, mint).setStroke('#101825', 3).setOrigin(0, 0.5);
    this.ready();
  }

  private layout(lane: number, threshold: number) {
    const { clientWidth: width, clientHeight: height } = this.game.canvas;
    const zoom = this.scale.width / width;
    this.cameras.main.setOrigin(0, 0).setZoom(zoom);

    const key = `${width}/${height}/${lane}/${threshold}`;
    if (this.floorKey !== key) {
      this.floor = hall(width, height, threshold);
      const { artWidth, artHeight, farSpacing } = this.floor;
      this.backdrop
        .setDisplaySize(artWidth, artHeight)
        .setPosition((width - artWidth) / 2, (height - artHeight) * 0.42);
      this.game.canvas
        .closest<HTMLElement>('.mb-stage')
        ?.style.setProperty('--mb-door-spacing', farSpacing + 'px');
      drawFloor(this.floorArt, this.floor, lane);
      this.floorKey = key;
    }
    return this.floor;
  }

  update(_time: number, delta: number) {
    const round = this.getRound();
    const floor = this.layout(round.lane, reviewStart(round));
    const g = this.movingArt.clear();
    const { height } = floor;
    this.headers.forEach((head, lane) => {
      const center = floor.xAt(lane, 1);
      head.setPosition(center, Math.min(76, floor.height * 0.22));
      const next = round.pending.find((item) => item.lane === lane);
      this.signals[lane]
        .setPosition(center, Math.min(76, floor.height * 0.22) + 16)
        .setText(next ? 'TEST IN ' + Math.max(0, Math.ceil(next.due - round.elapsed)) + 's' : '');
    });
    this.zoneLabel.setPosition(8, floor.zone + 16).setText('→ main');
    const reviewerX = floor.xAt(round.lane, 1 - round.advance * 0.06);
    const feet = height * (1 - round.advance * 0.05);
    g.fillStyle(pink, 0.13).fillEllipse(reviewerX, feet - 8, 47, 12);
    this.drawKnight(reviewerX, feet, delta, round);
    this.showImpact(round, floor);
    this.drawRequests(round, floor);
  }

  private drawKnight(reviewerX: number, feet: number, delta: number, round: Round) {
    let x = reviewerX;
    let strike = 0;
    if (!this.reduced) {
      x = Phaser.Math.Linear(this.reviewer.x || reviewerX, reviewerX, 1 - Math.exp(-delta / 40));
      if (round.impact) strike = Math.max(0, 1 - (round.elapsed - round.impact.at) / 0.25);
    }
    const size = Math.min(150, this.floor.height * 0.32) * (1 - round.advance * 0.045);
    this.reviewer
      .setDisplaySize(size, size)
      .setPosition(x, feet - 2 - Math.sin(strike * Math.PI) * 17)
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
      merge: ['MERGED', 0xd3acff],
      block: ['PARRIED', amber],
      reject: ['CLEAN PR', pink],
      scout: ['SCANNED', amber],
      test: ['TO THE LAB', 0xa5beff],
      regression: ['REGRESSION', crimson],
      miss: ['DROPPED', pink],
    } as const;
    const [word, color] = styles[impact.kind];
    const x = floor.xAt(impact.lane, floor.threshold);
    const y = floor.zone - 16;
    this.result
      .setPosition(x, y)
      .setColor(cssColor(color))
      .setStroke('#101021', 5)
      .setFontSize(Math.min(24, floor.width / 24))
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
    burst.lineStyle(3, color).strokeEllipse(0, 0, floor.width / 6, 21);
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
      const courier = this.couriers.get(card.id) ?? actor(this, card);
      this.couriers.set(card.id, courier);
      const walkTime = this.reduced ? 0 : round.elapsed - card.started;
      drawCourier(this.movingArt, courier, card, floor, walkTime);
    }
    this.removeDepartedCards(round.cards);
  }

  private removeDepartedCards(cards: RequestCard[]) {
    for (const [id, courier] of this.couriers) {
      if (cards.some((card) => card.id === id)) continue;
      for (const part of Object.values(courier)) part.destroy();
      this.couriers.delete(id);
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
