import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { RoomView } from './locations';

export function position(view: RoomView, x: number, y: number, z = -0.05) {
  return new Vector3((x / 100 - 0.5) * view.width, (0.5 - y / 100) * view.height, z);
}
export function paintedMaterial(scene: Scene, name: string, url: string, onReady?: () => void) {
  const m = new StandardMaterial(name, scene);
  m.diffuseTexture = new Texture(url, scene, false, true, Texture.TRILINEAR_SAMPLINGMODE, onReady);
  m.emissiveColor = new Color3(0.22, 0.22, 0.22);
  m.specularColor = Color3.Black();
  m.maxSimultaneousLights = 5;
  m.backFaceCulling = false;
  return m;
}
export function paintedRoom(scene: Scene, view: RoomView, invalidate: () => void) {
  const art = MeshBuilder.CreatePlane(view.name, { width: view.width, height: view.height }, scene);
  art.material = paintedMaterial(scene, view.name, view.art, invalidate);
  if (view.room === 0) {
    const mat = art.material as StandardMaterial;
    mat.disableLighting = true;
    mat.emissiveColor = Color3.White();
  }
  art.isPickable = false;
  const targets = view.spots.map((spot) => {
    const mesh = MeshBuilder.CreatePlane(
      spot.name,
      { width: view.width * 0.08, height: view.height * 0.09 },
      scene,
    );
    mesh.position = position(view, spot.x, spot.y);
    mesh.visibility = 0;
    mesh.metadata = { id: spot.id };
    return mesh;
  });
  return [art, ...targets];
}
export function glowMaterial(scene: Scene, name: string, color: string) {
  const m = new StandardMaterial(name, scene);
  m.disableLighting = true;
  m.emissiveColor = Color3.FromHexString(color);
  m.backFaceCulling = false;
  return m;
}
export function softTexture(scene: Scene, name: string) {
  const t = new DynamicTexture(name, { width: 128, height: 128 }, scene, false);
  const c = t.getContext() as CanvasRenderingContext2D;
  const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, '#ffffffff');
  g.addColorStop(0.18, '#ffffffbb');
  g.addColorStop(0.55, '#ffffff33');
  g.addColorStop(1, '#ffffff00');
  c.fillStyle = g;
  c.fillRect(0, 0, 128, 128);
  t.update();
  t.hasAlpha = true;
  return t;
}
export function glyphMaterial(scene: Scene, name: string, text: string) {
  const t = new DynamicTexture(name, { width: 256, height: 256 }, scene, false);
  const c = t.getContext() as CanvasRenderingContext2D;
  c.fillStyle = '#152e3e';
  c.fillRect(0, 0, 256, 256);
  c.strokeStyle = '#bca16c';
  c.lineWidth = 8;
  c.strokeRect(7, 7, 242, 242);
  c.fillStyle = '#ffdfa1';
  c.font = '36px Georgia';
  c.textAlign = 'center';
  text.split('\n').forEach((line, i) => c.fillText(line, 128, 70 + i * 48));
  t.update();
  const m = glowMaterial(scene, name, '#ffffff');
  m.diffuseTexture = t;
  return m;
}
export function foregroundLayer(scene: Scene, view: RoomView, invalidate: () => void) {
  const mesh = MeshBuilder.CreatePlane(
    'foreground timber and cloth',
    { width: view.width, height: view.height },
    scene,
  );
  mesh.position.z = -0.28;
  mesh.scaling.setAll(view.portrait ? 0.983 : 0.97);
  mesh.isPickable = false;
  const material = new StandardMaterial('foreground depth', scene);
  material.emissiveColor = new Color3(0.22, 0.22, 0.22);
  material.specularColor = Color3.Black();
  material.maxSimultaneousLights = 5;
  const texture = new DynamicTexture(
    'foreground cutout',
    { width: view.portrait ? 1024 : 2048, height: view.portrait ? 2048 : 1024 },
    scene,
    true,
  );
  texture.hasAlpha = true;
  material.diffuseTexture = texture;
  material.useAlphaFromDiffuseTexture = true;
  mesh.material = material;
  const image = new Image();
  image.onload = () => {
    if (scene.isDisposed) return;
    const c = texture.getContext() as CanvasRenderingContext2D;
    const size = texture.getSize();
    c.clearRect(0, 0, size.width, size.height);
    c.save();
    c.beginPath();
    [
      [0, 0.87],
      [0.3, 0.87],
      [0.36, 0.81],
      [0.67, 0.81],
      [0.74, 0.87],
      [1, 0.87],
      [1, 1],
      [0, 1],
    ].forEach(([x, y], i) => {
      if (i) c.lineTo(x! * size.width, y! * size.height);
      else c.moveTo(x! * size.width, y! * size.height);
    });
    c.closePath();
    c.clip();
    c.drawImage(image, 0, 0, size.width, size.height);
    c.restore();
    texture.update();
    invalidate();
  };
  image.src = view.art;
  return mesh;
}
