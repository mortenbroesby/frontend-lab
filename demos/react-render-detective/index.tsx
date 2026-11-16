import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useState } from 'react';
import { Button } from '@lab/ui/button';
import { Experiment } from './experiment';
import './styles.css';

export default function RenderDetective() {
  const [round, setRound] = useState(0);
  return (
    <div className="render-detective">
      <div className="detective-intro">
        <div>
          <p className="eyebrow">Same UI. Three render paths.</p>
          <h2>Which update reaches the tiles?</h2>
          <p>
            Type in each collection note or update its parent. Watch the tile commit counts and
            React Scan outlines. Then like one tile: local state still updates through memo.
          </p>
        </div>
        <Button variant="outline" onClick={() => setRound((value) => value + 1)}>
          Reset experiment
        </Button>
      </div>
      <div className="detective-comparison" key={round}>
        <Experiment mode="plain" />
        <Experiment mode="unstable" />
        <Experiment mode="stable" />
      </div>
      <aside className="detective-notes">
        {galleryHref('/track/developer-experience/rendering') && (
          <p>
            <a href={galleryHref('/track/developer-experience/rendering')}>
              Understand this · Try it in your project
            </a>
          </p>
        )}
        <h3>A render is a clue, not a bug.</h3>
        <p>
          These tiles are deliberately cheap. Fewer renders do not prove a faster application. Use
          profiling before adding memoization to real code.
        </p>
        <p>
          Counters observe tile commits, not render attempts or milliseconds. Development Strict
          Mode may run the initial observation twice; compare changes from the starting count. Reset
          remounts the tiles.
        </p>
        <p>
          React Scan is enabled only on this demo, including its static build. Use its toolbar to
          pause outlines or inspect a component. Instrumentation adds overhead; this is not a
          benchmark.
        </p>
        <p>
          Try removing the object spread in <code>experiment.tsx</code>, then remove{' '}
          <code>memo</code> in <code>tile.tsx</code>. Predict which counts change before clicking.
        </p>
      </aside>
    </div>
  );
}

RenderDetective.displayName = 'RenderDetective';
