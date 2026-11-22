import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import type { Scene } from '@babylonjs/core/scene';
import type { RoomView } from './locations';
import type { Game } from './game';
import { position, glowMaterial, softTexture } from './engine-art';
import { breakfastDoor } from './engine-door';

export function breakfastPuzzle(scene: Scene, view: RoomView) {
  const door = breakfastDoor(scene, view);
  const charge = [0, 0, 0];
  const material = glowMaterial(scene, 'awakened amber lenses', '#ffba53');
  material.diffuseTexture = softTexture(scene, 'soft cabinet light');
  material.useAlphaFromDiffuseTexture = true;
  material.alpha = 0.7;
  const lights = [0, 1, 2].map((i) => {
    const mesh = MeshBuilder.CreatePlane(
      'little cabinet sun',
      { size: view.portrait ? 0.52 : 0.58 },
      scene,
    );
    mesh.position = position(
      view,
      (view.portrait ? 53.1 : 59.4) + i * (view.portrait ? 6.9 : 5),
      view.portrait ? 37.9 : 35.6,
      -0.08,
    );
    mesh.material = material;
    mesh.isPickable = false;
    return mesh;
  });
  const steamMaterial = new ShaderMaterial(
    'warm coffee steam',
    scene,
    {
      vertexSource:
        'precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec2 vUV;void main(){vUV=uv;gl_Position=worldViewProjection*vec4(position,1.0);}',
      fragmentSource:
        'precision highp float;varying vec2 vUV;uniform float time;void main(){float a=0.;for(int i=0;i<3;i++){float n=float(i);float curve=.5+sin(vUV.y*7.-time*.55+n*2.)*(.06+vUV.y*.17)+(n-1.)*.13;float w=exp(-pow((vUV.x-curve)*23.,2.));a+=w;}float fade=smoothstep(0.,.15,vUV.y)*smoothstep(1.,.3,vUV.y);gl_FragColor=vec4(.94,.88,.76,a*fade*.075);}',
    },
    {
      attributes: ['position', 'uv'],
      uniforms: ['worldViewProjection', 'time'],
      needAlphaBlending: true,
    },
  );
  const cup = view.spots.find((s) => s.id === 'cup')!;
  const steam = MeshBuilder.CreatePlane(
    'steam above the cup',
    { width: view.width * 0.065, height: view.height * 0.12 },
    scene,
  );
  steam.position = position(view, cup.x, view.portrait ? 60.2 : 65.5, -0.12);
  steam.material = steamMaterial;
  steam.isPickable = false;
  return {
    tick(s: Game, time: number, reduced: boolean, dt: number) {
      door.tick(s.breakfast, dt);
      lights.forEach((m, i) => {
        const lit = s.sequence.length > i;
        charge[i]! += ((lit ? 1 : 0) - charge[i]!) * (1 - Math.exp(-dt / 180));
        m.isVisible = lit;
        m.visibility = charge[i]!;
        m.scaling.setAll(0.65 + charge[i]! * 0.35 + Math.sin(time * 2 + i) * 0.035);
      });
      steamMaterial.setFloat('time', reduced ? 0 : time);
    },
  };
}
