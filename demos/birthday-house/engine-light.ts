import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { Scene } from '@babylonjs/core/scene';
import type { RoomView } from './locations';
import { position, softTexture, glowMaterial } from './engine-art';

const lightsWide = [
  [
    [60, 49],
    [6, 56],
    [69, 26],
  ],
  [
    [52, 44],
    [10, 69],
    [6, 31],
  ],
  [
    [18, 63],
    [77, 52],
    [12, 19],
  ],
];
const lightsTall = [
  [
    [59, 48],
    [11, 60],
    [69.4, 35.2],
  ],
  [
    [51, 49],
    [12, 62],
    [50, 19],
  ],
  [
    [12, 59],
    [79, 55],
    [10, 27],
  ],
];
export function roomLighting(scene: Scene, view: RoomView) {
  const texture = softTexture(scene, 'soft fire');
  const emitters = (view.portrait ? lightsTall : lightsWide)[view.room]!.map(([x, y], i) => {
    const location = position(view, x!, y!, -0.65);
    const light = new PointLight('living amber light', location, scene);
    light.diffuse = Color3.FromHexString(view.room === 1 && i === 0 ? '#ff6440' : '#ffd1a0');
    light.intensity = 0.3;
    light.range = 5;
    const flame = MeshBuilder.CreatePlane('candle glow', { width: 0.3, height: 0.55 }, scene);
    flame.position = position(view, x!, y!, -0.15);
    flame.isPickable = false;
    const material = glowMaterial(scene, 'flame', '#ffc66d');
    material.diffuseTexture = texture;
    material.useAlphaFromDiffuseTexture = true;
    material.alpha = 0.8;
    flame.material = material;
    return { light, flame };
  });
  const fogMaterial = glowMaterial(scene, 'a breath of blue mist', '#9ab6d1');
  fogMaterial.diffuseTexture = texture;
  fogMaterial.useAlphaFromDiffuseTexture = true;
  fogMaterial.alpha = 0.045;
  const fog = Array.from({ length: 5 }, (_, i) => {
    const m = MeshBuilder.CreatePlane(
      'drifting mist',
      { width: view.width * 0.65, height: 1.4 },
      scene,
    );
    m.position = position(view, 15 + i * 19, 82 - (i % 2) * 8, -0.6 - i * 0.12);
    m.material = fogMaterial;
    m.isPickable = false;
    return m;
  });
  return {
    setEnabled(enabled: boolean) {
      emitters.forEach(({ light, flame }) => {
        light.setEnabled(enabled);
        flame.setEnabled(enabled);
      });
      fog.forEach((m) => m.setEnabled(enabled));
    },
    tick(time: number, reduced: boolean) {
      const t = reduced ? 0 : time;
      emitters.forEach(({ light, flame }, i) => {
        const shimmer = Math.sin(t * 7 + i) * 0.035 + Math.sin(t * 13.1 + i) * 0.02;
        light.intensity = 0.29 + shimmer;
        flame.scaling.set(1 + shimmer * 2, 1 + shimmer * 3, 1);
      });
      fog.forEach((m, i) => {
        m.position.x = position(view, 15 + i * 19, 0).x + Math.sin(t * 0.12 + i) * 0.65;
      });
    },
    dispose() {
      emitters.forEach((e) => e.light.dispose());
    },
  };
}
