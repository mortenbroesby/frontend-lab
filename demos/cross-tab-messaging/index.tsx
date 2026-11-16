import { Button } from '@lab/ui/button';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useEffect, useRef, useState } from 'react';
import './signals.css';

type Density = 'comfortable' | 'compact';

export default function Signals() {
  const [density, setDensity] = useState<Density>('comfortable');
  const [received, setReceived] = useState(0);
  const [status, setStatus] = useState('Opening a local channel…');
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'function') {
      setStatus('BroadcastChannel unavailable. The setting still works in this tab.');
      return;
    }
    try {
      const connection = new BroadcastChannel('front-end-lab-density');
      channel.current = connection;
      connection.onmessage = ({ data }: MessageEvent<unknown>) => {
        if (data !== 'comfortable' && data !== 'compact') return;
        setDensity(data);
        setReceived((value) => value + 1);
        setStatus(`Received ${data} density from another tab. No message sent back.`);
      };
      setStatus('Ready. Open another tab, then change the density here.');
      return () => {
        connection.close();
        channel.current = null;
      };
    } catch {
      setStatus('Cannot open a channel. The setting still works locally.');
    }
  }, []);

  function changeDensity(value: Density) {
    setDensity(value);
    if (!channel.current) return;
    try {
      channel.current.postMessage(value);
      setStatus(`Sent ${value} density to other open tabs. Delivery is unconfirmed.`);
    } catch {
      setStatus('Changed locally, but sending failed. Reload to reconnect.');
    }
  }

  return (
    <div className="experiment-grid">
      <section className="density-preview" data-density={density} aria-label="Task list preview">
        <p className="eyebrow">Your workspace · {density} view</p>
        <h2>One preference. Every open tab.</h2>
        <ul>
          {[
            'Review the proposal',
            'Sketch an interaction',
            'Try it with a teammate',
            'Inspect the result',
            'Make one improvement',
          ].map((task, index) => (
            <li key={task}>
              <span aria-hidden="true">0{index + 1}</span>
              {task}
            </li>
          ))}
        </ul>
        <p className="small">{received} updates received in this tab</p>
      </section>
      <div className="controls">
        <p className="eyebrow">BroadcastChannel / shared preferences</p>
        <h3>Change the view in two tabs.</h3>
        <p>
          Open a second tab, then choose Compact here. Its list changes too. Change it back from
          either tab.
        </p>
        <Button asChild variant="outline">
          <a href="./index.html" target="_blank" rel="noopener">
            Open another tab ↗
          </a>
        </Button>
        <div className="button-row" role="group" aria-label="List density">
          {(['comfortable', 'compact'] as const).map((value) => (
            <Button
              key={value}
              variant={density === value ? 'default' : 'outline'}
              aria-pressed={density === value}
              onClick={() => changeDensity(value)}
            >
              {value === 'comfortable' ? 'Comfortable' : 'Compact'}
            </Button>
          ))}
        </div>
        <p role="status" className="small">
          {status}
        </p>
        <h3>Messages are not saved preferences.</h3>
        <p>
          Reload one tab: it starts Comfortable, even if the other is Compact. Choose a density
          again to send a new update. Late arrivals receive no history.
        </p>
        <p className="small">
          Same-origin tabs in the same browser storage partition only. No server, cross-device
          connection or persistence. Simultaneous edits can disagree; this demo has no
          conflict-resolution protocol.
        </p>
        {galleryHref('/track/modern-web/tab-settings') && (
          <p>
            <a href={galleryHref('/track/modern-web/tab-settings')}>
              Understand this · Try it in your project
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
