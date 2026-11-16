import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, KeyboardEvent } from 'react';
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import type { Simulation, SimulationNodeDatum } from 'd3-force';

const groups = [
  { name: 'Browser', colour: '#8ee6cc', topics: ['SVG', 'Canvas', 'Workers', 'WebRTC', 'Animation'] },
  { name: 'Quality', colour: '#ffc88a', topics: ['Dependencies', 'Boundaries', 'Complexity', 'Tests', 'Analysis'] },
  { name: 'Tooling', colour: '#9fc8ff', topics: ['Feedback', 'Builds', 'Debugging', 'Automation', 'Scripts'] },
  { name: 'Play', colour: '#e8b3f5', topics: ['Games', 'Data stories', 'Generative art', 'Quiz', 'Your idea'] },
];
const topics = groups.flatMap((group, category) => group.topics.map((name, index) => ({
  id: `${category}-${index}`, name, category,
})));
const connections = topics.flatMap((node, index) => [
  { source: node.id, target: topics[Math.floor(index / 5) * 5 + (index + 1) % 5].id },
  ...(index % 5 === 0 ? [{ source: node.id, target: topics[(index + 5) % topics.length].id }] : []),
]);
type Node = SimulationNodeDatum & typeof topics[number];

export function Constellation() {
  const [filter, setFilter] = useState('all');
  const [layout, setLayout] = useState('constellation');
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [selected, setSelected] = useState('');
  const [positions, setPositions] = useState<Node[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const simulation = useRef<Simulation<Node, undefined> | null>(null);
  const nodes = useRef<Node[]>([]);
  const visible = topics.filter(node => filter === 'all' || node.category === Number(filter));
  const links = connections.filter(link => visible.some(node => node.id === link.source) && visible.some(node => node.id === link.target));

  function draw() {
    for (const node of nodes.current) {
      node.x = Math.max(65, Math.min(735, node.x ?? 400));
      node.y = Math.max(45, Math.min(455, node.y ?? 250));
    }
    setPositions(nodes.current.map(node => ({ ...node })));
  }

  useEffect(() => {
    const current = topics.filter(node => filter === 'all' || node.category === Number(filter));
    nodes.current = current.map((node, index) => ({ ...node, x: 400 + Math.cos(index * 2.4) * 160, y: 250 + Math.sin(index * 2.4) * 140 }));
    const edges = connections.filter(link => current.some(node => node.id === link.source) && current.some(node => node.id === link.target));
    const target = (node: Node, axis: 'x' | 'y') => {
      if (layout === 'constellation') return axis === 'x' ? 400 : 250;
      const angle = node.category * Math.PI / 2 - Math.PI / 4;
      return axis === 'x' ? 400 + Math.cos(angle) * 220 : 250 + Math.sin(angle) * 145;
    };
    const next = forceSimulation(nodes.current)
      .force('links', forceLink<Node, { source: string; target: string }>(edges.map(link => ({ ...link }))).id(node => node.id).distance(95).strength(0.25))
      .force('charge', forceManyBody().strength(-350))
      .force('collision', forceCollide(36))
      .force('x', forceX<Node>(node => target(node, 'x')).strength(0.12))
      .force('y', forceY<Node>(node => target(node, 'y')).strength(0.12))
      .on('tick', draw)
      .stop();
    simulation.current = next;
    next.tick(100);
    draw();
    return () => { next.stop(); simulation.current = null; };
  }, [filter, layout]);

  useEffect(() => {
    if (paused) simulation.current?.stop();
    else simulation.current?.alpha(0.7).restart();
  }, [paused, filter, layout]);

  function pin(id: string, x: number, y: number) {
    const node = nodes.current.find(item => item.id === id);
    if (!node) return;
    node.fx = node.x = Math.max(65, Math.min(735, x));
    node.fy = node.y = Math.max(45, Math.min(455, y));
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
      pin(node.id, (node.x ?? 400) + delta[event.key][0], (node.y ?? 250) + delta[event.key][1]);
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

  const active = positions.find(node => node.id === selected);
  return (
    <div className="constellation-example">
      <div className="constellation-heading"><div><p className="eyebrow">D3 / an atlas of possibilities</p><h3>Ideas have a gravity of their own.</h3><p>Pull a thread. Move an idea. Watch the connections find a new shape.</p></div><span className="graph-count">{visible.length} ideas · {links.length} connections</span></div>
      <div className="constellation-stage">
        <svg ref={svg} viewBox="0 0 800 500" aria-label="Interactive idea network" role="group" aria-describedby="graph-help">
          <defs><radialGradient id="graph-glow"><stop stopColor="#254c50" /><stop offset="1" stopColor="#11272d" /></radialGradient></defs>
          <rect width="800" height="500" rx="16" fill="url(#graph-glow)" />
          <g aria-hidden="true">{links.map(link => {
            const source = positions.find(node => node.id === link.source);
            const target = positions.find(node => node.id === link.target);
            return source && target ? <line key={`${link.source}-${link.target}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#86a9a9" strokeOpacity={selected && selected !== link.source && selected !== link.target ? 0.12 : 0.5} /> : null;
          })}</g>
          {positions.map(node => <g key={node.id} data-node={node.id} className="graph-node" transform={`translate(${node.x},${node.y})`} tabIndex={0} role="button" aria-label={`${node.name}, ${groups[node.category].name}. Arrow keys move and pin.`} aria-pressed={selected === node.id}
            onFocus={() => setSelected(node.id)} onKeyDown={event => keyboard(event, node)}
            onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); pin(node.id, node.x ?? 400, node.y ?? 250); }}
            onPointerMove={event => move(event, node.id)} onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}>
            <circle className="node-halo" r="24" fill={groups[node.category].colour} opacity={selected === node.id ? 0.24 : 0.07} />
            <circle r="10" fill={groups[node.category].colour} stroke={selected === node.id ? '#fff' : '#11272d'} strokeWidth="2" />
            <text y="33" textAnchor="middle" fill="#f4f2eb" fontSize="12">{node.name}</text>
          </g>)}
        </svg>
      </div>
      <div className="graph-controls">
        <div><label htmlFor="graph-filter">Explore a cluster</label><select id="graph-filter" value={filter} onChange={event => { setFilter(event.target.value); setSelected(''); }}><option value="all">All ideas</option>{groups.map((group, index) => <option key={group.name} value={index}>{group.name}</option>)}</select></div>
        <div><label htmlFor="graph-layout">Shape the network</label><select id="graph-layout" value={layout} onChange={event => setLayout(event.target.value)}><option value="constellation">One constellation</option><option value="clusters">Four islands</option></select></div>
        <button className="secondary" onClick={() => setPaused(value => !value)}>{paused ? 'Resume motion' : 'Pause motion'}</button>
        <button className="secondary" onClick={release}>Release pinned ideas</button>
      </div>
      <div className="graph-notes"><p id="graph-help">Drag an idea to pin it, or focus it and use arrow keys. Shift moves further. Filtering or changing layout starts a fresh arrangement. Reduced-motion preference starts paused.</p><p role="status">{active ? `${active.name} · ${groups[active.category].name}${active.fx != null ? ' · pinned' : ''}` : 'Choose an idea to inspect it.'}</p><p className="small">Illustrative connections, not measured data. D3 calculates the forces; React draws the SVG. Try replacing these ideas with your own dataset.</p><p className="source">Start here: <code>src/examples/Constellation.tsx</code> · Build towards it with Track A or D.</p></div>
    </div>
  );
}
