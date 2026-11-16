import { useState } from 'react';
import { galleryHref } from '@lab/demo-kit/gallery-link';

const experiments = [
  {
    title: 'One behaviour',
    question: 'Does command ordering still work?',
    command:
      'node --test --test-name-pattern="sorts commands" tracks/developer-experience/examples/commands.test.mjs',
    expect: 'Expect one passing test; zero matches prove nothing.',
    next: 'Compare all four tests: node --test tracks/developer-experience/examples/commands.test.mjs. The narrow pattern skips CLI and invalid-input checks.',
  },
  {
    title: 'Watch changes',
    question: 'Can I see a regression as soon as I save?',
    command:
      'node --test --watch --test-name-pattern="sorts commands" tracks/developer-experience/examples/commands.test.mjs',
    expect:
      'Temporarily reverse a.localeCompare(b) in commands.mjs. Save to see failure; restore and save to see it pass.',
    next: 'Stop with Ctrl+C; rerun all tests before sharing. Node watches tests and imports, not the browser.',
  },
  {
    title: 'Build caching',
    question: 'Am I rebuilding something that has not changed?',
    command:
      'npm exec -- turbo run build --filter=@lab/demo-tooling\nnpm exec -- turbo run build --filter=@lab/demo-tooling',
    expect:
      'After root npm ci, run twice unchanged. The second run should hit cache; the first may too. Edit a source file and confirm a miss.',
    next: 'Inspect tasks[].inputs and dependencies in the dry run. Unrelated demo edits should preserve cache; shared-kit edits should invalidate it. The gallery tracks all demos; the dependency map tracks manifests. Restore your edits.',
  },
  {
    title: 'Affected projects',
    question: 'Which tasks would this change select?',
    command:
      'npm exec -- turbo run build --filter=@lab/demo-tooling --dry=json\nnpm exec -- turbo run build --affected --dry=json',
    expect:
      'Compare explicit and Git-based plans; neither builds anything. Affected selection needs Git history and a comparison base.',
    next: 'Inspect packages and hashes. Selection does not prove cache validity; the gallery bundles demos too. Broaden checks when needed.',
  },
];

export default function Tooling() {
  const [selected, setSelected] = useState(0);
  const experiment = experiments[selected];
  return (
    <div className="controls">
      <p className="eyebrow">Find friction → Compare → Experiment → Show</p>
      <h2>Find your shortest feedback loop</h2>
      <p>
        Choose a question and run commands from the repo root. Tests need Node 24; Turbo also needs
        npm install. This page runs no commands or simulated timings.
      </p>
      <div className="button-row" role="group" aria-label="Feedback experiments">
        {experiments.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={selected === index ? '' : 'secondary'}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <section aria-live="polite" aria-atomic="true">
        <h3>{experiment.question}</h3>
        <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          <code>{experiment.command}</code>
        </pre>
        <p>{experiment.expect}</p>
        <p>{experiment.next}</p>
      </section>
      <p>Show one difference and one limit. An existing native feature may be enough.</p>
      <details>
        <summary>Build a utility?</summary>
        <p>
          Compare <code>npm run</code> with the completed inventory:
        </p>
        <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          <code>node tracks/developer-experience/examples/commands.mjs gallery/package.json</code>
        </pre>
        <p>
          Edit the starter at <code>tracks/developer-experience/bootstrap/inspect.mjs</code> and its
          test. The finished inventory stays separate.
        </p>
      </details>
      <p>
        <a href={galleryHref('/track/developer-experience/examples')}>Full walkthrough</a> ·{' '}
        <a href={galleryHref('/track/developer-experience')}>Explore ideas</a>
      </p>
    </div>
  );
}
