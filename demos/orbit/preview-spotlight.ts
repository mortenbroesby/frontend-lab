import { Scene, SpotLight } from 'three';

/** A slow studio-light sweep; only renders while the preview is visible. */
export function createPreviewSpotlight(
  scene: Scene,
  canvas: HTMLCanvasElement,
  render: () => void,
) {
  const light = new SpotLight(0xffefd8, 0, 12, Math.PI / 5, 1, 2);
  light.position.set(-2.6, 1.8, 3);
  scene.add(light, light.target);
  let enabled = false;
  let visible = false;
  let frame = 0;
  let previous = 0;
  let angle = -0.8;

  function tick(now: number) {
    const elapsed = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    angle += elapsed * 0.42;
    light.position.set(Math.sin(angle) * 3, 1.5 + Math.cos(angle) * 1.4, 3);
    light.target.position.set(Math.sin(angle * 0.7) * 0.3, 0, 0);
    render();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    if (enabled && visible && !document.hidden) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry!.isIntersecting;
    sync();
  });
  observer.observe(canvas);
  document.addEventListener('visibilitychange', sync);
  return {
    enable(value: boolean) {
      enabled = value;
      light.intensity = value ? 45 : 0;
      sync();
      render();
    },
    dispose() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      scene.remove(light, light.target);
      light.dispose();
    },
  };
}
