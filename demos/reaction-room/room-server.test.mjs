import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { WebSocket } from 'ws';
import { createRoomServer } from './room-server.mjs';

async function start(t) {
  const app = createRoomServer();
  app.server.listen(0, '127.0.0.1');
  await once(app.server, 'listening');
  t.after(async () => {
    const closed = once(app.server, 'close');
    app.close();
    await closed;
  });
  return `ws://127.0.0.1:${app.server.address().port}`;
}
async function connect(base, code) {
  const socket = new WebSocket(`${base}/rooms/${code}`);
  const messages = [];
  socket.on('message', (raw) => messages.push(JSON.parse(raw.toString())));
  await once(socket, 'open');
  return { socket, messages };
}
async function until(predicate) {
  const deadline = Date.now() + 5000;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('Room did not converge');
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }
}
test('30 participants receive every accepted burst; full rooms reject and reopen seats', async (t) => {
  const base = await start(t);
  const clients = await Promise.all(
    Array.from({ length: 30 }, () => connect(base, 'chapter-room')),
  );
  await until(() =>
    clients.every((c) => c.messages.some((m) => m.type === 'presence' && m.count === 30)),
  );
  const extra = await connect(base, 'chapter-room');
  await until(() => extra.messages.some((m) => m.type === 'error'));
  assert.match(extra.messages[0].message, /Room full/);
  for (let round = 0; round < 4; round++) {
    for (const client of clients) client.socket.send(JSON.stringify(['🚀', '💜']));
  }
  await until(() =>
    clients.every((c) => c.messages.filter((m) => m.type === 'reactions').length === 29 * 4),
  );
  for (const client of clients) {
    const reactions = client.messages.filter((m) => m.type === 'reactions');
    assert.equal(new Set(reactions.map((m) => m.sender)).size, 29);
    assert.equal(reactions.flatMap((m) => m.emojis).length, 232);
  }
  clients[0].socket.close();
  await until(() => clients[1].messages.at(-1)?.count === 29);
  const replacement = await connect(base, 'chapter-room');
  await until(() => replacement.messages.some((m) => m.type === 'welcome' && m.count === 30));
});
test('rooms isolate reactions and invalid payloads are rejected', async (t) => {
  const base = await start(t);
  const a = await connect(base, 'one');
  const b = await connect(base, 'two');
  await until(() => b.messages.some((m) => m.type === 'welcome'));
  a.socket.send(JSON.stringify(['🚀']));
  a.socket.send(JSON.stringify(['not-an-icon']));
  await once(a.socket, 'close');
  assert.equal(
    b.messages.some((m) => m.type === 'reactions'),
    false,
  );
});
test('a disallowed browser origin cannot join', async (t) => {
  const base = await start(t);
  const socket = new WebSocket(`${base}/rooms/one`, { origin: 'https://unrelated.example' });
  const [error] = await once(socket, 'error');
  assert.match(error.message, /403/);
});
