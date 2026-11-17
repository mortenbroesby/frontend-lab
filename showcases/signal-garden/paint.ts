import { families, type Particle, type Connection } from './model';

export interface View {
  width: number;
  height: number;
  scale: number;
  ratio: number;
}
export interface Scene {
  nodes: Particle[];
  links: Connection[];
  selected: number | null;
  time: number;
  pulse: number;
}

function drawBackdrop(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#ffffff0c';
  ctx.lineWidth = 0.7;
  for (let x = -450; x <= 450; x += 50)
    for (let y = -300; y <= 300; y += 50) {
      ctx.beginPath();
      ctx.moveTo(x - 2, y);
      ctx.lineTo(x + 2, y);
      ctx.moveTo(x, y - 2);
      ctx.lineTo(x, y + 2);
      ctx.stroke();
    }
}

function drawConnections(ctx: CanvasRenderingContext2D, scene: Scene) {
  ctx.lineWidth = 0.65;
  for (const link of scene.links) {
    const a = scene.nodes[link.source];
    const b = scene.nodes[link.target];
    ctx.globalAlpha = scene.selected === null || a.group === scene.selected ? 0.2 : 0.025;
    ctx.strokeStyle = families[a.group].color;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  node: Particle,
  selected: number | null,
  time: number,
) {
  const focused = selected === null || selected === node.group;
  const color = families[node.group].color;
  ctx.globalAlpha = focused ? 0.8 + Math.sin(time + node.id) * 0.2 : 0.12;
  if (node.order === 0) {
    const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 32);
    glow.addColorStop(0, `${color}60`);
    glow.addColorStop(1, `${color}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(node.x - 32, node.y - 32, 64, 64);
    ctx.strokeStyle = `${color}70`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
  ctx.fill();
}

export function paintGarden(ctx: CanvasRenderingContext2D, view: View, scene: Scene) {
  ctx.setTransform(view.ratio, 0, 0, view.ratio, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);
  ctx.translate(view.width / 2, view.height / 2);
  ctx.scale(view.scale, view.scale);
  drawBackdrop(ctx);
  drawConnections(ctx, scene);
  for (const node of scene.nodes) drawParticle(ctx, node, scene.selected, scene.time);
  ctx.globalAlpha = 1;
  if (scene.pulse > 0 && scene.pulse < 2) {
    ctx.strokeStyle = `rgba(180,245,155,${(1 - scene.pulse / 2) * 0.35})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, scene.pulse * 260, 0, Math.PI * 2);
    ctx.stroke();
  }
}
