import { useEffect, useRef, useState } from 'react';
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import type { Simulation, SimulationNodeDatum } from 'd3-force';
import { modules, links } from './data';

export type Node = SimulationNodeDatum & (typeof modules)[number] & { x: number; y: number };

export function useDependencyLayout(layout: string, paused: boolean) {
  const [positions, setPositions] = useState<Node[]>([]);
  const simulation = useRef<Simulation<Node, undefined> | null>(null);
  const nodes = useRef<Node[]>([]);
  function draw() {
    for (const node of nodes.current) {
      node.x = Math.max(65, Math.min(735, node.x));
      node.y = Math.max(45, Math.min(555, node.y));
    }
    setPositions(nodes.current.map((node) => ({ ...node })));
  }

  useEffect(() => {
    nodes.current = modules.map((node, index) => ({
      ...node,
      x: 400 + Math.cos(index * 2.4) * 160,
      y: 250 + Math.sin(index * 2.4) * 140,
    }));
    const target = (node: Node, axis: 'x' | 'y') => {
      if (layout === 'constellation') return axis === 'x' ? 400 : 300;
      return axis === 'x' ? [150, 420, 670][node.category] : 300;
    };
    const next = forceSimulation(nodes.current)
      .force(
        'links',
        forceLink<Node, { source: string; target: string }>(links.map((link) => ({ ...link })))
          .id((node) => node.id)
          .distance(110)
          .strength(layout === 'layers' ? 0.04 : 0.25),
      )
      .force('charge', forceManyBody().strength(-350))
      .force('collision', forceCollide(34))
      .force('x', forceX<Node>((node) => target(node, 'x')).strength(0.22))
      .force('y', forceY<Node>((node) => target(node, 'y')).strength(0.22))
      .on('tick', draw)
      .stop();
    simulation.current = next;
    next.tick(100);
    draw();
    return () => {
      next.stop();
      simulation.current = null;
    };
  }, [layout]);

  useEffect(() => {
    if (paused) simulation.current?.stop();
    else simulation.current?.alpha(0.7).restart();
  }, [paused, layout]);

  function pin(id: string, x: number, y: number) {
    const node = nodes.current.find((item) => item.id === id);
    if (!node) return;
    node.fx = node.x = Math.max(65, Math.min(735, x));
    node.fy = node.y = Math.max(45, Math.min(555, y));
    if (!paused) simulation.current?.alpha(0.4).restart();
    draw();
  }

  function release() {
    for (const node of nodes.current) {
      node.fx = null;
      node.fy = null;
    }
    if (!paused) simulation.current?.alpha(0.8).restart();
    draw();
  }

  return { positions, pin, release };
}
