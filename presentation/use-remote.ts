import { createRemotePeer } from './remote-peer';
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
  const [attempt, setAttempt] = useState(0);
  const failures = useRef(0);
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
    const peer = createRemotePeer(remote);
    let retrying = false;
    const retry = () => {
      if (retrying || controller.signal.aborted) return;
      retrying = true;
      failures.current = Math.min(failures.current + 1, 2);
      setAttempt((value) => value + 1);
    };
    const requests = new Set<string>();
    setConnected(false);
    setSnapshot(null);
    setStatus('Connecting… Keep both screens open.');
    const hello: RemoteMessage = { kind: 'hello', role: remote ? 'remote' : 'host' };
    let transmit = (_message: RemoteMessage, _target: string) => {};
    function checkHealth() {
      if (peer.alive()) return;
      setConnected(false);
      if (peer.paired()) setStatus('Connection paused. Reconnecting automatically…');
      if (peer.retryDue(Math.min(30000 * 2 ** failures.current, 120000))) retry();
    }
    const interval = window.setInterval(() => {
      // Repeat greetings until both sides have acknowledged their roles.
      for (const target of peer.targets()) transmit(hello, target);
      if (!remote) send.current(latestState()!);
      checkHealth();
    }, 1000);
    resumePairing(peer, retry, controller.signal);
    const waiting = window.setTimeout(() => {
      if (!peer.alive())
        setStatus('Still pairing. Retrying automatically; keep both screens open and online.');
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
            if (!controller.signal.aborted && !peer.alive()) {
              setConnected(false);
              setStatus('Connection interrupted. Retrying automatically…');
            }
          });
        };
        send.current = (message) => {
          if (peer.alive()) for (const target of peer.targets()) transmit(message, target);
        };
        room.onPeerJoin(
          ({ peerId }) => {
            peer.joined(peerId);
            transmit(hello, peerId);
          },
          { signal: controller.signal },
        );
        function receiveHello(peerId: string) {
          failures.current = 0;
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
          if (!remote) return;
          failures.current = 0;
          setSnapshot(data);
          setConnected(true);
          setStatus('Connected to presentation');
        }
        function dispatch(data: RemoteMessage, peerId: string) {
          if (data.kind === 'hello') receiveHello(peerId);
          else if (data.kind === 'state') receiveState(data);
          else receiveInput(data);
        }
        action.onMessage(
          (data, { peerId }) => {
            if (!isRemoteMessage(data)) return;
            if (!peer.accept(data, peerId)) return;
            dispatch(data, peerId);
          },
          { signal: controller.signal },
        );
        room.onPeerLeave(
          ({ peerId }) => {
            peer.left(peerId);
            if (!peer.alive()) {
              setConnected(false);
              setStatus('Other screen disconnected. Reconnecting automatically…');
            }
          },
          { signal: controller.signal },
        );
        room.onError(
          (error) => {
            console.warn('Presenter pairing:', error.code);
            if (!controller.signal.aborted && !peer.alive()) {
              setConnected(false);
              setStatus(`Pairing interrupted (${error.code}). Retrying automatically…`);
            }
          },
          { signal: controller.signal },
        );
        await room.ready;
      } catch {
        if (!controller.signal.aborted)
          setStatus('Could not connect. Retrying automatically; check internet on both screens.');
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
  }, [code, remote, supported, attempt]);

  useEffect(() => {
    if (state) send.current(state);
  }, [state]);
  return {
    snapshot,
    connected,
    status,
    supported,
    reconnect: () => {
      failures.current = 0;
      setAttempt((value) => value + 1);
    },
    request: (action: RemoteAction) =>
      send.current({
        kind: 'input',
        action,
        request: crypto.randomUUID(),
        slide: snapshot?.index ?? 0,
      }),
  };
}

function resumePairing(
  peer: ReturnType<typeof createRemotePeer>,
  retry: () => void,
  signal: AbortSignal,
) {
  const resume = () => {
    if (document.visibilityState === 'visible' && peer.retryDue(10000)) retry();
  };
  window.addEventListener('online', resume, { signal });
  window.addEventListener('pageshow', resume, { signal });
  document.addEventListener('visibilitychange', resume, { signal });
}
