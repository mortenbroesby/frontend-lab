import { useState } from 'react';
import { galleryHref } from '@lab/demo-kit/gallery-link';

const experiments = [
  {
    title: 'One behaviour',
    question: 'Does command ordering still work?',
    command: 'node --test --test-name-pattern="sorts commands" tracks/developer-experience/examples/commands.test.mjs',
    expect: 'One passing test. Check the count: a pattern that matches nothing is not useful evidence.',
    next: 'Compare with the full file: node --test tracks/developer-experience/examples/commands.test.mjs (four tests). Narrow selection skips CLI and invalid-input coverage.',
  },
  {
    title: 'Watch changes',
    question: 'Can I see a regression as soon as I save?',
    command: 'node --test --watch --test-name-pattern="sorts commands" tracks/developer-experience/examples/commands.test.mjs',
    expect: 'On your experiment branch, temporarily reverse a.localeCompare(b) in commands.mjs. Save to see a failure; restore that edit and save to see it pass.',
    next: 'Stop with Ctrl+C. Rerun the full file before sharing. Node watches the test and its imports; this is not a browser test.',
  },
  {
    title: 'Build caching',
    question: 'Am I rebuilding something that has not changed?',
    command: 'npm exec -- turbo run build --filter=@lab/demo-tooling\nnpm exec -- turbo run build --filter=@lab/demo-tooling',
    expect: 'After npm ci at the root, run twice without edits. Inspect the second run. Our verification produced two misses; compare actual logs, not a promised speedup.',
    next: 'Inspect globalDependencies in turbo.json. The inspected global inputs included generated dist files and .turbo logs. Compare dry-run globalCacheInputs.files and hashes; try excluding generated inputs on your experiment branch, then verify real source edits still invalidate the cache.',
  },
  {
    title: 'Affected projects',
    question: 'Which tasks would this change select?',
    command: 'npm exec -- turbo run build --filter=@lab/demo-tooling --dry=json\nnpm exec -- turbo run build --affected --dry=json',
    expect: 'Compare the explicit package plan with the Git-based affected plan. These commands do not run builds. Affected selection requires available Git history and a comparison base.',
    next: 'Inspect selected packages and hashes. Task selection is not the same as cache validity; the gallery also bundles demos. Keep broader validation where the change requires it.',
  },
];

export default function Tooling() {
  const [selected, setSelected] = useState(0);
  const experiment = experiments[selected];
  return <div className="controls">
    <p className="eyebrow">Identify friction → Explore alternatives → Experiment → Demonstrate</p>
    <h2>Find your shortest feedback loop</h2>
    <p>Choose a real development question. Run these commands from the repository root. The test experiments need only Node 24; Turbo experiments also need the normal npm install. This page does not execute commands or simulate timings.</p>
    <div className="button-row" role="group" aria-label="Feedback experiments">
      {experiments.map((item, index) => <button key={item.title} type="button" className={selected === index ? '' : 'secondary'} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.title}</button>)}
    </div>
    <section aria-live="polite" aria-atomic="true">
      <h3>{experiment.question}</h3>
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}><code>{experiment.command}</code></pre>
      <p>{experiment.expect}</p><p>{experiment.next}</p>
    </section>
    <p>Demonstrate one observable difference and one limit. Finding a native feature can be the whole outcome.</p>
    <details><summary>Prefer to build a small utility?</summary>
      <p>Compare <code>npm run</code> with the completed inventory:</p>
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}><code>node tracks/developer-experience/examples/commands.mjs gallery/package.json</code></pre>
      <p>For your own experiment, edit the independent starter at <code>tracks/developer-experience/bootstrap/inspect.mjs</code> and its adjacent test. The finished inventory is separate.</p>
    </details>
    <p><a href={galleryHref('/track/developer-experience/examples')}>Full walkthrough</a> · <a href={galleryHref('/track/developer-experience')}>Explore the four directions</a></p>
  </div>;
}
