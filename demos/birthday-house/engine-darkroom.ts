import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { RoomView } from './locations';
import type { Game } from './game';
import { position, glyphMaterial, glowMaterial, softTexture } from './engine-art';
import { magicStars } from './engine-stars';
import { developmentAt } from './moments';

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
  const stars = magicStars(scene, 12);
  let age = 0;
  const halo = MeshBuilder.CreatePlane(
    'silver bath awakening',
    { width: view.width * 0.17, height: view.height * 0.08 },
    scene,
  );
  halo.position = position(view, view.portrait ? 74 : 71, view.portrait ? 77 : 79, -0.14);
  halo.isPickable = false;
  const haloMaterial = glowMaterial(scene, 'silver bath glow', '#b5d8ef');
  haloMaterial.diffuseTexture = softTexture(scene, 'silver bloom');
  haloMaterial.useAlphaFromDiffuseTexture = true;
  halo.material = haloMaterial;
  const plate = MeshBuilder.CreatePlane(
    'the travelling glass plate',
    {
      width: view.width * (view.portrait ? 0.12 : 0.085),
      height: view.height * (view.portrait ? 0.06 : 0.12),
    },
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
      age = s.plate ? age + dt : 0;
      const moment = developmentAt(age);
      plate.material = moment.etched ? developed : blank;
      haloMaterial.alpha = moment.glow * 0.24;
      const bath = s.bath;
      const x = [18, view.portrait ? 23 : 29, 49.5, view.portrait ? 74 : 71][bath]!;
      const surface = view.portrait ? 77 : 79;
      const y = bath ? surface - moment.rise * 9 : 60;
      stars.forEach((star, i) => {
        const step = Math.min(1, Math.max(0, (moment.rise - i * 0.025) / 0.72));
        star.isVisible = s.plate && age < 3700;
        star.visibility = moment.glow * Math.sin(Math.PI * step);
        star.position = position(
          view,
          x + Math.sin(i * 2.4 + step * 4) * (1 - step) * 7,
          surface - step * 9 - Math.sin(step * Math.PI) * 7,
          -0.2,
        );
        star.rotation.z = time * 0.3 + i;
      });
      plate.position = Vector3.Lerp(
        plate.position,
        position(view, x, y, -0.12),
        reduced ? 1 : 1 - Math.exp(-dt / 240),
      );
    },
  };
}
