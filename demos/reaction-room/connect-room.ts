import { Peer, type DataConnection } from 'peerjs';
import { createHostRoom } from './host-room';
import { parseHostMessage } from './room-protocol';

type Callbacks = {
  signal: AbortSignal;
  status: (message: string) => void;
  peers: (count: number) => void;
  receive: (batch: string[], sender: string) => void;
  ready: (send: (emojis: string[]) => void) => void;
  disconnected: () => void;
};
export function connectRoom(code: string, host: boolean, callbacks: Callbacks) {
  if (!window.isSecureContext || typeof RTCPeerConnection !== 'function') {
    callbacks.status('Open the HTTPS version to connect devices. WebRTC needs a secure browser.');
    return;
  }
  const hostId = `frontend-lab-reactions-v2-${code}`;
  const peer = host ? new Peer(hostId) : new Peer();
  const timeout = setTimeout(
    () =>
      callbacks.status(
        'Still waiting. Keep the host page open. This network may block WebRTC; try another network or retry.',
      ),
    20000,
  );
  const ready = (send: (emojis: string[]) => void) => {
    clearTimeout(timeout);
    callbacks.ready(send);
  };
  peer.once('open', () => {
    if (host) {
      ready(hub.publish);
      callbacks.status('You are hosting · keep this page open');
    } else
      connectGuest(peer.connect(hostId, { reliable: true, serialization: 'json' }), {
        ...callbacks,
        ready,
        status: (message) => {
          clearTimeout(timeout);
          callbacks.status(message);
        },
      });
  });
  const hub = createHostRoom(callbacks.receive, callbacks.peers);
  peer.on('connection', (connection) => {
    if (!host) {
      connection.close();
      return;
    }
    let admitted = false;
    connection.on('data', (data) => {
      if (data === 'join') {
        admitted = hub.join(connection.peer, (message) => send(connection, message));
        if (!admitted) connection.close({ flush: true });
      } else if (admitted) hub.receive(connection.peer, data);
    });
    const leave = () => {
      if (admitted) {
        admitted = false;
        hub.leave(connection.peer);
      }
    };
    connection.on('close', leave);
    connection.on('error', () => {
      leave();
      connection.close();
    });
  });
  const shutdown = () => peer.destroy();
  window.addEventListener('pagehide', shutdown, { signal: callbacks.signal });
  peer.on('disconnected', () => {
    if (!peer.destroyed) peer.reconnect();
  });
  peer.on('error', (error) => {
    clearTimeout(timeout);
    if (callbacks.signal.aborted) return;
    callbacks.status(
      error.type === 'unavailable-id'
        ? 'This room already has a host. Leave and join with its code instead.'
        : 'Could not connect. Keep the host page open, then retry. Some networks block WebRTC.',
    );
  });
  callbacks.signal.addEventListener(
    'abort',
    () => {
      clearTimeout(timeout);
      peer.destroy();
    },
    { once: true },
  );
}
function send(connection: DataConnection, data: unknown) {
  if (connection.open && connection.dataChannel.bufferedAmount < 65536) void connection.send(data);
}
function connectGuest(connection: DataConnection, callbacks: Callbacks) {
  let rejection = '';
  // Data can arrive before the remote open callback. Retry admission until acknowledged.
  const joining = setInterval(() => send(connection, 'join'), 1000);
  const stopJoining = () => clearInterval(joining);
  callbacks.signal.addEventListener('abort', stopJoining, { once: true });
  connection.once('open', () => send(connection, 'join'));
  connection.on('data', (value) => {
    const data = parseHostMessage(value);
    if (!data) return;
    stopJoining();
    if (data.type === 'error') {
      rejection = data.message;
      callbacks.disconnected();
      callbacks.status(rejection);
    } else if (data.type === 'reactions') callbacks.receive(data.emojis, data.sender);
    else {
      callbacks.peers(data.count - 1);
      callbacks.status('Connected to host · reactions are live');
      callbacks.ready((emojis) => send(connection, emojis));
    }
  });
  const disconnected = () => {
    stopJoining();
    if (callbacks.signal.aborted) return;
    callbacks.disconnected();
    callbacks.status(rejection || 'Host disconnected. Keep their page open and retry to rejoin.');
  };
  connection.on('close', disconnected);
  connection.on('error', disconnected);
}
