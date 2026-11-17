import { useRef, type PointerEvent, type KeyboardEvent } from 'react';
import { groups, links } from './data';
import type { Node } from './use-dependency-layout';

export function DependencyGraph({
  positions,
  paused,
  selected,
  impact,
  onSelect,
  onPin,
}: {
  positions: Node[];
  paused: boolean;
  selected: string;
  impact: Map<string, number>;
  onSelect: (id: string) => void;
  onPin: (id: string, x: number, y: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const byId = new Map(positions.map((node) => [node.id, node]));
  function pin(id: string, x: number, y: number) {
    onPin(id, x, y);
    onSelect(id);
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
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (delta[event.key]) {
      event.preventDefault();
      pin(node.id, node.x + delta[event.key][0], node.y + delta[event.key][1]);
    } else if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      onSelect(node.id);
    }
  }

  return (
    <div className="constellation-stage" data-paused={paused}>
      <svg
        ref={svg}
        viewBox="0 0 800 600"
        aria-label="Interactive dependency impact map"
        role="group"
        aria-describedby="graph-help"
      >
        <defs>
          <radialGradient id="graph-glow">
            <stop stopColor="#254c50" />
            <stop offset="1" stopColor="#0b1c24" />
          </radialGradient>
          <marker
            id="dependency-arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#b9d3d1" />
          </marker>
        </defs>
        <rect width="800" height="600" rx="16" fill="url(#graph-glow)" />
        <g aria-hidden="true">
          {links.map((link) => {
            const source = byId.get(link.source);
            const target = byId.get(link.target);
            const affected = [link.target, link.source].every((id) => impact.has(id));
            return source && target ? (
              <line
                key={`${link.source}-${link.target}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                markerEnd="url(#dependency-arrow)"
                className={affected ? 'impact-edge' : 'quiet-edge'}
              />
            ) : null;
          })}
        </g>
        {positions.map((node) => (
          <g
            key={node.id}
            className="graph-node"
            data-affected={impact.has(node.id)}
            data-selected={selected === node.id}
            transform={`translate(${node.x},${node.y})`}
            tabIndex={0}
            role="button"
            aria-label={`${node.id}. Select to trace consumers; arrow keys move and pin.`}
            aria-pressed={selected === node.id}
            onFocus={() => onSelect(node.id)}
            onKeyDown={(event) => keyboard(event, node)}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              pin(node.id, node.x, node.y);
            }}
            onPointerMove={(event) => move(event, node.id)}
            onPointerUp={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                event.currentTarget.releasePointerCapture(event.pointerId);
            }}
          >
            <title>{node.id}</title>
            <circle
              key={`${selected}-${node.id}`}
              className="impact-pulse"
              r="16"
              fill="none"
              stroke={groups[node.category].colour}
              style={{ animationDelay: `${(impact.get(node.id) ?? 0) * 350}ms` }}
              aria-hidden="true"
            />
            <circle className="node-halo" r="25" fill={groups[node.category].colour} />
            <circle
              className="package-dot"
              r="10"
              fill={groups[node.category].colour}
              strokeWidth="2"
            />
            <text y="30" textAnchor="middle" fill="#f4f2eb" fontSize="11">
              {node.name}
            </text>
            <text
              y="4"
              textAnchor="middle"
              fill="#11272d"
              fontSize="10"
              fontWeight="bold"
              aria-hidden="true"
            >
              {impact.get(node.id)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
