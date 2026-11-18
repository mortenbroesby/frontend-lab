import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};
export async function serveFile(request, response, root) {
  if (request.url === '/health') {
    response.writeHead(200);
    response.end('ok');
    return;
  }
  if (!root || request.method !== 'GET') {
    response.writeHead(404);
    response.end();
    return;
  }
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://local').pathname);
    const file = resolve(root, '.' + (path.endsWith('/') ? path + 'index.html' : path));
    if (!file.startsWith(resolve(root) + sep)) {
      response.writeHead(403);
      response.end();
      return;
    }
    const content = await readFile(file);
    response.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}
