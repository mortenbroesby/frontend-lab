export default function Fallow() {
  return <div className="controls">
    <h2>From a finding to a decision</h2>
    <p>Fallow analyzes our actual repository for unused code, duplication and complexity. Run it in your terminal from the repository root:</p>
    <pre><code>{'npm ci\nnpm run analyze'}</code></pre>
    <p>This page is a walkthrough, not a live report. Results change with the code. An exit code of 1 can mean findings were detected; read the output before treating it as a setup failure.</p>
    <h3>1. Trace a cleanup candidate</h3>
    <p>Run the current dead-code report and choose a candidate, if one exists. The original unused generator marker disappeared when folder discovery replaced manual registration.</p>
    <pre><code>npm run analyze:dead-code</code></pre>
    <p>Read the callers before deleting anything. Try a small change on your branch and run the relevant tests. A clean report is a valid result; do not manufacture a problem.</p>
    <h3>2. Question a complexity finding</h3>
    <pre><code>npm run analyze:health</code></pre>
    <p>The initial report highlighted the App function. Inspect its routing and rendering branches. We have not supplied coverage data, so a risk score is not proof that this code is untested or broken.</p>
    <h3>Choose your own investigation</h3>
    <p>Try <code>npm run analyze:dupes</code> or <code>npm run analyze:architecture</code>. A report with no findings is also worth explaining. Share one finding, the evidence you checked and what you would change or keep.</p>
    <p>Open <code>tracks/code-quality/fallow.md</code> in your editor for the complete guide, configuration choices and optional experiments. Fallow runs locally in the terminal; this page does not execute commands.</p>
  </div>;
}
