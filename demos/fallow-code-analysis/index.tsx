import { galleryHref } from '@lab/demo-kit/gallery-link';
export default function Fallow() {
  return (
    <div className="controls">
      <h2>From a finding to a decision</h2>
      <p>Find unused code, duplication and complexity. Run from the repository root:</p>
      <pre>
        <code>{'npm ci\nnpm run analyze'}</code>
      </pre>
      <p>
        This walkthrough is not a live report; results change with the code. Exit code 1 may mean
        findings, not setup failure. Read the output.
      </p>
      <h3>1. Trace a cleanup candidate</h3>
      <p>
        Choose a current candidate. The original unused generator marker was removed when folder
        discovery replaced manual registration.
      </p>
      <pre>
        <code>npm run analyze:dead-code</code>
      </pre>
      <p>
        Read callers before deleting code; check any change. A clean report is valid—don’t invent a
        problem.
      </p>
      <h3>2. Question a complexity finding</h3>
      <pre>
        <code>npm run analyze:health</code>
      </pre>
      <p>
        The initial report flagged App. Inspect its routing and rendering branches. Without supplied
        coverage, the risk score cannot prove missing tests or bugs.
      </p>
      <h3>Choose your own investigation</h3>
      <p>
        Try <code>npm run analyze:dupes</code> or <code>npm run analyze:architecture</code>. Explain
        a finding—or a clean report—with evidence and a decision.
      </p>
      <p>
        Run <code>npm run check</code> after changing code. See the{' '}
        <a href={galleryHref('/track/code-quality/fallow')}>Fallow guide</a> for setup and
        experiments. Commands run locally in your terminal, not this page.
      </p>
    </div>
  );
}
