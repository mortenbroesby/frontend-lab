import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolve } from 'node:path';
import { createServer, preview } from 'vite';

const root = resolve(import.meta.dirname, '..');

// HTTP smoke only: no browser installation or UI automation.
for (const [name, directory, config] of [
  ['gallery', '.', 'gallery/vite.config.ts'],
  ['standalone', 'demos/dependency-map', 'gallery/vite.demo.config.ts'],
]) {
  for (const mode of ['development', 'preview']) {
    test(`${name} ${mode} serves HTML and its entry module`, { timeout: 30_000 }, async (t) => {
      const options = {
        root: resolve(root, directory),
        configFile: resolve(root, config),
        logLevel: 'error',
        server: { host: '127.0.0.1', port: 0 },
        preview: { host: '127.0.0.1', port: 0 },
      };
      const server = mode === 'development' ? await createServer(options) : await preview(options);
      t.after(async () => {
        server.httpServer.closeAllConnections();
        if (mode === 'development') await server.close();
        else await new Promise((done) => server.httpServer.close(done));
      });
      if (mode === 'development') await server.listen();
      const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
      const response = await fetch(url);
      assert.equal(response.status, 200);
      const html = await response.text();
      const entries = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)];
      assert.ok(entries.length, 'HTML has a module entry');
      for (const [, src] of entries) {
        const script = await fetch(new URL(src, url));
        assert.equal(script.status, 200, src);
        assert.match(script.headers.get('content-type'), /javascript/);
      }
    });
  }
}
