import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createSpeaker } from './speaker-model';
import { scrollPose } from './scroll-pose';
import { createPreviewSpotlight } from './preview-spotlight';

export function createSpeakerScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const studio = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(studio, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.7;
  studio.dispose();
  generator.dispose();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.set(0, 0, 4.4);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x303347, 1.5));
  const key = new THREE.DirectionalLight(0xffeed7, 3);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa1c9ff, 2);
  rim.position.set(3, 1, -3);
  scene.add(rim);
  const model = createSpeaker();
  scene.add(model.object);
  let progress = 0;
  let yaw = 0;
  let pitch = 0;
  function render() {
    const pose = scrollPose(progress);
    model.object.rotation.set(pose.pitch + pitch, pose.yaw + yaw, pose.roll);
    renderer.render(scene, camera);
  }
  const spotlight = createPreviewSpotlight(scene, canvas, render);
  let frame = 0;
  let velocity = 0;
  let previous = 0;
  function coast(now: number) {
    const dt = Math.min((now - previous) / 1000, 0.032);
    previous = now;
    yaw += velocity * dt;
    velocity *= Math.exp(-5 * dt);
    render();
    if (Math.abs(velocity) > 0.01) frame = requestAnimationFrame(coast);
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
    spotlight: spotlight.enable,
    progress(value: number) {
      progress = value;
      render();
    },
    colour(value: string) {
      model.shell.color.set(value);
      render();
    },
    stop() {
      cancelAnimationFrame(frame);
    },
    release(speed: number) {
      cancelAnimationFrame(frame);
      velocity = THREE.MathUtils.clamp(speed, -5, 5);
      previous = performance.now();
      frame = requestAnimationFrame(coast);
    },
    rotate(x: number, y = 0) {
      yaw += x;
      pitch += y;
      render();
    },
    reset() {
      cancelAnimationFrame(frame);
      yaw = 0;
      pitch = 0;
      render();
    },
    dispose() {
      observer.disconnect();
      spotlight.dispose();
      cancelAnimationFrame(frame);
      model.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
