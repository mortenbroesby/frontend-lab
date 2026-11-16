import { Button } from '@lab/ui/button';
import { Label } from '@lab/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@lab/ui/select';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useEffect, useRef, useState } from 'react';
import { countPrimes } from './compute';
import { observeFrames } from './frames';
import './workers.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@lab/ui/table';

type Result = { count: number; milliseconds: number } | { error: string };

type Mode = 'Worker' | 'Main thread';
type Measurement = { mode: Mode; limit: number; computation: number; gap: number | null };

export default function Workers() {
  const [limit, setLimit] = useState(500_000);
  const [busy, setBusy] = useState<Mode | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [status, setStatus] = useState('Ready.');
  const [taps, setTaps] = useState(0);
  const worker = useRef<Worker | null>(null);
  const frames = useRef<ReturnType<typeof observeFrames> | null>(null);
  useEffect(
    () => () => {
      worker.current?.terminate();
      frames.current?.dispose();
    },
    [],
  );

  function finish(result: Result, mode: Mode) {
    worker.current?.terminate();
    worker.current = null;
    if ('error' in result) {
      frames.current?.dispose();
      setBusy(null);
      setStatus(result.error);
      return;
    }
    frames.current?.finish((gap) => {
      setMeasurements((previous) => [
        ...previous.filter((sample) => sample.mode !== mode),
        { mode, limit, computation: result.milliseconds, gap },
      ]);
      setStatus(`${mode}: ${result.count.toLocaleString()} primes. Compare the frame gaps below.`);
      setBusy(null);
    });
  }

  function begin(mode: Mode) {
    setBusy(mode);
    frames.current?.dispose();
    frames.current = observeFrames();
    setStatus(`${mode} running. Try the interaction pad.`);
  }

  function runWorker() {
    begin('Worker');
    try {
      const next = new Worker(new URL('./compute.worker.ts', import.meta.url), { type: 'module' });
      worker.current = next;
      next.onmessage = (event: MessageEvent<Result>) => finish(event.data, 'Worker');
      next.onerror = () =>
        finish({ error: 'Worker failed to load. Check the console and local server.' }, 'Worker');
      next.postMessage(limit);
    } catch (error) {
      finish(
        { error: error instanceof Error ? error.message : 'Workers are unavailable here.' },
        'Worker',
      );
    }
  }

  function cancel() {
    worker.current?.terminate();
    worker.current = null;
    frames.current?.dispose();
    setBusy(null);
    setStatus('Cancelled. Ready to restart.');
  }

  function runMain() {
    begin('Main thread');
    const started = performance.now();
    finish({ count: countPrimes(limit), milliseconds: performance.now() - started }, 'Main thread');
  }

  return (
    <div className="experiment-grid workers-demo">
      <div className="controls">
        <p className="eyebrow">02 / Web Workers</p>
        <h3>Keep the interface responsive.</h3>
        <p>
          Compare the same calculation on the main thread and in a Worker. Workers protect
          responsiveness, not calculation speed.
        </p>
        <Label htmlFor="workload">Count primes up to</Label>
        <Select
          disabled={busy !== null}
          value={String(limit)}
          onValueChange={(value) => setLimit(Number(value))}
        >
          <SelectTrigger id="workload">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100000">100,000 · quick</SelectItem>
            <SelectItem value="500000">500,000 · medium</SelectItem>
            <SelectItem value="2000000">2,000,000 · heavier</SelectItem>
          </SelectContent>
        </Select>
        <div className="button-row">
          <Button disabled={busy !== null} onClick={runWorker}>
            Run in Worker
          </Button>
          <Button variant="outline" disabled={busy !== 'Worker'} onClick={cancel}>
            Cancel Worker
          </Button>
          <Button variant="outline" disabled={busy !== null} onClick={runMain}>
            Compare on main thread
          </Button>
        </div>
        <p className="small">
          Start small; main-thread work cannot be cancelled. Keep this tab visible. Run both modes
          at the same workload, then repeat: results vary by device and other browser work.
        </p>
        {galleryHref('/track/modern-web/workers') && (
          <p>
            <a href={galleryHref('/track/modern-web/workers')}>
              Understand this · Try it in your project
            </a>
          </p>
        )}
        <p className="try-this">
          <strong>What if…</strong> this processed an image, searched a dataset, or reported
          progress?
        </p>
        <p>
          Start with a Worker that takes a number and returns a result. Add status, then
          cancellation. <a href={galleryHref('/create')}>Create an independent demo</a>.
        </p>
      </div>
      <div className="interaction-stage">
        <p className="eyebrow">Still responsive?</p>
        <button className="tap-pad" onClick={() => setTaps((value) => value + 1)}>
          Interaction pad <strong>{taps}</strong>
        </button>
        <p>Click or press Tab while work runs. Compare both modes at the same workload.</p>
        <p role="status" className="result">
          {status}
        </p>
        <h3>Measured on this device</h3>
        {measurements.length === 0 ? (
          <p>Run either mode to record your first result.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Latest run</TableHead>
                <TableHead>Longest frame gap</TableHead>
                <TableHead>Calculation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map((sample) => (
                <TableRow key={sample.mode}>
                  <TableCell>
                    {sample.mode}
                    <br />
                    Up to {sample.limit.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {sample.gap === null ? 'Hidden tab: rerun' : `${sample.gap.toFixed(1)} ms`}
                  </TableCell>
                  <TableCell>{sample.computation.toFixed(1)} ms</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="small">
          Frame gap: longest wait between animation callbacks, from starting work through the first
          frame after completion. Includes normal frame spacing; this is not input latency.
          Calculation time excludes Worker startup and messaging. These are live observations, not
          benchmark claims.
        </p>
      </div>
    </div>
  );
}
