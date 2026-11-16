import { useEffect, useRef, useState } from 'react';
import { countPrimes } from './compute';

type Result = { count: number; milliseconds: number } | { error: string };

export function Workers() {
  const [limit, setLimit] = useState(500_000);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('Ready when you are.');
  const [taps, setTaps] = useState(0);
  const worker = useRef<Worker | null>(null);
  useEffect(() => () => worker.current?.terminate(), []);

  function finish(result: Result) {
    setStatus('error' in result ? result.error : `${result.count.toLocaleString()} primes · ${Math.round(result.milliseconds)} ms computation`);
    setBusy(false);
    worker.current?.terminate();
    worker.current = null;
  }

  function runWorker() {
    setBusy(true);
    setStatus('Working away from the main thread. Try the interaction pad.');
    try {
      const next = new Worker(new URL('./compute.worker.ts', import.meta.url), { type: 'module' });
      worker.current = next;
      next.onmessage = (event: MessageEvent<Result>) => finish(event.data);
      next.onerror = () => finish({ error: 'Worker failed to load. Check the console and local server.' });
      next.postMessage(limit);
    } catch (error) {
      finish({ error: error instanceof Error ? error.message : 'Workers are unavailable here.' });
    }
  }

  function cancel() {
    worker.current?.terminate();
    worker.current = null;
    setBusy(false);
    setStatus('Cancelled. You can start another experiment.');
  }

  function runMain() {
    const started = performance.now();
    finish({ count: countPrimes(limit), milliseconds: performance.now() - started });
  }

  return (
    <div className="experiment-grid">
      <div className="interaction-stage">
        <span className="orbit" aria-hidden="true" />
        <p className="eyebrow">Is the interface still listening?</p>
        <button className="tap-pad" onClick={() => setTaps(value => value + 1)}>Interaction pad <strong>{taps}</strong></button>
        <p>Click while work runs. Try changing focus with Tab too.</p>
        <p role="status" className="result">{status}</p>
      </div>
      <div className="controls">
        <p className="eyebrow">02 / Web Workers</p>
        <h3>Busy browser. Responsive interface.</h3>
        <p>Run the same calculation in two places. A Worker protects interaction; it does not promise a faster calculation.</p>
        <label htmlFor="workload">Count primes up to</label>
        <select id="workload" disabled={busy} value={limit} onChange={event => setLimit(Number(event.target.value))}>
          <option value="100000">100,000 · quick</option>
          <option value="500000">500,000 · medium</option>
          <option value="2000000">2,000,000 · heavier</option>
        </select>
        <div className="button-row">
          <button disabled={busy} onClick={runWorker}>Run in Worker</button>
          <button className="secondary" disabled={!busy} onClick={cancel}>Cancel Worker</button>
          <button className="secondary" disabled={busy} onClick={runMain}>Compare on main thread</button>
        </div>
        <p className="small">The main-thread comparison briefly blocks this page and cannot be cancelled. Start small. Duration varies by device; use DevTools to inspect the difference. The timer excludes Worker startup and messaging.</p>
        <p className="try-this"><strong>What if…</strong> this processed an image, searched a dataset, or reported progress?</p>
        <p className="source">Make it yours: <code>src/demos/workers/Workers.tsx</code> + <code>compute.worker.ts</code></p>
      </div>
    </div>
  );
}
