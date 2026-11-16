export default function Tooling() {
  return <div className="controls">
    <h2>A small command inventory</h2>
    <p>Question: can a newcomer see the available project commands in a predictable order?</p>
    <p>From the repository root, run:</p>
    <pre><code>node tracks/c/examples/commands.mjs playground/package.json</code></pre>
    <p>The script reads the manifest, validates its shape and prints sorted command names and values. It does not execute those commands or modify files.</p>
    <h3>Try the smaller option first</h3><p>Run <code>npm run</code> inside the project. That may already be enough. Keep the utility only if its particular output solves a real problem; we have not measured a time saving.</p>
    <h3>Build your own improvement</h3><p><code>tracks/c/bootstrap/inspect.mjs</code> is a separate minimal starting script. Its tests need only Node. Share your result here as a walkthrough, before/after evidence or interactive demo.</p>
  </div>;
}
