import type { RemoteAction } from './remote-protocol';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { Room } from 'trystero';
import { isRemoteMessage, type RemoteMessage, type RemoteState } from './remote-protocol';

let leaving = Promise.resolve();
export function useRemote(
  code: string | null,
  state: RemoteState | null,
  input: (action: RemoteAction) => void,
) {
  const remote = state === null;
  const [snapshot, setSnapshot] = useState<RemoteState | null>(null);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Waiting for the other screen…');
  const send = useRef<(message: RemoteMessage) => void>(() => {});
  const latestState = useEffectEvent(() => state);
  const runCommand = useEffectEvent(input);
  const supported = window.isSecureContext && typeof RTCPeerConnection === 'function';

  useEffect(() => {
    if (!code || !supported) {
      setConnected(false);
      setSnapshot(null);
      return;
    }
    const controller = new AbortController();
    let room: Room | undefined;
    let peer: string | null = null;
    let seenAt = 0;
    const requests = new Set<string>();
    setConnected(false);
    setSnapshot(null);
    setStatus('Waiting for the other screen…');
    const hello: RemoteMessage = { kind: 'hello', role: remote ? 'remote' : 'host' };
    let transmit = (_message: RemoteMessage, _target: string) => {};
    const interval = window.setInterval(() => {
      if (peer) {
        transmit(remote ? hello : latestState()!, peer);
        if (Date.now() - seenAt > 6000) {
          setConnected(false);
          setStatus('Connection lost. Keep both screens open or reconnect.');
        }
      }
    }, 1000);
    const waiting = window.setTimeout(() => {
      if (!peer)
        setStatus(
          'Still waiting. Use HTTPS and internet on both screens. Some networks block WebRTC.',
        );
    }, 20000);

    async function join() {
      try {
        const { joinRoom } = await import('trystero');
        await leaving;
        if (controller.signal.aborted) return;
        room = joinRoom(
          {
            appId: 'frontend-lab/presentation/v1',
            identity: 'none',
            maxUsers: 2,
            maxReceiveBytes: 20000,
          },
          code!,
        );
        const action = room.makeAction<RemoteMessage>('presenter');
        transmit = (message, target) => {
          void action.send(message, { target }).catch(() => {
            if (!controller.signal.aborted) {
              setConnected(false);
              setStatus('Could not send. Reconnect to try again.');
            }
          });
        };
        send.current = (message) => {
          if (peer && Date.now() - seenAt <= 6000) transmit(message, peer);
        };
        room.onPeerJoin(({ peerId }) => transmit(hello, peerId), { signal: controller.signal });
        function receiveHello(data: Extract<RemoteMessage, { kind: 'hello' }>, peerId: string) {
          const expectedRole = remote ? 'host' : 'remote';
          if (data.role !== expectedRole) return;
          peer = peerId;
          seenAt = Date.now();
          if (!remote) {
            setConnected(true);
            setStatus('Presenter remote connected');
            transmit(latestState()!, peerId);
          }
        }
        function rememberRequest(request: string) {
          requests.add(request);
          if (requests.size > 256) requests.delete(requests.values().next().value!);
        }
        function receiveInput(data: Extract<RemoteMessage, { kind: 'input' }>) {
          if (remote || requests.has(data.request)) return;
          if (data.slide !== latestState()!.index) return;
          rememberRequest(data.request);
          runCommand(data.action);
        }
        function receiveState(data: RemoteState) {
          if (!remote || !peer) return;
          seenAt = Date.now();
          setSnapshot(data);
          setConnected(true);
          setStatus('Connected to presentation');
        }
        function dispatch(data: RemoteMessage, peerId: string) {
          if (data.kind === 'hello') receiveHello(data, peerId);
          else if (data.kind === 'state') receiveState(data);
          else if (peer) receiveInput(data);
        }
        action.onMessage(
          (data, { peerId }) => {
            if (!isRemoteMessage(data)) return;
            if (peer !== null && peer !== peerId) return;
            dispatch(data, peerId);
          },
          { signal: controller.signal },
        );
        room.onPeerLeave(
          ({ peerId }) => {
            if (peer !== peerId) return;
            peer = null;
            seenAt = 0;
            setConnected(false);
            setStatus('Other screen disconnected. Waiting for it to return…');
          },
          { signal: controller.signal },
        );
        room.onError(
          () => {
            if (!controller.signal.aborted) {
              setConnected(false);
              setStatus('Connection error. Reconnect or try another network.');
            }
          },
          { signal: controller.signal },
        );
        await room.ready;
      } catch {
        if (!controller.signal.aborted)
          setStatus('Could not connect. Check internet and reconnect.');
      }
    }
    void join();
    return () => {
      controller.abort();
      clearInterval(interval);
      clearTimeout(waiting);
      send.current = () => {};
      leaving = room?.leave().catch(() => {}) ?? leaving;
    };
  }, [code, remote, supported]);

  useEffect(() => {
    if (state) send.current(state);
  }, [state]);
  return {
    snapshot,
    connected,
    status,
    supported,
    request: (action: RemoteAction) =>
      send.current({
        kind: 'input',
        action,
        request: crypto.randomUUID(),
        slide: snapshot?.index ?? 0,
      }),
  };
}
