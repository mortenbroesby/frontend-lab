import { forceCollide, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { createGarden, targetFor, type Formation } from './model';
import { paintGarden, type View } from './paint';

export class Garden {
  private data = createGarden();
  private simulation = forceSimulation(this.data.nodes)
    .stop()
    .force('charge', forceManyBody().strength(-1.1))
    .force('collision', forceCollide(3.2).strength(0.7));
  private xForce = forceX<(typeof this.data.nodes)[number]>().strength(0.045);
  private yForce = forceY<(typeof this.data.nodes)[number]>().strength(0.045);
  private view: View = { width: 1, height: 1, scale: 1, ratio: 1 };
  private mode: Formation = 'orbit';
  private selected: number | null = null;
  private running = false;
  private frame = 0;
  private time = 0;
  private last = 0;
  private pulseAt = -10;
  private pointer: { x: number; y: number } | null = null;
  private observer: ResizeObserver;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.simulation.force('x', this.xForce).force('y', this.yForce).alphaDecay(0);
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    canvas.addEventListener('pointermove', this.move);
    canvas.addEventListener('pointerleave', this.leave);
    canvas.addEventListener('pointerdown', this.pointerDown);
    this.resize();
    this.setOptions('orbit', null, false);
  }

  setOptions(mode: Formation, selected: number | null, running: boolean) {
    const changed = mode !== this.mode;
    this.mode = mode;
    this.selected = selected;
    this.targets();
    if (!running && changed) this.simulation.tick(120);
    this.setRunning(running);
    this.draw();
  }

  private setRunning(running: boolean) {
    if (running === this.running) return;
    this.running = running;
    cancelAnimationFrame(this.frame);
    if (running) {
      this.last = performance.now();
      this.frame = requestAnimationFrame(this.tick);
    }
  }

  burst() {
    if (!this.running) return;
    this.pulseAt = this.time;
    for (const node of this.data.nodes) {
      const distance = Math.hypot(node.x, node.y) || 1;
      node.vx = (node.x / distance) * 16;
      node.vy = (node.y / distance) * 16;
    }
  }

  private targets() {
    this.xForce.x((node) => targetFor(node, this.mode, this.time).x);
    this.yForce.y((node) => targetFor(node, this.mode, this.time).y);
  }

  private tick = (now: number) => {
    this.time += Math.min((now - this.last) / 1000, 0.04);
    this.last = now;
    this.targets();
    this.simulation.tick();
    this.repelPointer();
    this.draw();
    if (this.running) this.frame = requestAnimationFrame(this.tick);
  };

  private repelPointer() {
    if (!this.pointer) return;
    for (const node of this.data.nodes) {
      const dx = node.x - this.pointer.x,
        dy = node.y - this.pointer.y;
      const distance = Math.hypot(dx, dy);
      const strength = Math.max(0, 1 - distance / 90) * 2;
      const divisor = Math.max(1, distance);
      node.vx += (dx / divisor) * strength;
      node.vy += (dy / divisor) * strength;
    }
  }

  private move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = this.canvas.getBoundingClientRect();
    this.pointer = {
      x: (event.clientX - bounds.left - this.view.width / 2) / this.view.scale,
      y: (event.clientY - bounds.top - this.view.height / 2) / this.view.scale,
    };
  };
  private leave = () => {
    this.pointer = null;
  };
  private pointerDown = () => {
    this.burst();
  };

  private resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    this.view = { width, height, ratio, scale: Math.min(width / 860, height / 560) };
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.draw();
  }

  private draw() {
    paintGarden(this.ctx, this.view, {
      ...this.data,
      selected: this.selected,
      time: this.time,
      pulse: this.time - this.pulseAt,
    });
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.simulation.stop();
    this.observer.disconnect();
    this.canvas.removeEventListener('pointermove', this.move);
    this.canvas.removeEventListener('pointerleave', this.leave);
    this.canvas.removeEventListener('pointerdown', this.pointerDown);
  }
}
