import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { textiles } from './room-textiles';
import type { ModelTools } from './room-model';

export function architecture(t: ModelTools, tall: boolean) {
  const { box, palette: p } = t;
  const rug = textiles(t);
  const w = tall ? 7.8 : 13.8;
  const top = tall ? 6.4 : 4.3;
  box('timber ceiling', [w, 0.25, 11], [0, top, -1.5], p.trim);
  box('plaster back wall', [w, top + 4, 0.25], [0, (top - 4) / 2, 2.9], p.wall);
  box('left return wall', [0.25, top + 4, 7], [-w / 2, (top - 4) / 2, -0.5], p.wall);
  box('right return wall', [0.25, top + 4, 7], [w / 2, (top - 4) / 2, -0.5], p.wall);
  for (let i = 0; i < 18; i++) {
    box(
      'individual oak floorboard',
      [w / 18 - 0.018, 0.15, 8],
      [-w / 2 + ((i + 0.5) * w) / 18, -3.85, -0.7],
      p.wood,
    );
  }
  box('wainscot', [w, 1.8, 0.18], [0, -2.8, 2.69], p.trim);
  for (let x = -w / 2 + 0.4; x < w / 2; x += 0.8) {
    box('panel moulding', [0.035, 1.6, 0.06], [x, -2.8, 2.56], p.gold);
    box('wallpaper pinstripe', [0.012, top + 1.8, 0.015], [x, (top - 1.8) / 2, 2.755], p.gold);
  }
  for (const y of [-3.65, -1.85, top - 0.25])
    box('room cornice', [w, 0.13, 0.3], [0, y, 2.52], p.wood);
  box('woven burgundy rug', [w * 0.75, 0.025, 3.8], [0, -3.75, -1.4], rug);
  for (const x of [-1, 1])
    box('rug border', [0.09, 0.035, 3.7], [x * w * 0.36, -3.73, -1.4], p.gold);
  return { w, top };
}

export function windowAndDoor(t: ModelTools, tall: boolean) {
  const { box, palette: p } = t;
  const wx = tall ? -2.2 : -4.5;
  const wy = tall ? 2.2 : 1.1;
  const sky = t.material('blue hour glass', '#537d98', 0.65);
  sky.emissiveColor.set(0.22, 0.35, 0.48);
  sky.disableLighting = true;
  box('blue hour window', [2.05, 3.15, 0.12], [wx, wy, 2.62], sky, 'window');
  for (const x of [-1.1, 0, 1.1])
    box('window mullion', [0.1, 3.45, 0.24], [wx + x, wy, 2.4], p.wood, 'window');
  for (const y of [-1.65, 0, 1.65])
    box('window crossbar', [2.3, 0.12, 0.24], [wx, wy + y, 2.4], p.wood, 'window');
  box('window sill', [2.65, 0.15, 0.6], [wx, wy - 1.7, 2.15], p.wood);
  const curtain = t.material('heavy midnight velvet', '#183e47');
  for (const side of [-1, 1])
    for (let i = 0; i < 5; i++) {
      const fold = t.round(
        'curtain fold',
        0.22,
        3.65,
        [wx + side * (1.1 + i * 0.1), wy, 2.02],
        curtain,
      );
      fold.scaling.z = 0.65;
    }
  const dx = tall ? 3.05 : 5.55;
  box('dark passage', [1.65, 4.9, 0.15], [dx, -0.75, 2.54], p.dark, 'darkroom');
  for (const x of [-0.87, 0.87])
    box('door jamb', [0.16, 5.1, 0.35], [dx + x, -0.75, 2.3], p.wood, 'darkroom');
  box('door lintel', [1.95, 0.18, 0.35], [dx, 1.8, 2.3], p.wood);
  const hinge = new TransformNode('door hinge', t.scene);
  hinge.position.set(dx - 0.8, -0.75, 2.25);
  const door = box('paneled darkroom door', [1.6, 4.85, 0.14], [0.8, 0, 0], p.trim, 'darkroom');
  door.parent = hinge;
  for (const y of [-1.2, 1.2]) {
    const panel = box('raised door panel', [1.25, 1.8, 0.08], [0.8, y, -0.11], p.wood, 'darkroom');
    panel.parent = hinge;
  }
  const knob = t.ball(
    'brass door knob',
    [0.15, 0.15, 0.15],
    [1.38, -0.2, -0.2],
    p.gold,
    'darkroom',
  );
  knob.parent = hinge;
  t.anchors.set('darkroom', door);
  return hinge;
}

export function garland(t: ModelTools, w: number, top: number) {
  const { box, palette: p } = t;
  const flags: TransformNode[] = [];
  const path: Vector3[] = [];
  for (let i = 0; i <= 32; i++) {
    const x = (i / 32 - 0.5) * (w - 0.5);
    path.push(new Vector3(x, top - 0.65 - 0.65 * Math.cos((x / (w - 0.5)) * Math.PI), 1.85));
  }
  t.line('birthday garland string', path, 0.018, p.gold);
  for (let i = 0; i < 11; i++) {
    const x = (i / 10 - 0.5) * (w - 1);
    const y = top - 0.7 - 0.65 * Math.cos((x / (w - 0.5)) * Math.PI);
    const pivot = new TransformNode('Dannebrog flag', t.scene);
    pivot.position.set(x, y, 1.85);
    const flag = box('red birthday flag', [0.44, 0.33, 0.018], [0, -0.18, 0], p.red);
    flag.parent = pivot;
    const vertical = box(
      'white Nordic cross',
      [0.045, 0.33, 0.022],
      [-0.065, -0.18, -0.015],
      p.cream,
    );
    vertical.parent = pivot;
    const horizontal = box('white Nordic cross', [0.44, 0.045, 0.024], [0, -0.18, -0.017], p.cream);
    horizontal.parent = pivot;
    flags.push(pivot);
  }
  return flags;
}

export function tableSetting(t: ModelTools, tall: boolean) {
  const { box, round, ball, palette: p } = t;
  const width = tall ? 6.1 : 9;
  box('solid oak breakfast table', [width, 0.23, 2.8], [0, -1.35, -0.6], p.wood);
  for (const x of [-1, 1])
    for (const z of [-1.6, 0.3])
      round('turned table leg', 0.23, 2.35, [x * (width / 2 - 0.4), -2.6, z], p.wood);
  box('linen table runner', [1.55, 0.035, 2.85], [0, -1.21, -0.6], p.paper);
  box('linen hanging edge', [1.55, 0.8, 0.035], [0, -1.6, -2.03], p.paper);
  round('cake pedestal', 0.45, 0.35, [0, -1.02, -0.4], p.gold, 'cake');
  round('porcelain cake stand', 1.65, 0.09, [0, -0.81, -0.4], p.cream, 'cake');
  const sponge = t.material('vanilla sponge', '#c89555');
  round('birthday cake', 1.35, 0.52, [0, -0.53, -0.4], sponge, 'cake');
  round('cream icing', 1.39, 0.12, [0, -0.24, -0.4], p.cream, 'cake');
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    ball(
      'raspberry',
      [0.14, 0.16, 0.14],
      [Math.cos(a) * 0.58, -0.12, -0.4 + Math.sin(a) * 0.58],
      p.red,
      'cake',
    );
  }
  const bread = t.material('golden baked buns', '#c48b45');
  const bx = -width * 0.31;
  round('bun platter', 1.35, 0.06, [bx, -1.16, -0.8], p.cream, 'bun');
  for (const [x, z] of [
    [-0.27, -0.15],
    [0.23, -0.12],
    [0, 0.27],
  ])
    ball('warm birthday bun', [0.55, 0.34, 0.48], [bx + x!, -0.98, -0.8 + z!], bread, 'bun');
  const cx = width * 0.31;
  round('porcelain saucer', 1.02, 0.06, [cx, -1.16, -0.8], p.cream, 'cup');
  round('porcelain cup', 0.61, 0.47, [cx, -0.9, -0.8], p.cream, 'cup');
  round('coffee surface', 0.51, 0.018, [cx, -0.655, -0.8], p.dark, 'cup');
  const handle = ball('cup handle', [0.36, 0.36, 0.13], [cx + 0.37, -0.88, -0.8], p.gold, 'cup');
  handle.rotation.y = 0.3;
  const note = box(
    'sealed invitation',
    [0.75, 0.85, 0.035],
    [-width * 0.34, 0.05, 0.35],
    p.paper,
    'note',
  );
  note.rotation.y = -0.2;
  const seal = round('red wax seal', 0.15, 0.035, [-width * 0.34, 0.05, 0.31], p.red, 'note');
  seal.rotation.x = Math.PI / 2;
  round('invitation holder', 0.06, 0.85, [-width * 0.34, -0.78, 0.35], p.gold);
  round('invitation holder base', 0.3, 0.04, [-width * 0.34, -1.16, 0.35], p.gold);
  return { flameAt: new Vector3(0, 0.65, -0.4), width };
}

export function flowers(t: ModelTools, x: number) {
  const { round, ball, palette: p } = t;
  round('ceramic flower vase', 0.42, 0.7, [x, -0.85, 0.45], p.trim);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4,
      dx = Math.cos(a) * 0.4,
      dz = Math.sin(a) * 0.3,
      y = 0.3 + Math.sin(i * 3) * 0.15;
    t.line(
      'flower stem',
      [new Vector3(x, -0.6, 0.45), new Vector3(x + dx, y, 0.45 + dz)],
      0.018,
      p.green,
    );
    for (let j = 0; j < 5; j++) {
      const b = (j / 5) * Math.PI * 2;
      ball(
        'cream flower petal',
        [0.18, 0.1, 0.15],
        [x + dx + Math.cos(b) * 0.1, y, 0.45 + dz + Math.sin(b) * 0.1],
        p.cream,
      );
    }
    ball('flower heart', [0.09, 0.09, 0.09], [x + dx, y + 0.03, 0.45 + dz], p.gold);
  }
}
