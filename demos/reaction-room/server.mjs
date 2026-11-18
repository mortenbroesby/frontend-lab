import { fileURLToPath } from 'node:url';
import { createRoomServer } from './room-server.mjs';
const port = Number(process.env.PORT ?? 4395);
const host = process.env.HOST ?? '0.0.0.0';
const app = createRoomServer({
  root: fileURLToPath(new URL('./dist/', import.meta.url)),
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '').split(',').filter(Boolean),
});
app.server.listen(port, host, () => console.log(`Reaction Room listening on ${host}:${port}`));
process.once('SIGINT', app.close);
process.once('SIGTERM', app.close);
