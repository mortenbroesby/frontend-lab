import { galleryHref } from '@lab/demo-kit/gallery-link';
export default function Quality() {
  return (
    <div className="controls">
      <h2>Question → evidence → improvement</h2>
      <p>Does our prime-counting test cover the largest workload the UI offers?</p>
      <h3>Evidence</h3>
      <p>
        The original tests covered smaller known values. The UI allows 2,000,000; its expected count
        is 148,933 primes, independently checked with a sieve.
      </p>
      <h3>Small improvement</h3>
      <p>
        <code>demos/workers/compute.test.ts</code> now checks <code>countPrimes(MAX_LIMIT)</code>.
        Run <code>npm test --workspace @lab/demo-workers</code> from the repository root. This
        closes a confidence gap; it does not demonstrate an algorithm bug.
      </p>
      <h3>A concern that did not hold up</h3>
      <p>
        Main-thread and Worker buttons appear to duplicate calculation work, but both call the same
        pure implementation. Trace the imports before recommending a refactor.
      </p>
      <p>
        Your turn: choose another input or behaviour, find its caller and the test that would catch
        it breaking, then record what you would keep or change.{' '}
        <a href={galleryHref('/track/code-quality')}>Start your own investigation</a> for commands
        and a success check.
      </p>
    </div>
  );
}
