import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { Scene } from '@babylonjs/core/scene';
import { position, paintedMaterial, glowMaterial, softTexture } from './engine-art';
import { roomView, type RoomView } from './locations';

export function breakfastDoor(scene: Scene, view: RoomView) {
  const [x, y, w, h] = view.portrait ? [78.2, 31.5, 18, 27.2] : [82, 21.8, 15.1, 59.3];
  const width = (view.width * w!) / 100;
  const height = (view.height * h!) / 100;
  const center = position(view, x! + w! / 2, y! + h! / 2, -0.035);
  const passage = MeshBuilder.CreatePlane('view into the darkroom', { width, height }, scene);
  passage.position = center;
  passage.isPickable = false;
  const inside = paintedMaterial(scene, 'darkroom beyond the door', roomView(1, view.portrait).art);
  inside.disableLighting = true;
  inside.emissiveColor = new Color3(0.48, 0.42, 0.4);
  const insideTexture = inside.diffuseTexture as Texture;
  // Keep the view beyond the door at its original aspect ratio in either layout.
  insideTexture.uScale = 0.8 * (width / height) * (view.height / view.width);
  insideTexture.uOffset = (1 - insideTexture.uScale) / 2;
  insideTexture.vScale = 0.8;
  insideTexture.vOffset = 0.05;
  passage.material = inside;

  const hinge = new TransformNode('birthday door hinge', scene);
  hinge.position = position(view, x! + w!, y! + h! / 2, -0.065);
  const leaf = MeshBuilder.CreatePlane('opening walnut door', { width, height }, scene);
  leaf.parent = hinge;
  leaf.position.x = -width / 2;
  leaf.isPickable = false;
  const wood = paintedMaterial(scene, 'original walnut door paint', view.art);
  wood.disableLighting = true;
  wood.emissiveColor = Color3.White();
  const crop = wood.diffuseTexture as Texture;
  crop.uScale = w! / 100;
  crop.uOffset = x! / 100;
  crop.vScale = h! / 100;
  crop.vOffset = 1 - (y! + h!) / 100;
  leaf.material = wood;

  const glow = MeshBuilder.CreatePlane(
    'doorway light on the floor',
    { width: width * 1.8, height: height * 0.26 },
    scene,
  );
  glow.position = position(view, x! + w! / 2, y! + h! - 1, -0.09);
  glow.isPickable = false;
  const light = glowMaterial(scene, 'warm doorway spill', '#efb77e');
  light.diffuseTexture = softTexture(scene, 'doorway feather');
  light.useAlphaFromDiffuseTexture = true;
  light.alpha = 0;
  glow.material = light;
  let openness = 0;
  return {
    tick(open: boolean, dt: number) {
      const target = open ? 1 : 0;
      openness += (target - openness) * (1 - Math.exp(-dt / 420));
      passage.isVisible = open || openness > 0.005;
      leaf.isVisible = passage.isVisible;
      hinge.rotation.y = -openness * 1.18;
      wood.emissiveColor.setAll(1 - openness * 0.18);
      light.alpha = openness * 0.17;
    },
  };
}
