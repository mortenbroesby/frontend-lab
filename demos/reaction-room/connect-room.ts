import { parseServerMessage, type ServerMessage } from './room-protocol';

type Callbacks = {
  signal: AbortSignal;
  status: (message: string) => void;
  peers: (count: number) => void;
  receive: (batch: string[], sender: string) => void;
  ready: (send: (emojis: string[]) => void) => void;
  disconnected: () => void;
};
export function connectRoom(code: string, callbacks: Callbacks) {
  const base = import.meta.env.VITE_REACTION_SERVER_URL || location.origin;
  const url = new URL(`/rooms/${code}`, base);
  url.protocol = url.protocol === 'https:' || url.protocol === 'wss:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(url);
  let rejection = '';
  const timeout = setTimeout(() => {
    rejection = 'Room server unavailable. Open the demo from its running server, then retry.';
    callbacks.status(rejection);
    socket.close();
  }, 10000);
  socket.addEventListener(
    'message',
    (event) => {
      let data: unknown;
      try {
        data = JSON.parse(String(event.data));
      } catch {
        return;
      }
      rejection = receiveMessage(data, socket, callbacks) || rejection;
      clearTimeout(timeout);
    },
    { signal: callbacks.signal },
  );
  socket.addEventListener(
    'close',
    () => {
      clearTimeout(timeout);
      if (callbacks.signal.aborted) return;
      callbacks.disconnected();
      callbacks.status(
        rejection || 'Disconnected. Check the room server and your network, then retry.',
      );
    },
    { signal: callbacks.signal },
  );
  callbacks.signal.addEventListener(
    'abort',
    () => {
      clearTimeout(timeout);
      socket.close();
    },
    { once: true },
  );
}
function receiveMessage(value: unknown, socket: WebSocket, callbacks: Callbacks) {
  const data = parseServerMessage(value);
  if (!data) return '';
  if (data.type === 'error') return data.message;
  if (data.type === 'reactions') callbacks.receive(data.emojis, data.sender);
  else receivePresence(data, socket, callbacks);
  return '';
}
function receivePresence(
  data: Extract<ServerMessage, { count: number }>,
  socket: WebSocket,
  callbacks: Callbacks,
) {
  callbacks.peers(data.count - 1);
  callbacks.status(
    data.count > 1 ? 'Connected · reactions are live' : 'Room open · invite your group',
  );
  if (data.type === 'welcome')
    callbacks.ready((emojis) => {
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(emojis));
    });
}
