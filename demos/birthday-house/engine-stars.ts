import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import type { Scene } from '@babylonjs/core/scene';
import { glowMaterial } from './engine-art';

export function magicStars(scene: Scene, count: number) {
  const texture = new DynamicTexture(
    'soft four-point starlight',
    { width: 128, height: 128 },
    scene,
    false,
  );
  const c = texture.getContext() as CanvasRenderingContext2D;
  const glow = c.createRadialGradient(64, 64, 0, 64, 64, 62);
  glow.addColorStop(0, '#fff5d9');
  glow.addColorStop(0.2, '#ffe2a577');
  glow.addColorStop(1, '#ffe2a500');
  c.fillStyle = glow;
  c.fillRect(0, 0, 128, 128);
  c.fillStyle = '#fff3d2';
  c.beginPath();
  c.moveTo(64, 12);
  c.quadraticCurveTo(68, 59, 112, 64);
  c.quadraticCurveTo(68, 68, 64, 116);
  c.quadraticCurveTo(60, 68, 16, 64);
  c.quadraticCurveTo(60, 59, 64, 12);
  c.fill();
  texture.update();
  texture.hasAlpha = true;
  const material = glowMaterial(scene, 'warm living stars', '#fff3d0');
  material.diffuseTexture = texture;
  material.useAlphaFromDiffuseTexture = true;
  material.disableDepthWrite = true;
  return Array.from({ length: count }, (_, i) => {
    const star = MeshBuilder.CreatePlane(
      'travelling starlight',
      { size: 0.055 + (i % 3) * 0.025 },
      scene,
    );
    star.material = material;
    star.isPickable = false;
    star.renderingGroupId = 2;
    star.isVisible = false;
    return star;
  });
}
