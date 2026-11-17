import { useEffect, useRef, useState } from 'react';
import type { MessageAction, Room } from 'trystero';

// A route remount must wait for Trystero to release the previous room registration.
let leaving = Promise.resolve();

function supportsPeerConnections() {
  return (
    window.isSecureContext &&
    Boolean(globalThis.crypto?.subtle) &&
    typeof RTCPeerConnection === 'function'
  );
}

export function useRallyRoom(joined: string | null) {
  const [status, setStatus] = useState('Discovering peers…');
  const [peers, setPeers] = useState(0);
  const [cheers, setCheers] = useState({ total: 0, emoji: '👋' });
  const action = useRef<MessageAction<string> | null>(null);
  const supported = supportsPeerConnections();

  useEffect(() => {
    if (joined === null) return;
    if (!supported) {
      setStatus(
        'Requires WebRTC and localhost on each device or trusted HTTPS. Plain HTTP LAN addresses will not work.',
      );
      return;
    }
    const controller = new AbortController();
    const { signal } = controller;
    let room: Room | undefined;
    setPeers(0);
    setCheers({ total: 0, emoji: '👋' });
    setStatus('Discovering peers… Open this demo on another device with the same code.');
    const timer = window.setTimeout(() => {
      if (!room || Object.keys(room.getPeers()).length === 0) {
        setStatus(
          'No peers yet. Check the code and internet. Signaling or WebRTC may be blocked; leave and try another network.',
        );
      }
    }, 20000);

    async function connect() {
      try {
        const { joinRoom } = await import('trystero');
        await leaving;
        if (signal.aborted) return;
        room = joinRoom(
          {
            appId: 'mortenbroesby/front-end-lab/device-rally-v1',
            identity: 'none',
            maxUsers: 12,
            maxReceiveBytes: 65536,
          },
          joined!,
        );
        action.current = room.makeAction<string>('cheer');
        action.current.onMessage(
          (emoji) => {
            if (['🚀', '✨', '💜'].includes(emoji))
              setCheers((previous) => ({ total: previous.total + 1, emoji }));
          },
          { signal },
        );
        const updatePeers = () => {
          const count = Object.keys(room!.getPeers()).length;
          setPeers(count);
          setStatus(
            count
              ? `Connected to ${count} other ${count === 1 ? 'device' : 'devices'}. Send a cheer!`
              : 'Waiting for a device with the same room code.',
          );
          if (count) clearTimeout(timer);
        };
        room.onPeerJoin(updatePeers, { signal });
        room.onPeerLeave(updatePeers, { signal });
        room.onError(
          (error) => {
            clearTimeout(timer);
            setStatus(
              `Connection error (${error.code}). Check internet and room code. Restricted networks may need TURN (not configured). Leave and retry, or refresh both pages.`,
            );
          },
          { signal },
        );
        await room.ready;
      } catch {
        if (!signal.aborted) {
          clearTimeout(timer);
          setStatus('Cannot join. Check internet and browser support; leave and retry.');
        }
      }
    }
    void connect();
    return () => {
      controller.abort();
      clearTimeout(timer);
      action.current = null;
      leaving = room?.leave().catch(() => {}) ?? leaving;
    };
  }, [joined, supported]);

  function cheer(emoji: string) {
    const current = action.current;
    if (!current || !peers) return;
    void current.send(emoji).then(
      () => {
        if (action.current === current)
          setCheers((previous) => ({ total: previous.total + 1, emoji }));
      },
      () => {
        if (action.current === current) setStatus('Cheer failed. Check the connection and retry.');
      },
    );
  }

  function leave() {
    setPeers(0);
    setStatus('Left the room. Choose a code to rejoin.');
  }
  return { status, peers, cheers, cheer, leave };
}
