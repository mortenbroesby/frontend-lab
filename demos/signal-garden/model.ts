import type { SimulationNodeDatum } from 'd3-force';

export const families = [
  {
    name: 'Motion',
    color: '#b4f59b',
    note: 'A few forces can create behaviour that feels alive.',
    idea: 'Make a flock, a magnetic field or a world with its own rules.',
  },
  {
    name: 'Sound',
    color: '#a6c9ff',
    note: 'Rhythm can become a shape you can explore.',
    idea: 'Map audio frequencies to the size and movement of a constellation.',
  },
  {
    name: 'Nature',
    color: '#ffcc83',
    note: 'Simple local rules can produce complex collective patterns.',
    idea: 'Let particles grow, seek light or exchange energy with neighbours.',
  },
  {
    name: 'Space',
    color: '#d2acff',
    note: 'Position can tell a story before you read a single label.',
    idea: 'Turn a collection of places or memories into a navigable atlas.',
  },
  {
    name: 'Signals',
    color: '#ff9fb4',
    note: 'Connections reveal structure that individual points cannot.',
    idea: 'Visualise messages passing between devices, services or people.',
  },
  {
    name: 'Patterns',
    color: '#7de3d9',
    note: 'The same ingredients can make very different compositions.',
    idea: 'Invent a layout rule and watch the system find its new balance.',
  },
] as const;
export const formations = [
  { id: 'orbit', name: 'Orbit', detail: 'A shared centre. Six interwoven paths.' },
  { id: 'clusters', name: 'Gather', detail: 'Local connections become distinct communities.' },
  { id: 'helix', name: 'Weave', detail: 'Six strands, finding a common rhythm.' },
] as const;
export type Formation = (typeof formations)[number]['id'];
export interface Particle extends SimulationNodeDatum {
  vx: number;
  vy: number;
  id: number;
  group: number;
  order: number;
  radius: number;
  x: number;
  y: number;
}
export interface Connection {
  source: number;
  target: number;
}
const goldenAngle = Math.PI * (3 - Math.sqrt(5));

export function targetFor(node: Particle, formation: Formation, time: number) {
  const phase = (node.group * Math.PI) / 3;
  const fraction = node.order / 64;
  if (formation === 'clusters') {
    const angle = node.order * goldenAngle + time * 0.06;
    const radius = Math.sqrt(fraction) * 78;
    return {
      x: Math.cos(phase) * 265 + Math.cos(angle) * radius,
      y: Math.sin(phase) * 175 + Math.sin(angle) * radius,
    };
  }
  if (formation === 'helix') {
    const angle = fraction * Math.PI * 4 + phase + time * 0.12;
    return { x: (fraction - 0.5) * 740, y: Math.sin(angle) * 160 + Math.cos(phase) * 32 };
  }
  const angle = fraction * Math.PI * 2 + phase + time * 0.08;
  const radius = 115 + node.group * 28 + Math.sin(fraction * Math.PI * 6) * 18;
  return { x: Math.cos(angle) * radius * 1.25, y: Math.sin(angle) * radius * 0.85 };
}

export function createGarden() {
  const nodes: Particle[] = Array.from({ length: 384 }, (_, id) => {
    const node = {
      id,
      group: Math.floor(id / 64),
      order: id % 64,
      radius: id % 64 === 0 ? 5 : 1.6 + (id % 7) * 0.28,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    };
    return { ...node, ...targetFor(node, 'orbit', 0) };
  });
  const links: Connection[] = [];
  for (const node of nodes) {
    const base = node.group * 64;
    links.push({ source: node.id, target: base + ((node.order + 1) % 64) });
    if (node.order % 4 === 0 && node.order !== 0) links.push({ source: base, target: node.id });
  }
  return { nodes, links };
}
