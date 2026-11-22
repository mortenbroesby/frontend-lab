import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { RoomView } from './locations';
import type { Game } from './game';
import { birthday } from './birthday';
import { position, glowMaterial, softTexture, glyphMaterial, paintedMaterial } from './engine-art';

function water(scene: Scene, view: RoomView) {
  const shader = new ShaderMaterial(
    'silver water',
    scene,
    {
      vertexSource:
        'precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec2 vUV;void main(){vUV=uv;gl_Position=worldViewProjection*vec4(position,1.0);}',
      fragmentSource:
        'precision highp float;varying vec2 vUV;uniform float time;void main(){vec2 p=vUV-0.5;float r=length(p*vec2(1.,2.));float wave=sin(r*55.-time*2.4)+sin(vUV.x*27.+vUV.y*16.+time);float rim=smoothstep(0.,.12,vUV.x)*smoothstep(1.,.88,vUV.x)*smoothstep(0.,.2,vUV.y)*smoothstep(1.,.8,vUV.y);float shine=pow(max(0.,wave*.5),6.);gl_FragColor=vec4(.85,.48,.25,(.025+shine*.22)*rim);}',
    },
    {
      attributes: ['position', 'uv'],
      uniforms: ['worldViewProjection', 'time'],
      needAlphaBlending: true,
    },
  );
  const y = view.portrait ? 76.6 : 79;
  const surfaces = [view.portrait ? 23 : 29, 49.5, view.portrait ? 74 : 71].map((x) => {
    const m = MeshBuilder.CreatePlane(
      'rippling developing bath',
      { width: view.width * 0.17, height: view.height * 0.042 },
      scene,
    );
    m.position = position(view, x, y, -0.06);
    m.material = shader;
    m.isPickable = false;
    return m;
  });
  return { surfaces, shader };
}
export function darkroomPuzzle(scene: Scene, view: RoomView) {
  const baths = water(scene, view);
  const plate = MeshBuilder.CreatePlane(
    'the travelling glass plate',
    { width: view.width * 0.1, height: view.height * 0.055 },
    scene,
  );
  const blank = glyphMaterial(scene, 'undeveloped silver', '☾');
  const developed = glyphMaterial(scene, 'constellation plate', '✦ — ✦\n✦\n✦ ✦');
  plate.material = blank;
  plate.position = position(view, 18, 60, -0.12);
  plate.isPickable = false;
  return {
    tick(s: Game, time: number, reduced: boolean, dt: number) {
      baths.shader.setFloat('time', reduced ? 0 : time);
      plate.isVisible = s.negative;
      plate.material = s.plate ? developed : blank;
      const x = [18, view.portrait ? 23 : 29, 49.5, view.portrait ? 74 : 71][s.bath]!;
      const y = s.bath ? (view.portrait ? 77 : 79) : 60;
      plate.position = Vector3.Lerp(
        plate.position,
        position(view, x, y, -0.12),
        reduced ? 1 : 1 - Math.exp(-dt / 240),
      );
    },
  };
}
function portraitFrame(scene: Scene, view: RoomView) {
  const [x, y, w, h] = view.portrait ? [40.1, 30.6, 34, 16.6] : [48.6, 25, 19.9, 29];
  const center = position(view, x! + w! / 2, y! + h! / 2, -0.12);
  const width = (view.width * w!) / 100;
  const height = (view.height * h!) / 100;
  const backing = MeshBuilder.CreatePlane('opened frame interior', { width, height }, scene);
  backing.position = center;
  backing.material = glowMaterial(scene, 'dark velvet', '#10202a');
  backing.isPickable = false;
  const photo = MeshBuilder.CreatePlane(
    'your birthday photograph',
    { width: width * 0.92, height: height * 0.92 },
    scene,
  );
  photo.position = center.add(new Vector3(0, 0, -0.02));
  photo.isPickable = false;
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
  beam.isPickable = false;
  let angle = 0;
  return {
    setEnabled(enabled: boolean) {
      light.setEnabled(enabled);
    },
    tick(s: Game, _time: number, reduced: boolean, dt: number) {
      frame.backing.isVisible = s.revealed;
      frame.photo.isVisible = s.revealed;
      frame.hinges.forEach((h) => h.setEnabled(s.revealed));
      const target = s.revealed ? 1.95 : 0;
      angle += (target - angle) * (reduced ? 1 : 1 - Math.exp(-dt / 420));
      frame.hinges[0]!.rotation.y = angle;
      frame.hinges[1]!.rotation.y = -angle;
      light.setEnabled(s.inserted && s.room === 2);
      spot.isVisible = s.inserted && !s.revealed;
      beam.isVisible = s.inserted;
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
