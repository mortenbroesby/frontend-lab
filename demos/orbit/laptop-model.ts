import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createLaptop() {
  const object = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({
    color: '#b9b6ad',
    metalness: 0.8,
    roughness: 0.27,
  });
  const black = new THREE.MeshStandardMaterial({ color: '#10131a', roughness: 0.55 });
  const glass = new THREE.MeshStandardMaterial({
    color: '#06080e',
    metalness: 0.25,
    roughness: 0.15,
  });
  const trackpad = new THREE.MeshStandardMaterial({
    color: '#8e919b',
    metalness: 0.7,
    roughness: 0.4,
  });
  function box(
    parent: THREE.Group,
    size: [number, number, number],
    position: [number, number, number],
    material: THREE.Material,
    radius = 0.035,
  ) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 3, radius), material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  }
  box(object, [2.65, 0.13, 1.75], [0, 0, 0], shell, 0.06);
  box(object, [2.3, 0.018, 0.81], [0, 0.075, -0.24], black);
  const keyGeometry = new RoundedBoxGeometry(0.135, 0.025, 0.12, 2, 0.014);
  const keys = new THREE.InstancedMesh(keyGeometry, glass, 60);
  const matrix = new THREE.Matrix4();
  for (let i = 0; i < 60; i++) {
    keys.setMatrixAt(
      i,
      matrix.makeTranslation(((i % 15) - 7) * 0.148, 0.098, Math.floor(i / 15) * 0.16 - 0.52),
    );
  }
  object.add(keys);
  box(object, [0.84, 0.025, 0.1], [0, 0.098, 0.11], glass, 0.015);
  box(object, [0.94, 0.012, 0.44], [0, 0.074, 0.51], trackpad, 0.025);
  for (const x of [-1.326, 1.326]) {
    for (const z of [-0.54, -0.24]) box(object, [0.012, 0.035, 0.15], [x, 0, z], black, 0.008);
  }
  const lid = new THREE.Group();
  lid.position.set(0, 0.08, -0.8);
  object.add(lid);
  box(lid, [2.65, 1.68, 0.085], [0, 0.84, 0], shell, 0.05);
  box(lid, [2.53, 1.55, 0.012], [0, 0.85, 0.049], glass, 0.03);
  const texture = createWallpaper();
  const display = new THREE.MeshBasicMaterial({ map: texture });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.4), display);
  screen.position.set(0, 0.85, 0.057);
  lid.add(screen);
  box(lid, [0.3, 0.065, 0.014], [0, 1.6, 0.056], black, 0.01);
  // A small embossed mark makes the closed lid readable during the turn.
  const mark = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 48), trackpad);
  mark.position.set(0, 0.84, -0.05);
  lid.add(mark);
  return {
    object,
    lid,
    shell,
    dispose() {
      keys.dispose();
      object.traverse((mesh) => {
        if (mesh instanceof THREE.Mesh) mesh.geometry.dispose();
      });
      [shell, black, glass, trackpad, display].forEach((material) => material.dispose());
      texture.dispose();
    },
  };
}

function createWallpaper() {
  const artwork = document.createElement('canvas');
  artwork.width = 1024;
  artwork.height = 640;
  const ctx = artwork.getContext('2d')!;
  ctx.fillStyle = '#071021';
  ctx.fillRect(0, 0, 1024, 640);
  const glow = ctx.createRadialGradient(690, 230, 0, 520, 320, 700);
  glow.addColorStop(0, '#cbfaff');
  glow.addColorStop(0.25, '#438deb');
  glow.addColorStop(0.55, '#4834a6');
  glow.addColorStop(1, '#080d22');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1024, 640);
  for (let i = 0; i < 12; i++) {
    ctx.strokeStyle = `rgba(220,240,255,${0.24 - i * 0.015})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(650, 440, 180 + i * 35, 340 + i * 20, -0.8, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = '500 48px sans-serif';
  ctx.fillText('Make room.', 66, 125);
  ctx.font = '22px sans-serif';
  ctx.fillText('For what comes next.', 68, 166);
  const texture = new THREE.CanvasTexture(artwork);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
