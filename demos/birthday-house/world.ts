import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import { roomView, type ObjectId, type RoomView } from './locations';
import { initialState, type Game } from './game';
import { paintedRoom, glowMaterial } from './engine-art';
import { roomLighting } from './engine-light';
import { atticPuzzle } from './engine-puzzles';
import { darkroomPuzzle } from './engine-darkroom';
import { breakfastPuzzle } from './breakfast-effects';

function bundle(scene: Scene, view: RoomView, invalidate: () => void) {
  const start = scene.meshes.length;
  paintedRoom(scene, view, invalidate);
  const lighting = roomLighting(scene, view);
  const puzzle: {
    tick: (state: Game, time: number, reduced: boolean, dt: number, finaleTime: number) => void;
    setEnabled?: (enabled: boolean) => void;
  } = [breakfastPuzzle, darkroomPuzzle, atticPuzzle][view.room]!(scene, view);
  const meshes = scene.meshes.slice(start);
  return {
    enable(enabled: boolean) {
      meshes.forEach((m) => m.setEnabled(enabled));
      lighting.setEnabled(enabled);
      puzzle.setEnabled?.(enabled);
    },
    tick(s: Game, time: number, reduced: boolean, dt: number, finaleTime: number) {
      lighting.tick(time, reduced);
      puzzle.tick(s, time, reduced, dt, finaleTime);
    },
  };
}
function makeDust(scene: Scene) {
  const material = glowMaterial(scene, 'golden dust', '#ead19b');
  material.alpha = 0.32;
  return Array.from({ length: 32 }, (_, i) => {
    const m = MeshBuilder.CreatePlane('dust', { size: 0.008 + (i % 3) * 0.01 }, scene);
    m.material = material;
    m.isPickable = false;
    m.position.set(Math.sin(i * 5.7) * 8, Math.cos(i * 2.1) * 10, -1 - (i % 4) * 0.3);
    return m;
  });
}
function pointerControls(canvas: HTMLCanvasElement, onPan: (delta: number) => void) {
  const state = { x: 0, y: 0, moved: false };
  let dragging = false;
  let downX = 0;
  let downY = 0;
  const down = (e: PointerEvent) => {
    downX = e.clientX;
    downY = e.clientY;
    dragging = true;
    state.moved = false;
  };
  const move = (e: PointerEvent) => {
    state.x = (e.clientX / canvas.clientWidth - 0.5) * 0.12;
    state.y = (0.5 - e.clientY / canvas.clientHeight) * 0.08;
    if (!dragging) return;
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 8) state.moved = true;
    if (state.moved) {
      onPan(((downX - e.clientX) / canvas.clientWidth) * 0.45);
      downX = e.clientX;
      downY = e.clientY;
    }
  };
  const up = () => {
    dragging = false;
  };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
  return {
    state,
    dispose() {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    },
  };
}
function projectStage(
  canvas: HTMLCanvasElement,
  stage: HTMLDivElement,
  camera: FreeCamera,
  view: RoomView,
) {
  const visibleHeight = -camera.position.z * 2 * Math.tan(camera.fov / 2);
  const scale = canvas.clientHeight / visibleHeight;
  Object.assign(stage.style, {
    width: `${view.width * scale}px`,
    height: `${view.height * scale}px`,
    left: `${(canvas.clientWidth - view.width * scale) / 2 - camera.position.x * scale}px`,
    top: `${(canvas.clientHeight - view.height * scale) / 2 + camera.position.y * scale}px`,
  });
}
export function createWorld(
  canvas: HTMLCanvasElement,
  stage: HTMLDivElement,
  onPick: (id: ObjectId) => void,
  onPan: (delta: number) => void,
  onReady: (ready: boolean) => void,
  onFinaleReady: () => void,
) {
  const engine = new Engine(canvas, true, { stencil: false, powerPreference: 'low-power' });
  engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio, 2));
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.035, 0.06, 0.075, 1);
  const camera = new FreeCamera('visitor', new Vector3(0, 0, -12), scene);
  camera.fov = 0.9;
  camera.minZ = 0.1;
  camera.maxZ = 40;
  const ambient = new HemisphericLight('blue-hour ambient', new Vector3(0, 0.2, -1), scene);
  ambient.intensity = 0.65;
  ambient.diffuse = Color3.White();
  ambient.groundColor = Color3.FromHexString('#617b91');
  const motes = makeDust(scene);
  const pointer = pointerControls(canvas, onPan);
  let dirty = true;
  let renderedReady = false;
  let waitingForRoom = true;
  let settleUntil = performance.now() + 1800;
  let lastFrame = performance.now();
  let game = initialState();
  let finaleTime = 0;
  let finaleNotified = false;
  let reduced = false;
  let pan = 0.5;
  let close = false;
  let portrait = false;
  const cache = new Map<string, ReturnType<typeof bundle>>();
  let active: ReturnType<typeof bundle> | undefined;
  const invalidate = () => {
    dirty = true;
    renderedReady = false;
    settleUntil = performance.now() + 1000;
  };
  scene.onPointerObservable.add((event) => {
    if (event.type !== PointerEventTypes.POINTERPICK || pointer.state.moved) return;
    const id = event.pickInfo?.pickedMesh?.metadata?.id as ObjectId | undefined;
    if (id) onPick(id);
  });
  const resize = () => {
    engine.resize();
    invalidate();
  };
  window.addEventListener('resize', resize);
  const resumeClock = () => {
    lastFrame = performance.now();
  };
  document.addEventListener('visibilitychange', resumeClock);
  function positionCamera(view: RoomView, dt: number) {
    const ratio = canvas.clientWidth / canvas.clientHeight;
    const visibleHeight = Math.max(view.height, view.width / ratio) / (close ? 1.12 : 1);
    const range = Math.max(0, (view.width - visibleHeight * ratio) / 2);
    const x = (pan - 0.5) * range * 2 + (reduced ? 0 : pointer.state.x * 0.35);
    const y = reduced ? 0 : pointer.state.y * 0.35;
    const distance = visibleHeight / (2 * Math.tan(camera.fov / 2));
    camera.position = Vector3.Lerp(
      camera.position,
      new Vector3(x, y, -distance),
      reduced ? 1 : 1 - Math.exp(-dt / 180),
    );
    camera.setTarget(new Vector3(camera.position.x, camera.position.y, 0));
  }
  function render(now: number) {
    if (document.hidden || now - lastFrame < 32) return;
    if (reduced && !dirty && now > settleUntil && renderedReady) return;
    const elapsed = now - lastFrame;
    const dt = Math.min(elapsed, 100);
    lastFrame = now;
    dirty = false;
    const view = roomView(game.room, portrait);
    positionCamera(view, dt);
    projectStage(canvas, stage, camera, view);
    finaleTime = game.revealed ? Math.min(6500, finaleTime + elapsed) : 0;
    if (finaleTime >= 6500 && !finaleNotified) {
      finaleNotified = true;
      onFinaleReady();
    }
    stage.style.setProperty('--look-x', `${pointer.state.x * 35}px`);
    stage.style.setProperty('--look-y', `${pointer.state.y * 35}px`);
    active?.tick(game, now / 1000, reduced, dt, finaleTime);
    if (!reduced)
      motes.forEach((m, i) => {
        m.position.y += dt * 0.00004 * (1 + (i % 3));
        if (m.position.y > 10) m.position.y = -10;
      });
    scene.render();
    renderedReady = scene.isReady();
    if (renderedReady && waitingForRoom && active) {
      waitingForRoom = false;
      onReady(true);
    }
  }
  engine.runRenderLoop(() => render(performance.now()));
  return {
    update(next: Game, reduce: boolean, nextPan: number, inspect: boolean, tall: boolean) {
      game = next;
      if (!next.revealed) finaleNotified = false;
      reduced = reduce;
      pan = nextPan;
      close = inspect;
      portrait = tall;
      invalidate();
      const key = `${game.room}-${portrait}`;
      if (!cache.has(key)) {
        waitingForRoom = true;
        onReady(false);
        cache.set(key, bundle(scene, roomView(game.room, portrait), invalidate));
      }
      cache.forEach((b, k) => b.enable(k === key));
      active = cache.get(key);
    },
    dispose() {
      pointer.dispose();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', resumeClock);
      scene.dispose();
      engine.dispose();
    },
  };
}
