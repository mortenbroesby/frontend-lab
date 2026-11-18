import * as THREE from 'three';

export function createSpeakerScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.set(0, 0, 4.8);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x303347, 3));
  const key = new THREE.DirectionalLight(0xffeed7, 5);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa1c9ff, 4);
  rim.position.set(3, 1, -3);
  scene.add(rim);
  const speaker = new THREE.Group();
  scene.add(speaker);
  const shell = new THREE.MeshStandardMaterial({
    color: '#b9b6ad',
    metalness: 0.65,
    roughness: 0.32,
  });
  const dark = new THREE.MeshStandardMaterial({ color: '#16191c', roughness: 0.85 });
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
  const profile = [
    new THREE.Vector2(0, -0.38),
    new THREE.Vector2(0.85, -0.38),
    new THREE.Vector2(0.97, -0.32),
    new THREE.Vector2(1.03, -0.2),
    new THREE.Vector2(1.03, 0.25),
    new THREE.Vector2(0.98, 0.34),
    new THREE.Vector2(0, 0.34),
  ];
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), shell);
  body.rotation.x = Math.PI / 2;
  speaker.add(body);
  disc(0.97, 0.035, 0.39, dark);
  disc(0.76, 0.035, -0.35, rubber);
  disc(0.64, 0.04, -0.38, shell);
  // Instancing keeps the perforated grille to one draw call.
  const points: [number, number][] = [];
  for (let y = -0.9; y <= 0.9; y += 0.045) {
    for (let x = -0.9; x <= 0.9; x += 0.045) {
      if (x * x + y * y < 0.85) points.push([x, y]);
    }
  }
  const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(0.013, 6), rubber, points.length);
  const matrix = new THREE.Matrix4();
  points.forEach(([x, y], i) => holes.setMatrixAt(i, matrix.makeTranslation(x, y, 0.411)));
  speaker.add(holes);
  const port = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.035), rubber);
  port.position.set(0, -0.26, -0.415);
  speaker.add(port);
  const power = disc(0.075, 0.025, -0.42, dark);
  power.position.y = 0.2;
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), light);
  led.position.set(0, -0.98, 0.28);
  speaker.add(led);
  let progress = 0;
  let yaw = 0;
  let pitch = 0;
  const phase = (value: number, start: number, end: number) =>
    THREE.MathUtils.smoothstep(value, start, end);
  function render() {
    speaker.rotation.set(
      0.16 + phase(progress, 0.46, 0.74) * Math.PI * 2 + pitch,
      -0.35 + phase(progress, 0.18, 0.42) * Math.PI * 2 + yaw,
      -0.12,
    );
    renderer.render(scene, camera);
  }
  const observer = new ResizeObserver(() => {
    const { width, height } = canvas.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    render();
  });
  observer.observe(canvas);
  return {
    progress(value: number) {
      progress = value;
      render();
    },
    colour(value: string) {
      shell.color.set(value);
      render();
    },
    rotate(x: number, y = 0) {
      yaw += x;
      pitch += y;
      render();
    },
    reset() {
      yaw = 0;
      pitch = 0;
      render();
    },
    dispose() {
      observer.disconnect();
      holes.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      [shell, dark, rubber, light].forEach((material) => material.dispose());
      renderer.dispose();
    },
  };
}
