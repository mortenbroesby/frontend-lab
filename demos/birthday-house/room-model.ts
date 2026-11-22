import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Scene } from '@babylonjs/core/scene';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { ObjectId } from './locations';

export function modelTools(scene: Scene) {
  const casters: Mesh[] = [];
  const anchors = new Map<ObjectId, Mesh>();
  const material = (name: string, color: string, gloss = 0.1) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = Color3.FromHexString(color);
    m.specularColor = new Color3(gloss, gloss, gloss);
    m.specularPower = 48;
    m.maxSimultaneousLights = 6;
    return m;
  };
  const wood = material('warm walnut grain', '#a47b56');
  const grain = new DynamicTexture('fine wood grain', { width: 512, height: 512 }, scene, true);
  const ctx = grain.getContext() as CanvasRenderingContext2D;
  ctx.fillStyle = '#aa8058';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) {
    ctx.strokeStyle = `rgba(49,24,12,${0.03 + (i % 7) * 0.016})`;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 8) {
      const y = i * 2 + Math.sin(x / 83 + i * 0.17) * 2.8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  grain.update();
  wood.diffuseTexture = grain;
  const palette = {
    wood,
    wall: material('deep peacock plaster', '#315c58'),
    trim: material('painted teal joinery', '#24413f'),
    gold: material('aged brass', '#b88b48', 0.28),
    cream: material('warm porcelain', '#f5dfb3', 0.22),
    red: material('Danish red', '#ac2636'),
    green: material('velvet leaves', '#42674b'),
    paper: material('ivory letter paper', '#f0d9aa'),
    dark: material('shadow velvet', '#142a2e'),
  };
  function finish(mesh: Mesh, at: number[], mat: StandardMaterial, id?: ObjectId) {
    mesh.position.set(at[0]!, at[1]!, at[2]!);
    mesh.material = mat;
    mesh.receiveShadows = true;
    mesh.isPickable = !!id;
    if (id) {
      mesh.metadata = { id };
      if (!anchors.has(id)) anchors.set(id, mesh);
    }
    casters.push(mesh);
    return mesh;
  }
  function box(name: string, size: number[], at: number[], mat: StandardMaterial, id?: ObjectId) {
    return finish(
      MeshBuilder.CreateBox(name, { width: size[0], height: size[1], depth: size[2] }, scene),
      at,
      mat,
      id,
    );
  }
  function round(
    name: string,
    diameter: number,
    height: number,
    at: number[],
    mat: StandardMaterial,
    id?: ObjectId,
  ) {
    return finish(
      MeshBuilder.CreateCylinder(name, { diameter, height, tessellation: 48 }, scene),
      at,
      mat,
      id,
    );
  }
  function ball(name: string, size: number[], at: number[], mat: StandardMaterial, id?: ObjectId) {
    return finish(
      MeshBuilder.CreateSphere(
        name,
        { diameterX: size[0], diameterY: size[1], diameterZ: size[2], segments: 16 },
        scene,
      ),
      at,
      mat,
      id,
    );
  }
  function line(name: string, points: Vector3[], radius: number, mat: StandardMaterial) {
    return finish(
      MeshBuilder.CreateTube(name, { path: points, radius, tessellation: 8 }, scene),
      [0, 0, 0],
      mat,
    );
  }
  return { scene, palette, material, box, round, ball, line, anchors, casters };
}
export type ModelTools = ReturnType<typeof modelTools>;
