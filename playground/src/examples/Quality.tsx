export default function Quality() {
  return <div className="controls">
    <h2>Question → evidence → improvement</h2>
    <p>Does our prime-counting test cover the largest workload the UI offers?</p>
    <h3>Evidence</h3><p>The original tests covered smaller known values. The UI allows 2,000,000; its expected count is 148,933 primes, independently checked with a sieve.</p>
    <h3>Small improvement</h3><p><code>tests/compute.test.ts</code> now checks <code>countPrimes(MAX_LIMIT)</code>. Run <code>npm test</code> in the playground. This closes a confidence gap; it does not demonstrate an algorithm bug.</p>
    <h3>A concern that did not hold up</h3><p>Main-thread and Worker buttons appear to duplicate calculation work, but both call the same pure implementation. Trace the imports before recommending a refactor.</p>
    <p>Your turn: choose a different question, record evidence and explain what you would keep or change. Use <code>tracks/code-quality/bootstrap.md</code> and <code>tracks/code-quality/examples.md</code>.</p>
  </div>;
}
