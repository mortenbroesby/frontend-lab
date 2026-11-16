import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useEffect, useRef, useState } from 'react';
import { countPrimes } from './compute';

type Result = { count: number; milliseconds: number } | { error: string };

export default function Workers() {
  const [limit, setLimit] = useState(500_000);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Ready.');
  const [taps, setTaps] = useState(0);
  const worker = useRef<Worker | null>(null);
  useEffect(() => () => worker.current?.terminate(), []);

  function finish(result: Result) {
    setStatus(
      'error' in result
        ? result.error
        : `${result.count.toLocaleString()} primes · ${Math.round(result.milliseconds)} ms computation`,
    );
    setBusy(false);
    worker.current?.terminate();
    worker.current = null;
  }

  function runWorker() {
    setBusy(true);
    setStatus('Worker running. Try the interaction pad.');
    try {
      const next = new Worker(new URL('./compute.worker.ts', import.meta.url), { type: 'module' });
      worker.current = next;
      next.onmessage = (event: MessageEvent<Result>) => finish(event.data);
      next.onerror = () =>
        finish({ error: 'Worker failed to load. Check the console and local server.' });
      next.postMessage(limit);
    } catch (error) {
      finish({ error: error instanceof Error ? error.message : 'Workers are unavailable here.' });
    }
  }

  function cancel() {
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setStatus('Cancelled. Ready to restart.');
  }

  function runMain() {
    const started = performance.now();
    finish({ count: countPrimes(limit), milliseconds: performance.now() - started });
  }

  return (
    <div className="experiment-grid">
      <div className="interaction-stage">
        <span className="orbit" aria-hidden="true" />
        <p className="eyebrow">Still responsive?</p>
        <button className="tap-pad" onClick={() => setTaps((value) => value + 1)}>
          Interaction pad <strong>{taps}</strong>
        </button>
        <p>Click or press Tab while work runs.</p>
        <p role="status" className="result">
          {status}
        </p>
      </div>
      <div className="controls">
        <p className="eyebrow">02 / Web Workers</p>
        <h3>Keep the interface responsive.</h3>
        <p>
          Compare the same calculation on the main thread and in a Worker. Workers protect
          responsiveness, not calculation speed.
        </p>
        <label htmlFor="workload">Count primes up to</label>
        <select
          id="workload"
          disabled={busy}
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value))}
        >
          <option value="100000">100,000 · quick</option>
          <option value="500000">500,000 · medium</option>
          <option value="2000000">2,000,000 · heavier</option>
        </select>
        <div className="button-row">
          <button disabled={busy} onClick={runWorker}>
            Run in Worker
          </button>
          <button className="secondary" disabled={!busy} onClick={cancel}>
            Cancel Worker
          </button>
          <button className="secondary" disabled={busy} onClick={runMain}>
            Compare on main thread
          </button>
        </div>
        <p className="small">
          Main-thread work blocks this page and cannot be cancelled. Start small; timings vary by
          device. Inspect with DevTools. Timing excludes Worker startup and messaging.
        </p>
        <p className="try-this">
          <strong>What if…</strong> this processed an image, searched a dataset, or reported
          progress?
        </p>
        <p>
          Start with a Worker that takes a number and returns a result. Add status, then
          cancellation. <a href={galleryHref('/create')}>Create an independent demo</a>.
        </p>
      </div>
    </div>
  );
}
