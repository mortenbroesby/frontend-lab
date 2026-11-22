import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import type { Game } from './game';
import type { RoomView } from './locations';
import { keepsakes } from './room-textiles';
import { modelTools } from './room-model';
import { architecture, windowAndDoor, garland, tableSetting, flowers } from './room-furnishings';

function cabinet(t: ReturnType<typeof modelTools>, tall: boolean) {
  const { box, ball, palette: p } = t;
  const y = tall ? 2.2 : 1.55;
  const x = tall ? 0.7 : 1.4;
  box('cabinet of little lights', [2.5, 1.6, 0.5], [x, y, 2.3], p.wood, 'cabinet');
  box('cabinet velvet inset', [2.22, 1.27, 0.08], [x, y, 1.99], p.dark, 'cabinet');
  for (const yy of [-0.85, 0.85])
    box('carved cabinet crown', [2.8, 0.15, 0.65], [x, y + yy, 2.3], p.gold);
  return [0, 1, 2].map((i) => {
    const px = x + (i - 1) * 0.7;
    ball('brass lens bezel', [0.49, 0.49, 0.1], [px, y, 1.86], p.gold, 'cabinet');
    const m = t.material(`amber lens ${i}`, '#49351e', 0.2);
    ball('little sun lens', [0.35, 0.35, 0.13], [px, y, 1.78], m, 'cabinet');
    return m;
  });
}

export function birthdayRoom(scene: Scene, view: RoomView) {
  const start = scene.meshes.length;
  const t = modelTools(scene);
  const { w, top } = architecture(t, view.portrait);
  const door = windowAndDoor(t, view.portrait);
  const flags = garland(t, w, top);
  const { flameAt, width } = tableSetting(t, view.portrait);
  flowers(t, -width * 0.16);
  keepsakes(t, view.portrait);
  const lenses = cabinet(t, view.portrait);
  t.round('birthday candle', 0.09, 0.68, [0, 0.15, -0.4], t.palette.paper, 'cake');
  const flameMaterial = t.material('living candle flame', '#fff0b2');
  flameMaterial.emissiveColor = new Color3(1, 0.55, 0.12);
  const flame = t.ball(
    'candle flame',
    [0.11, 0.26, 0.11],
    flameAt.asArray(),
    flameMaterial,
    'cake',
  );
  const candle = new PointLight('candle lighting the table', flameAt.clone(), scene);
  candle.diffuse = Color3.FromHexString('#ffba72');
  candle.range = 11;
  candle.intensity = 0.9;
  const moon = new SpotLight(
    'moonlight through the window',
    new Vector3(view.portrait ? -2.2 : -4.5, 3.5, 1.8),
    new Vector3(0.35, -0.8, -1),
    1.45,
    1.5,
    scene,
  );
  moon.diffuse = Color3.FromHexString('#97c6f2');
  moon.intensity = 0.65;
  moon.range = 20;
  const fill = new PointLight('warm ceiling bounce', new Vector3(1, top - 1, -2), scene);
  fill.diffuse = Color3.FromHexString('#ffe0b3');
  fill.intensity = 0.38;
  fill.range = 20;
  const shadow = new ShadowGenerator(1024, moon);
  shadow.usePercentageCloserFiltering = true;
  shadow.bias = 0.003;
  shadow.normalBias = 0.025;
  const candleShadow = new ShadowGenerator(512, candle);
  candleShadow.usePoissonSampling = true;
  candleShadow.bias = 0.005;
  t.casters
    .filter((m) => !m.name.includes('wall') && !m.name.includes('floorboard'))
    .forEach((m) => shadow.addShadowCaster(m));
  t.casters
    .filter((m) => /cake|bun|cup|vase|flower|candle/.test(m.name))
    .forEach((m) => candleShadow.addShadowCaster(m));
  const meshes = scene.meshes.slice(start);
  let angle = 0;
  return {
    enable(enabled: boolean) {
      meshes.forEach((m) => m.setEnabled(enabled));
      [moon, candle, fill].forEach((l) => l.setEnabled(enabled));
    },
    tick(s: Game, time: number, reduced: boolean, dt: number) {
      const flicker = reduced ? 1 : 1 + Math.sin(time * 4.3) * 0.055 + Math.sin(time * 9.1) * 0.025;
      candle.intensity = 0.9 * flicker;
      flame.scaling.y = flicker;
      candle.position.x = reduced ? 0 : Math.sin(time * 2.1) * 0.035;
      flags.forEach((flag, i) => {
        flag.rotation.x = reduced ? 0 : Math.sin(time * 0.65 + i * 0.4) * 0.09;
      });
      lenses.forEach((m, i) =>
        m.emissiveColor.set(
          s.sequence.length > i ? 0.95 : 0.03,
          s.sequence.length > i ? 0.5 : 0.02,
          s.sequence.length > i ? 0.12 : 0.01,
        ),
      );
      angle += ((s.breakfast ? 1.12 : 0) - angle) * (reduced ? 1 : 1 - Math.exp(-dt / 650));
      door.rotation.y = angle;
    },
    project(stage: HTMLDivElement, camera: FreeCamera, width: number, height: number) {
      Object.assign(stage.style, {
        width: `${width}px`,
        height: `${height}px`,
        left: '0px',
        top: '0px',
      });
      const viewport = camera.viewport.toGlobal(width, height);
      stage.querySelectorAll<HTMLButtonElement>('[data-object]').forEach((button) => {
        const anchor = t.anchors.get(button.dataset.object as Parameters<typeof t.anchors.get>[0]);
        if (!anchor) return;
        const p = Vector3.Project(
          anchor.getAbsolutePosition(),
          Matrix.Identity(),
          scene.getTransformMatrix(),
          viewport,
        );
        button.style.left = `${p.x}px`;
        button.style.top = `${p.y}px`;
      });
    },
  };
}
