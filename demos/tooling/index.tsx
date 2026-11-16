import { galleryHref } from '@lab/demo-kit/gallery-link';
export default function Tooling() {
  return <div className="controls">
    <h2>A small command inventory</h2>
    <p>Question: can a newcomer see the available project commands in a predictable order?</p>
    <p>From the repository root, run:</p>
    <pre><code>node tracks/developer-experience/examples/commands.mjs gallery/package.json</code></pre>
    <p>The script reads the manifest, validates its shape and prints sorted command names and values. It does not execute those commands or modify files.</p>
    <h3>Try the smaller option first</h3><p>Run <code>npm run</code> inside the project. That may already be enough. Keep the utility only if its particular output solves a real problem; we have not measured a time saving.</p>
    <h3>Build your own improvement</h3><p>With Node 24, run the independent starter from the repository root:</p>
    <pre><code>{'node tracks/developer-experience/bootstrap/inspect.mjs gallery/package.json\nnode --test tracks/developer-experience/bootstrap/inspect.test.mjs'}</code></pre>
    <p>Expect the project name and two passing tests. Change <code>describeProject</code> in <code>tracks/developer-experience/bootstrap/inspect.mjs</code> and its adjacent test to report one observation useful to your workflow. Compare the output with the manifest and rerun the tests.</p>
    <p>Share the original friction, what became simpler and one limit. <a href={galleryHref('/track/developer-experience')}>Explore other workflow improvements</a>.</p>
  </div>;
}
