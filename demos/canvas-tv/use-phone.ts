import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { MessageAction, Room } from 'trystero';
import { isCommand, isSnapshot, type Snapshot } from './remote-protocol';

let leaving = Promise.resolve();
export function usePhone(
  code: string | null,
  remote: boolean,
  snapshot: Snapshot,
  dispatch: (key: string) => void,
) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('');
  const [selection, setSelection] = useState<Snapshot | null>(null);
  const sender = useRef<MessageAction<string | Snapshot> | null>(null);
  const peer = useRef<string | null>(null);
  const receiveCommand = useEffectEvent(dispatch);
  const currentSnapshot = useEffectEvent(() => snapshot);
  const supported =
    window.isSecureContext &&
    Boolean(globalThis.crypto?.subtle) &&
    typeof RTCPeerConnection === 'function';
  function send(value: string | Snapshot) {
    if (!peer.current || !sender.current) return;
    void sender.current
      .send(value, { target: peer.current })
      .catch(() => setStatus('Could not send. Check the connection or reconnect.'));
  }
  useEffect(() => {
    if (!code || !supported) return;
    const controller = new AbortController();
    const { signal } = controller;
    let room: Room | undefined;
    setConnected(false);
    setSelection(null);
    setStatus('Waiting for the other screen…');
    const timer = window.setTimeout(
      () =>
        setStatus(
          'Still waiting. Keep both screens open. Check internet; some networks block WebRTC. Try reconnecting.',
        ),
      20000,
    );
    async function connect() {
      try {
        const { joinRoom } = await import('trystero');
        await leaving;
        if (signal.aborted) return;
        room = joinRoom(
          {
            appId: 'frontend-lab/canvas-tv/v1',
            identity: 'none',
            maxUsers: 2,
            maxReceiveBytes: 4096,
          },
          code!,
        );
        const action = room.makeAction<string | Snapshot>('remote');
        sender.current = action;
        const transmit = (data: string | Snapshot, id: string) => {
          void action.send(data, { target: id }).catch(() => {
            if (!signal.aborted) setStatus('Connection interrupted. Reconnect to try again.');
          });
        };
        room.onPeerJoin(({ peerId: id }) => transmit(remote ? 'phone' : 'tv', id), { signal });
        const receiveOnTV = (data: unknown, id: string) => {
          if (data === 'phone') {
            peer.current = id;
            setConnected(true);
            setStatus('Phone connected');
            clearTimeout(timer);
            transmit(currentSnapshot(), id);
          } else if (peer.current === id && isCommand(data)) receiveCommand(data);
        };
        const receiveOnPhone = (data: unknown, id: string) => {
          if (data === 'tv') transmit('phone', id);
          if (!isSnapshot(data)) return;
          peer.current = id;
          setSelection(data);
          setConnected(true);
          setStatus('Connected to TV');
          clearTimeout(timer);
        };
        action.onMessage(
          (data, { peerId: id }) => {
            if (peer.current && peer.current !== id) return;
            if (remote) receiveOnPhone(data, id);
            else receiveOnTV(data, id);
          },
          { signal },
        );
        room.onPeerLeave(
          ({ peerId: id }) => {
            if (peer.current !== id) return;
            peer.current = null;
            setConnected(false);
            setSelection(null);
            setStatus('Other screen disconnected. Waiting for it to return…');
          },
          { signal },
        );
        room.onError(
          () => {
            if (!signal.aborted) setStatus('Connection error. Reconnect or try another network.');
          },
          { signal },
        );
        await room.ready;
      } catch {
        if (!signal.aborted) setStatus('Could not connect. Check internet and reconnect.');
      }
    }
    void connect();
    return () => {
      controller.abort();
      clearTimeout(timer);
      sender.current = null;
      peer.current = null;
      leaving = room?.leave().catch(() => {}) ?? leaving;
    };
  }, [code, remote, supported]);
  useEffect(() => {
    if (!remote) send(snapshot);
  }, [snapshot, remote]);
  return { connected, status, selection, supported, send };
}
