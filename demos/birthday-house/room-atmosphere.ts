import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import type { ModelTools } from './room-model';
import village from './art/window-village.jpg';

export function windowLandscape(t: ModelTools, tall: boolean) {
  const x = tall ? -2.2 : -4.5;
  const y = tall ? 2.2 : 1.1;
  const material = t.material('moonlit Danish village', '#ffffff', 0);
  material.disableLighting = true;
  material.emissiveColor.set(0.83, 0.83, 0.88);
  material.diffuseTexture = new Texture(village, t.scene);
  const view = MeshBuilder.CreatePlane(
    'village beyond the glass',
    { width: 2.05, height: 3.15 },
    t.scene,
  );
  view.position.set(x, y, 2.55);
  view.material = material;
  view.metadata = { id: 'window' };
  t.anchors.set('window', view);
  const haze = new ShaderMaterial(
    'slow coastal mist',
    t.scene,
    {
      vertexSource:
        'precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec2 vUV;void main(){vUV=uv;gl_Position=worldViewProjection*vec4(position,1.0);}',
      fragmentSource:
        'precision highp float;varying vec2 vUV;uniform float time;void main(){vec2 p=vUV;float band=exp(-pow((p.y-.47)*8.,2.));float waves=.5+.5*sin(p.x*9.+sin(p.y*16.)+time*.13);float edge=smoothstep(0.,.06,p.x)*smoothstep(1.,.94,p.x);gl_FragColor=vec4(.53,.64,.73,band*waves*edge*.12);}',
    },
    {
      attributes: ['position', 'uv'],
      uniforms: ['worldViewProjection', 'time'],
      needAlphaBlending: true,
    },
  );
  const mist = MeshBuilder.CreatePlane(
    'mist beyond the window',
    { width: 2.05, height: 3.15 },
    t.scene,
  );
  mist.position.set(x, y, 2.51);
  mist.material = haze;
  mist.isPickable = false;
  return haze;
}

export function warmDetails(t: ModelTools, width: number, top: number) {
  const glow = new GlowLayer('gentle candle bloom', t.scene, {
    mainTextureFixedSize: 256,
    blurKernelSize: 32,
  });
  glow.intensity = 0.38;
  const amber = t.material('warm fairy-light glass', '#ffd29a', 0);
  amber.emissiveColor.set(1, 0.59, 0.22);
  for (let i = 0; i < 16; i++) {
    const x = (i / 15 - 0.5) * (width - 0.7);
    const y = top - 0.65 - 0.65 * Math.cos((x / (width - 0.5)) * Math.PI);
    const bulb = t.ball('little amber garland bulb', [0.055, 0.075, 0.055], [x, y, 1.8], amber);
    glow.addIncludedOnlyMesh(bulb);
  }
  const x = width > 10 ? -4.5 : -2.2;
  const y = width > 10 ? -0.52 : 0.58;
  t.round('sill candle brass saucer', 0.35, 0.045, [x + 0.7, y, 2.03], t.palette.gold);
  t.round('sill candle', 0.16, 0.35, [x + 0.7, y + 0.18, 2.03], t.palette.paper);
  const flame = t.ball('sill candle flame', [0.06, 0.15, 0.06], [x + 0.7, y + 0.43, 2.03], amber);
  glow.addIncludedOnlyMesh(flame);
  return glow;
}
