import { useEffect, useRef, useState } from 'react';
import { connectRoom } from './connect-room';
import type { Reaction } from './reactions';

type ReactionEvent = Reaction & { id: number };
const empty = { events: [] as ReactionEvent[], total: 0, now: 0 };
export function useReactionRoom(joined: string | null) {
  const [status, setStatus] = useState('Create a room or join your group.');
  const [peers, setPeers] = useState(0);
  const [ready, setReady] = useState(false);
  const [wall, setWall] = useState(empty);
  const incoming = useRef<Reaction[]>([]);
  const outgoing = useRef<string[]>([]);
  const action = useRef<((emojis: string[]) => void) | null>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    if (!joined) return;
    const controller = new AbortController();
    setStatus('Opening room…');
    connectRoom(joined, sessionStorage.getItem('reaction-host') === joined, {
      signal: controller.signal,
      status: setStatus,
      peers: (count) => {
        setPeers(count);
      },
      receive: (batch, sender) => {
        const at = Date.now();
        incoming.current = [
          ...incoming.current,
          ...batch.map((emoji) => ({ emoji, sender, at })),
        ].slice(-600);
      },
      disconnected: () => {
        action.current = null;
        outgoing.current = [];
        setPeers(0);
        setReady(false);
      },
      ready: (current) => {
        action.current = current;
        setReady(true);
      },
    });
    return () => {
      controller.abort();
      action.current = null;
    };
  }, [joined]);

  useEffect(() => {
    if (!joined) return;
    const paint = window.setInterval(() => {
      const batch = incoming.current.splice(0);
      const now = Date.now();
      setWall((previous) => {
        if (!batch.length && !previous.events.length) return previous;
        return {
          total: previous.total + batch.length,
          now,
          events: [
            ...previous.events,
            ...batch.map((event, i) => ({ ...event, id: previous.total + i })),
          ]
            .filter((event) => now - event.at < 4000)
            .slice(-1200),
        };
      });
    }, 100);
    const send = window.setInterval(() => {
      const batch = outgoing.current.splice(0, 2);
      if (!batch.length || !action.current) return;
      action.current(batch);
    }, 200);
    return () => {
      clearInterval(paint);
      clearInterval(send);
    };
  }, [joined]);

  function cheer(emoji: string) {
    if (!ready || performance.now() - lastTap.current < 100) return;
    if (outgoing.current.length >= 2) return;
    lastTap.current = performance.now();
    outgoing.current.push(emoji);
    incoming.current.push({ emoji, sender: 'self', at: Date.now() });
  }
  return { status, peers, wall, cheer, ready };
}
