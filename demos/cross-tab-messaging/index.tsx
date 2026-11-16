import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { Button } from '@lab/ui/button';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useEffect, useRef, useState } from 'react';

export default function Signals() {
  const [text, setText] = useState('Hello from another corner of the lab!');
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState('Opening a local channel…');
  const [ready, setReady] = useState(false);
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'function') {
      setStatus('BroadcastChannel unavailable. Try a current browser or another demo.');
      return;
    }
    try {
      const connection = new BroadcastChannel('front-end-lab-signals');
      channel.current = connection;
      connection.onmessage = (event) => {
        if (typeof event.data === 'string' && event.data.length <= 160 && event.data.trim()) {
          setMessages((current) => [event.data, ...current].slice(0, 5));
        }
      };
      setReady(true);
      setStatus('Ready. Open this address in another tab.');
      return () => {
        connection.close();
        channel.current = null;
      };
    } catch {
      setStatus('Cannot open a channel here. Try a normal local tab.');
    }
  }, []);

  function send(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();
    if (!message || !channel.current) return;
    channel.current.postMessage(message);
    setStatus('Sent to other lab tabs; delivery is unconfirmed.');
  }

  return (
    <div className="experiment-grid">
      <div className="signal-stage">
        <p className="eyebrow">Incoming / last five signals</p>
        {messages.length === 0 ? (
          <p className="empty-note">No messages. Send one from the other tab.</p>
        ) : (
          <ul aria-live="polite" className="messages">
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        )}
        <p className="small">Same-origin tabs only. No storage or server.</p>
      </div>
      <div className="controls">
        <p className="eyebrow">03 / BroadcastChannel</p>
        <h3>Two tabs. One conversation.</h3>
        <p>Send events between local tabs—no backend, WebSockets or cross-device messaging.</p>
        <Button asChild variant="outline">
          <a href="./index.html" target="_blank" rel="noopener">
            Open another tab ↗
          </a>
        </Button>
        <form onSubmit={send}>
          <Label htmlFor="message">Your signal</Label>
          <Input
            id="message"
            value={text}
            maxLength={160}
            onChange={(event) => setText(event.target.value)}
          />
          <Button disabled={!ready || !text.trim()} type="submit">
            Send signal
          </Button>
        </form>
        <p role="status" className="small">
          {status}
        </p>
        <p className="try-this">
          <strong>What if…</strong> tabs shared a palette, quiz or drawing? What would cross-device
          support need?
        </p>
        <p>
          Start with one event type; close the channel when leaving the demo.{' '}
          <a href={galleryHref('/create')}>Create your own experiment</a>.
        </p>
      </div>
    </div>
  );
}
