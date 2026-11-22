import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { RoomView } from './locations';
import type { Game } from './game';
import { birthday } from './birthday';
import { magicStars } from './engine-stars';
import { finaleAt } from './moments';
import { position, glowMaterial, softTexture, paintedMaterial } from './engine-art';

function portraitFrame(scene: Scene, view: RoomView) {
  const [x, y, w, h] = view.portrait ? [40.1, 30.6, 34, 16.6] : [49.9, 24.4, 18.5, 29.5];
  const center = position(view, x! + w! / 2, y! + h! / 2, -0.12);
  const width = (view.width * w!) / 100;
  const height = (view.height * h!) / 100;
  const backing = MeshBuilder.CreatePlane('opened frame interior', { width, height }, scene);
  backing.position = center;
  backing.material = glowMaterial(scene, 'dark velvet', '#10202a');
  backing.isPickable = false;
  backing.renderingGroupId = 2;
  const photo = MeshBuilder.CreatePlane(
    'your birthday photograph',
    { width: width * 0.92, height: height * 0.92 },
    scene,
  );
  photo.position = center.add(new Vector3(0, 0, -0.02));
  photo.isPickable = false;
  photo.renderingGroupId = 2;
  const pm = paintedMaterial(scene, 'photograph', birthday.photo);
  pm.emissiveColor = new Color3(0.5, 0.5, 0.5);
  photo.material = pm;
  const texture = pm.diffuseTexture as Texture;
  texture.onLoadObservable.add(() => {
    const size = texture.getSize();
    const ratio = size.width / size.height;
    photo.scaling.x = Math.min(1, ratio / (width / height));
    photo.scaling.y = Math.min(1, width / height / ratio);
  });
  const hinges = [-1, 1].map((side) => {
    const pivot = new TransformNode('shutter hinge', scene);
    pivot.position = center.add(new Vector3((side * width) / 2, 0, -0.035));
    const shutter = MeshBuilder.CreatePlane(
      'carved wooden shutter',
      { width: width / 2, height },
      scene,
    );
    shutter.parent = pivot;
    shutter.position.x = (-side * width) / 4;
    shutter.isPickable = false;
    shutter.renderingGroupId = 2;
    const mat = paintedMaterial(scene, 'shutter paint', view.art);
    const t = mat.diffuseTexture as Texture;
    t.uScale = w! / 200;
    t.uOffset = (x! + (side > 0 ? w! / 2 : 0)) / 100;
    t.vScale = h! / 100;
    t.vOffset = 1 - (y! + h!) / 100;
    shutter.material = mat;
    return pivot;
  });
  return { backing, photo, hinges, center };
}
export function atticPuzzle(scene: Scene, view: RoomView) {
  const frame = portraitFrame(scene, view);
  const stars = magicStars(scene, 18);
  const shade = MeshBuilder.CreatePlane(
    'cinematic room shade',
    { width: view.width * 1.05, height: view.height * 1.05 },
    scene,
  );
  shade.position.z = -0.01;
  shade.renderingGroupId = 1;
  shade.isPickable = false;
  const shadeMaterial = glowMaterial(scene, 'quiet before the memory', '#06111a');
  shadeMaterial.alpha = 0;
  shade.material = shadeMaterial;
  const source = position(view, view.portrait ? 45 : 44, view.portrait ? 56 : 58, -1.2);
  const light = new SpotLight(
    'the magic lantern beam',
    source,
    frame.center.subtract(source).normalize(),
    0.5,
    2,
    scene,
  );
  light.diffuse = Color3.FromHexString('#ffe3a0');
  light.intensity = 2;
  light.range = 12;
  const spot = MeshBuilder.CreatePlane('projected circle of light', { size: 0.7 }, scene);
  const m = glowMaterial(scene, 'projected light', '#ffe4a3');
  m.diffuseTexture = softTexture(scene, 'light on wood');
  m.useAlphaFromDiffuseTexture = true;
  spot.material = m;
  spot.isPickable = false;
  spot.renderingGroupId = 2;
  const beamMaterial = glowMaterial(scene, 'light made visible', '#ffe1a0');
  beamMaterial.alpha = 0.045;
  beamMaterial.disableDepthWrite = true;
  const beam = MeshBuilder.CreateTube(
    'volumetric lantern beam',
    {
      path: [source, frame.center],
      radiusFunction: (i) => (i === 0 ? 0.025 : 0.5),
      tessellation: 20,
      updatable: true,
    },
    scene,
  );
  beam.material = beamMaterial;
  beam.renderingGroupId = 2;
  beam.isPickable = false;
  let angle = 0;
  return {
    setEnabled(enabled: boolean) {
      light.setEnabled(enabled);
    },
    tick(s: Game, time: number, reduced: boolean, dt: number, finaleTime: number) {
      const moment = finaleAt(finaleTime);
      shadeMaterial.alpha = s.revealed ? moment.shade : 0;
      frame.backing.isVisible = s.revealed;
      frame.photo.isVisible = s.revealed && moment.open > 0;
      frame.hinges.forEach((h) => h.setEnabled(s.revealed));
      const target = s.revealed ? moment.open * 1.95 : 0;
      angle += (target - angle) * (reduced ? 1 : 1 - Math.exp(-dt / 420));
      frame.hinges[0]!.rotation.y = angle;
      frame.hinges[1]!.rotation.y = -angle;
      light.setEnabled(s.wickLit && s.room === 2);
      spot.isVisible = s.wickLit && !s.revealed;
      beam.isVisible = s.wickLit;
      beamMaterial.alpha =
        0.038 +
        Math.sin(time * 1.3) * 0.006 +
        (s.revealed ? moment.gather * (1 - moment.warmth) * 0.1 : 0);
      stars.forEach((star, i) => {
        const flight = Math.min(1, Math.max(0, (moment.travel - i * 0.009) / 0.84));
        star.isVisible = s.revealed && moment.gather > 0 && !moment.ready;
        star.visibility = moment.gather * (1 - flight);
        star.position = Vector3.Lerp(source, frame.center, flight);
        star.position.x += Math.sin(i * 2.4 + time) * 0.25 * (1 - flight);
        star.position.y +=
          Math.cos(i * 2.4 + time) * 0.2 * (1 - flight) + Math.sin(flight * Math.PI) * 0.45;
        star.rotation.z = time * 0.4 + i;
      });
      const end = frame.center.add(
        new Vector3((s.horizontal - 1) * 0.38, (s.vertical - 2) * 0.32, -0.06),
      );
      spot.position = end;
      light.direction = end.subtract(source).normalize();
      MeshBuilder.CreateTube('volumetric lantern beam', {
        path: [source, end],
        radiusFunction: (i) => (i === 0 ? 0.025 : 0.5),
        instance: beam,
      });
    },
  };
}
