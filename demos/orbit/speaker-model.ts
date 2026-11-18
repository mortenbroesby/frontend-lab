import * as THREE from 'three';

export function createSpeaker() {
  const speaker = new THREE.Group();

  const shell = new THREE.MeshStandardMaterial({
    color: '#b9b6ad',
    metalness: 0.8,
    roughness: 0.38,
  });
  const dark = new THREE.MeshStandardMaterial({ color: '#41464b', roughness: 0.85 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#08090a', roughness: 1 });
  const light = new THREE.MeshStandardMaterial({
    color: '#d5ffc6',
    emissive: '#98d888',
    emissiveIntensity: 2,
  });
  function disc(radius: number, depth: number, z: number, material: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 96), material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.z = z;
    speaker.add(mesh);
    return mesh;
  }
  // The curved aluminium body is a surface of revolution, not a flat image.
  const curve = new THREE.SplineCurve([
    new THREE.Vector2(0.86, -0.34),
    new THREE.Vector2(0.97, -0.31),
    new THREE.Vector2(1.02, -0.22),
    new THREE.Vector2(1.03, 0.15),
    new THREE.Vector2(1.01, 0.28),
    new THREE.Vector2(0.97, 0.35),
  ]);
  const profile = [new THREE.Vector2(0, -0.34), ...curve.getPoints(48), new THREE.Vector2(0, 0.35)];
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), shell);
  body.rotation.x = Math.PI / 2;
  speaker.add(body);
  disc(0.97, 0.035, 0.39, dark);
  disc(0.8, 0.035, -0.355, rubber);
  disc(0.68, 0.035, -0.375, dark);
  const holes = createGrille(rubber);
  speaker.add(holes);
  const port = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.035), rubber);
  port.position.set(0, -0.26, -0.415);
  speaker.add(port);
  const power = disc(0.075, 0.025, -0.42, dark);
  power.position.y = 0.2;
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), light);
  led.position.set(0, -0.98, 0.28);
  speaker.add(led);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.976, 0.018, 12, 128), shell);
  rim.position.z = 0.405;
  speaker.add(rim);
  const controls = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.26, 6, 12), rubber);
  controls.rotation.z = Math.PI / 2;
  controls.position.set(0, 0.63, 0.425);
  speaker.add(controls);
  for (const x of [-0.12, 0, 0.12]) {
    const button = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), shell);
    button.position.set(x, 0.63, 0.478);
    speaker.add(button);
  }
  return {
    object: speaker,
    shell,
    dispose() {
      holes.dispose();
      speaker.traverse((mesh) => {
        if (mesh instanceof THREE.Mesh) mesh.geometry.dispose();
      });
      [shell, dark, rubber, light].forEach((material) => material.dispose());
    },
  };
}

function createGrille(rubber: THREE.Material) {
  // Instancing keeps the perforated grille to one draw call.
  const points: [number, number][] = [];
  for (let y = -0.9; y <= 0.9; y += 0.038) {
    for (let x = -0.9; x <= 0.9; x += 0.038) {
      if (x * x + y * y < 0.85) points.push([x, y]);
    }
  }
  const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(0.012, 6), rubber, points.length);
  const matrix = new THREE.Matrix4();
  points.forEach(([x, y], i) => holes.setMatrixAt(i, matrix.makeTranslation(x, y, 0.411)));
  return holes;
}
