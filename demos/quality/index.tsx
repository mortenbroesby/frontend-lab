import { galleryHref } from '@lab/demo-kit/gallery-link';
export default function Quality() {
  return (
    <div className="controls">
      <h2>Question → evidence → improvement</h2>
      <p>Do the prime-counting tests cover the UI’s largest workload?</p>
      <h3>Evidence</h3>
      <p>
        Tests covered smaller values. The UI allows 2,000,000: 148,933 primes, independently
        verified with a sieve.
      </p>
      <h3>Improvement</h3>
      <p>
        <code>demos/workers/compute.test.ts</code> now checks <code>countPrimes(MAX_LIMIT)</code>.
        Run <code>npm test --workspace @lab/demo-workers</code> from the repository root. This adds
        confidence; no algorithm bug was found.
      </p>
      <h3>A false lead</h3>
      <p>Both buttons call the same pure calculation. Trace imports before proposing a refactor.</p>
      <p>
        Choose another behaviour. Trace its caller and test, then decide what to keep or change.{' '}
        <a href={galleryHref('/track/code-quality')}>Start your own investigation</a> for commands
        and a check.
      </p>
    </div>
  );
}
