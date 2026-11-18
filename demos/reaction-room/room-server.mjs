import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';
import { capacity, validBatch, validRoomCode } from './reactions.ts';
import { serveFile } from './serve-file.mjs';

/** One connection per screen; rooms and reactions live only in memory. */
export function createRoomServer({ root, allowedOrigins = [] } = {}) {
  const rooms = new Map();
  const server = createServer((request, response) => {
    void serveFile(request, response, root);
  });
  const sockets = new WebSocketServer({ noServer: true, maxPayload: 1024 });
  server.on('upgrade', (request, socket, head) => {
    const code = (request.url ?? '').match(/^\/rooms\/([a-z0-9-]{1,24})$/)?.[1];
    if (!code || !validRoomCode(code) || !allowedOrigin(request, allowedOrigins)) {
      socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
      return;
    }
    sockets.handleUpgrade(request, socket, head, (ws) => admit(ws, code, rooms));
  });
  const heartbeat = setInterval(() => {
    for (const socket of sockets.clients) {
      if (socket.alive === false) {
        socket.terminate();
        continue;
      }
      socket.alive = false;
      socket.ping();
    }
  }, 20000);
  heartbeat.unref();
  server.on('close', () => {
    clearInterval(heartbeat);
    sockets.close();
  });
  return {
    server,
    close: () => {
      for (const socket of sockets.clients) socket.terminate();
      server.close();
    },
  };
}
function allowedOrigin(request, allowed) {
  const origin = request.headers.origin;
  if (!origin) return true; // Headless verification clients do not send Origin.
  if (allowed.includes(origin)) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}
function send(socket, message) {
  if (socket.readyState !== WebSocket.OPEN) return;
  if (socket.bufferedAmount > 65536) {
    socket.terminate();
    return;
  }
  socket.send(JSON.stringify(message));
}
function broadcast(room, message, except) {
  for (const socket of room) if (socket !== except) send(socket, message);
}
function admit(socket, code, rooms) {
  const room = rooms.get(code) ?? new Set();
  if (room.size >= capacity) {
    send(socket, {
      type: 'error',
      message: `Room full (${capacity} screens). Create another room or wait for a place.`,
    });
    socket.close(1008, 'Room full');
    return;
  }
  rooms.set(code, room);
  room.add(socket);
  const sender = randomUUID();
  socket.alive = true;
  socket.on('pong', () => {
    socket.alive = true;
  });
  socket.on('error', () => socket.terminate());
  send(socket, { type: 'welcome', sender, count: room.size });
  broadcast(room, { type: 'presence', count: room.size });
  socket.on('message', receiveReactions(socket, sender, room));
  socket.on('close', () => {
    room.delete(socket);
    if (!room.size) rooms.delete(code);
    else broadcast(room, { type: 'presence', count: room.size });
  });
}
function receiveReactions(socket, sender, room) {
  let tokens = 20;
  let last = Date.now();
  return (data) => {
    let emojis;
    try {
      emojis = JSON.parse(data.toString());
    } catch {
      socket.close(1008, 'Invalid reaction');
      return;
    }
    if (!validBatch(emojis)) {
      socket.close(1008, 'Invalid reaction');
      return;
    }
    const now = Date.now();
    tokens = Math.min(20, tokens + (now - last) / 100);
    last = now;
    if (tokens < emojis.length) return;
    tokens -= emojis.length;
    broadcast(room, { type: 'reactions', sender, emojis }, socket);
  };
}
