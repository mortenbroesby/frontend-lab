import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, KeyboardEvent } from 'react';
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import type { Simulation, SimulationNodeDatum } from 'd3-force';

import { groups, modules, links } from './data';
import { impactOf } from './graph';
import './constellation.css';

type Node = SimulationNodeDatum & typeof modules[number] & { x: number; y: number };

export default function Constellation() {
  const [layout, setLayout] = useState('layers');
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [selected, setSelected] = useState('react-dom');
  const [positions, setPositions] = useState<Node[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const simulation = useRef<Simulation<Node, undefined> | null>(null);
  const nodes = useRef<Node[]>([]);
  const impact = impactOf(selected, links);
  const direct = [...impact.values()].filter(distance => distance === 1).length;
  const indirect = impact.size - direct - 1;
  const active = modules.find(node => node.id === selected)!;
  const byId = new Map(positions.map(node => [node.id, node]));

  function draw() {
    for (const node of nodes.current) {
      node.x = Math.max(65, Math.min(735, node.x));
      node.y = Math.max(45, Math.min(555, node.y));
    }
    setPositions(nodes.current.map(node => ({ ...node })));
  }

  useEffect(() => {
    const current = modules;
    nodes.current = current.map((node, index) => ({ ...node, x: 400 + Math.cos(index * 2.4) * 160, y: 250 + Math.sin(index * 2.4) * 140 }));
    const edges = links;
    const target = (node: Node, axis: 'x' | 'y') => {
      if (layout === 'constellation') return axis === 'x' ? 400 : 300;
      return axis === 'x' ? [150, 420, 670][node.category] : 300;
    };
    const next = forceSimulation(nodes.current)
      .force('links', forceLink<Node, { source: string; target: string }>(edges.map(link => ({ ...link }))).id(node => node.id).distance(110).strength(layout === 'layers' ? 0.04 : 0.25))
      .force('charge', forceManyBody().strength(-350))
      .force('collision', forceCollide(34))
      .force('x', forceX<Node>(node => target(node, 'x')).strength(0.22))
      .force('y', forceY<Node>(node => target(node, 'y')).strength(0.22))
      .on('tick', draw)
      .stop();
    simulation.current = next;
    next.tick(100);
    draw();
    return () => { next.stop(); simulation.current = null; };
  }, [layout]);

  useEffect(() => {
    if (paused) simulation.current?.stop();
    else simulation.current?.alpha(0.7).restart();
  }, [paused, layout]);

  function pin(id: string, x: number, y: number) {
    const node = nodes.current.find(item => item.id === id);
    if (!node) return;
    node.fx = node.x = Math.max(65, Math.min(735, x));
    node.fy = node.y = Math.max(45, Math.min(555, y));
    setSelected(id);
    if (!paused) simulation.current?.alpha(0.4).restart();
    draw();
  }

  function move(event: PointerEvent<SVGGElement>, id: string) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    pin(id, point.x, point.y);
  }

  function keyboard(event: KeyboardEvent<SVGGElement>, node: Node) {
    const step = event.shiftKey ? 40 : 15;
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (delta[event.key]) {
      event.preventDefault();
      pin(node.id, (node.x) + delta[event.key][0], (node.y) + delta[event.key][1]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelected(node.id);
    }
  }

  function release() {
    for (const node of nodes.current) { node.fx = null; node.fy = null; }
    if (!paused) simulation.current?.alpha(0.8).restart();
    draw();
  }

  const createHref = galleryHref('/create');
  return (
    <div className="constellation-example dependency-map">
      <div className="constellation-heading">
        <div><p className="eyebrow">D3 / follow the ripple</p><h3>One package changes.<br />How far does it reach?</h3><p>Explore the dependencies declared by this very repository. Choose a package to light up its consumers.</p></div>
        <span className="graph-count">{modules.length} packages · {links.length} declarations</span>
      </div>
      <div className="impact-presets" aria-label="Try a comparison">
        <span>Try this:</span>{['react-dom', 'react', 'd3-force', '@lab/demo-kit'].map(id => <button key={id} className="secondary" aria-pressed={selected === id} onClick={() => setSelected(id)}>{id}</button>)}
      </div>
      <div className="impact-summary" aria-live="polite">
        <div className="impact-selection"><span className="eyebrow">Selected package</span><strong>{active.id}</strong><small>{active.path}</small></div>
        <div><strong>{direct}</strong><span>direct consumers</span></div>
        <div><strong>{indirect}</strong><span>indirect consumers</span></div>
      </div>
      <div className="constellation-stage" data-paused={paused}>
        <svg ref={svg} viewBox="0 0 800 600" aria-label="Interactive dependency impact map" role="group" aria-describedby="graph-help">
          <defs>
            <radialGradient id="graph-glow"><stop stopColor="#254c50" /><stop offset="1" stopColor="#0b1c24" /></radialGradient>
            <marker id="dependency-arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#b9d3d1" /></marker>
          </defs>
          <rect width="800" height="600" rx="16" fill="url(#graph-glow)" />
          <g aria-hidden="true">{links.map(link => {
            const source = byId.get(link.source);
            const target = byId.get(link.target);
            const affected = impact.has(link.target) && impact.has(link.source);
            return source && target ? <line key={`${link.source}-${link.target}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} markerEnd="url(#dependency-arrow)" className={affected ? 'impact-edge' : 'quiet-edge'} /> : null;
          })}</g>
          {positions.map(node => <g key={node.id} className="graph-node" data-affected={impact.has(node.id)} data-selected={selected === node.id} transform={`translate(${node.x},${node.y})`} tabIndex={0} role="button" aria-label={`${node.id}. Select to trace consumers; arrow keys move and pin.`} aria-pressed={selected === node.id}
            onFocus={() => setSelected(node.id)} onKeyDown={event => keyboard(event, node)}
            onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); pin(node.id, node.x, node.y); }}
            onPointerMove={event => move(event, node.id)} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}>
            <title>{node.id}</title>
            <circle key={`${selected}-${node.id}`} className="impact-pulse" r="16" fill="none" stroke={groups[node.category].colour} style={{ animationDelay: `${(impact.get(node.id) ?? 0) * 350}ms` }} aria-hidden="true" />
            <circle className="node-halo" r="25" fill={groups[node.category].colour}  />
            <circle className="package-dot" r="10" fill={groups[node.category].colour} strokeWidth="2" />
            <text y="30" textAnchor="middle" fill="#f4f2eb"  fontSize="11">{node.name}</text>
            <text y="4" textAnchor="middle" fill="#11272d" fontSize="10" fontWeight="bold" aria-hidden="true">{impact.get(node.id)}</text>
          </g>)}
        </svg>
      </div>
      <div className="impact-legend">{groups.map(group => <span key={group.name}><i style={{ background: group.colour }} />{group.name}</span>)}<span>Arrow: consumer → dependency · Number: hops from selection</span></div>
      <div className="graph-controls">
        <div><label htmlFor="graph-package">Inspect a package</label><select id="graph-package" value={selected} onChange={event => setSelected(event.target.value)}>{modules.map(node => <option key={node.id} value={node.id}>{node.id}</option>)}</select></div>
        <div><label htmlFor="graph-layout">Layout</label><select id="graph-layout" value={layout} onChange={event => setLayout(event.target.value)}><option value="layers">Workspaces → runtime → tooling</option><option value="constellation">Let the forces decide</option></select></div>
        <button className="secondary" onClick={() => setPaused(value => !value)}>{paused ? 'Resume motion' : 'Pause motion'}</button>
        <button className="secondary" onClick={release}>Release pinned packages</button>
      </div>
      <div className="impact-insight">
        <div><h4>What could feel the change?</h4><p>Follow arrows backwards from the selected package. These consumers may need checking—not necessarily fixing.</p>
          {impact.size === 1 ? <p>No consumers are declared in this snapshot.</p> : <ul>{[...impact].filter(([, distance]) => distance > 0).map(([id, distance]) => <li key={id}><button onClick={() => setSelected(id)}>{id}</button><span>{distance === 1 ? 'direct' : `${distance} hops`}</span></li>)}</ul>}
        </div>
        <div><h4>Make one change. See the ripple.</h4><p>Compare <strong>d3-force</strong> with <strong>react</strong>, then select <strong>@lab/demo-kit</strong>. Try react-dom to reveal consumers two hops away. Which package connects the most workspaces?</p><p>Remix: add a real dependency to a demo’s <code>package.json</code>, reload this page, and find the new connection. <code>demos/constellation/data.ts</code> turns manifests into nodes and edges; <code>graph.ts</code> traces consumers.</p>{createHref && <a href={createHref}>Create your own graph experiment →</a>}</div>
      </div>
      <div className="graph-notes"><p id="graph-help">Drag a package to pin it, or focus a node and use arrow keys. Shift moves further. Changing layout resets pins. Reduced-motion preference starts paused.</p><p className="small">Build-time snapshot of workspace dependencies and devDependencies. External packages are leaves: transitive npm dependencies, imports, versions and actual runtime usage are not analysed. D3 controls positions; the graph connections determine impact.</p></div>
    </div>
  );
}
