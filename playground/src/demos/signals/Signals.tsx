import { useEffect, useRef, useState } from 'react';

export function Signals() {
  const [text, setText] = useState('Hello from another corner of the lab!');
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState('Opening a local channel…');
  const [ready, setReady] = useState(false);
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'function') {
      setStatus('BroadcastChannel is unavailable here. Try a current browser or another example.');
      return;
    }
    try {
      const connection = new BroadcastChannel('front-end-lab-signals');
      channel.current = connection;
      connection.onmessage = event => {
        if (typeof event.data === 'string' && event.data.length <= 160 && event.data.trim()) {
          setMessages(current => [event.data, ...current].slice(0, 5));
        }
      };
      setReady(true);
      setStatus('Ready. Open a second tab on the same address to exchange signals.');
      return () => { connection.close(); channel.current = null; };
    } catch {
      setStatus('This browser context could not open a channel. Try a normal local tab.');
    }
  }, []);

  function send(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = text.trim();
    if (!message || !channel.current) return;
    channel.current.postMessage(message);
    setStatus('Sent to other open lab tabs. This is not a delivery receipt.');
  }

  return (
    <div className="experiment-grid">
      <div className="signal-stage">
        <p className="eyebrow">Incoming / last five signals</p>
        {messages.length === 0 ? <p className="empty-note">Nothing yet. Send a message from the second tab.</p> : <ul aria-live="polite" className="messages">{messages.map((message, index) => <li key={index}>{message}</li>)}</ul>}
        <p className="small">Ephemeral, same-origin browser tabs only. Nothing is saved or sent to a server.</p>
      </div>
      <div className="controls">
        <p className="eyebrow">03 / BroadcastChannel</p>
        <h3>Two tabs. A shared conversation.</h3>
        <p>Explore event-driven interfaces without setting up a backend. This is local tab communication, not WebSockets or messaging between laptops.</p>
        <a className="button secondary" href="#/demo/signals" target="_blank" rel="noopener">Open second lab tab ↗</a>
        <form onSubmit={send}>
          <label htmlFor="message">Your signal</label>
          <input id="message" value={text} maxLength={160} onChange={event => setText(event.target.value)} />
          <button disabled={!ready || !text.trim()} type="submit">Send signal</button>
        </form>
        <p role="status" className="small">{status}</p>
        <p className="try-this"><strong>What if…</strong> two tabs shared a colour palette, a quiz question or a drawing? How would this change across computers?</p>
        <p className="source">Make it yours: <code>src/demos/signals/Signals.tsx</code></p>
      </div>
    </div>
  );
}
