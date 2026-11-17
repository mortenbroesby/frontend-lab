import { Button } from '@lab/ui/button';
import { Label } from '@lab/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@lab/ui/select';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useState } from 'react';
import { useDependencyLayout } from './use-dependency-layout';
import { DependencyGraph } from './dependency-graph';

import { groups, modules, links } from './data';
import { impactOf } from './graph';
import './constellation.css';

export default function Constellation() {
  const [layout, setLayout] = useState('layers');
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [selected, setSelected] = useState('react-dom');
  const { positions, pin, release } = useDependencyLayout(layout, paused);
  const impact = impactOf(selected, links);
  const direct = [...impact.values()].filter((distance) => distance === 1).length;
  const indirect = impact.size - direct - 1;
  const active = modules.find((node) => node.id === selected)!;

  const createHref = galleryHref('/create');
  const guideHref = galleryHref('/track/code-quality/dependencies');
  return (
    <div className="constellation-example dependency-map">
      <div className="constellation-heading">
        <div>
          <p className="eyebrow">D3 / follow the ripple</p>
          <h3>
            One package changes.
            <br />
            How far does it reach?
          </h3>
          <p>
            Explore the dependencies declared by this very repository. Choose a package to light up
            its consumers.
          </p>
        </div>
        <span className="graph-count">
          {modules.length} packages · {links.length} declarations
        </span>
      </div>
      <div className="impact-presets" aria-label="Try a comparison">
        <span>Try this:</span>
        {['react-dom', 'react', 'd3-force', '@lab/demo-kit'].map((id) => (
          <Button
            key={id}
            variant="outline"
            aria-pressed={selected === id}
            onClick={() => setSelected(id)}
          >
            {id}
          </Button>
        ))}
      </div>
      <div className="impact-summary" aria-live="polite">
        <div className="impact-selection">
          <span className="eyebrow">Selected package</span>
          <strong>{active.id}</strong>
          <small>{active.path}</small>
        </div>
        <div>
          <strong>{direct}</strong>
          <span>direct consumers</span>
        </div>
        <div>
          <strong>{indirect}</strong>
          <span>indirect consumers</span>
        </div>
      </div>
      <DependencyGraph
        positions={positions}
        paused={paused}
        selected={selected}
        impact={impact}
        onSelect={setSelected}
        onPin={pin}
      />
      <div className="impact-legend">
        {groups.map((group) => (
          <span key={group.name}>
            <i style={{ background: group.colour }} />
            {group.name}
          </span>
        ))}
        <span>Arrow: consumer → dependency · Number: hops from selection</span>
      </div>
      <div className="graph-controls">
        <div>
          <Label htmlFor="graph-package">Inspect a package</Label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger id="graph-package">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modules.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  {node.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="graph-layout">Layout</Label>
          <Select value={layout} onValueChange={setLayout}>
            <SelectTrigger id="graph-layout">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="layers">Workspaces → runtime → tooling</SelectItem>
              <SelectItem value="constellation">Let the forces decide</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => setPaused((value) => !value)}>
          {paused ? 'Resume motion' : 'Pause motion'}
        </Button>
        <Button variant="outline" onClick={release}>
          Release pinned packages
        </Button>
      </div>
      <div className="impact-insight">
        <div>
          <h4>Who depends on this?</h4>
          <p>
            Follow arrows backwards to consumers that may need checking, not necessarily fixing.
          </p>
          <ConsumerList impact={impact} onSelect={setSelected} />
        </div>
        <div>
          <h4>Trace a change.</h4>
          <p>
            Compare <strong>d3-force</strong>, <strong>react</strong> and{' '}
            <strong>@lab/demo-kit</strong>. Try react-dom for consumers two hops away. Which package
            reaches most workspaces?
          </p>
          <p>
            Add a dependency to a demo’s <code>package.json</code>; reload to find its connection.{' '}
            <code>demos/dependency-map/data.ts</code> turns manifests into nodes and edges;{' '}
            <code>graph.ts</code> traces consumers.
          </p>
          {guideHref && (
            <p>
              <a href={guideHref}>Understand this: trace a dependency’s reach →</a>
            </p>
          )}
          {createHref && <a href={createHref}>Create a graph demo →</a>}
        </div>
      </div>
      <div className="graph-notes">
        <p id="graph-help">
          Drag to pin, or focus a node and use arrows; Shift moves further. Layout changes reset
          pins. Reduced motion starts paused.
        </p>
        <p className="small">
          Build-time snapshot of workspace dependencies and devDependencies. External packages are
          leaves; transitive npm dependencies, imports, versions and runtime use are excluded. D3
          positions nodes; connections determine impact.
        </p>
      </div>
    </div>
  );
}

function ConsumerList({
  impact,
  onSelect,
}: {
  impact: Map<string, number>;
  onSelect: (id: string) => void;
}) {
  return impact.size === 1 ? (
    <p>No consumers are declared in this snapshot.</p>
  ) : (
    <ul>
      {[...impact]
        .filter(([, distance]) => distance > 0)
        .map(([id, distance]) => (
          <li key={id}>
            <Button variant="link" onClick={() => onSelect(id)}>
              {id}
            </Button>
            <span>{distance === 1 ? 'direct' : `${distance} hops`}</span>
          </li>
        ))}
    </ul>
  );
}
