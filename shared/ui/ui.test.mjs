import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server;
let Button;
let Progress;
let Input;
let HighlightedCode;
before(async () => {
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true, watch: null, hmr: false, ws: false },
  });
  ({ Button } = await server.ssrLoadModule('/src/button.tsx'));
  ({ Progress } = await server.ssrLoadModule('/src/progress.tsx'));
  ({ Input } = await server.ssrLoadModule('/src/input.tsx'));
  ({ HighlightedCode } = await server.ssrLoadModule('/src/highlighted-code.tsx'));
});
after(async () => server?.close());
const render = (component, props, child) =>
  renderToStaticMarkup(createElement(component, props, child));

test('buttons do not submit forms unless explicitly requested; slotted links stay links', () => {
  assert.match(render(Button, {}, 'Open'), /type="button"/);
  assert.match(render(Button, { type: 'submit' }, 'Save'), /type="submit"/);
  const link = render(Button, { asChild: true }, createElement('a', { href: '/guide' }, 'Guide'));
  assert.match(link, /^<a /);
  assert.doesNotMatch(link, /type="button"/);
});

test('progress exposes its value and scales custom maxima', () => {
  const html = render(Progress, { value: 5, max: 20, 'aria-label': 'Upload' });
  assert.match(html, /aria-valuenow="5"/);
  assert.match(html, /aria-valuemax="20"/);
  assert.match(html, /translateX\(-75%\)/);
});

test('unknown and invalid progress values remain indeterminate', () => {
  for (const value of [undefined, null, NaN, Infinity, -1, 101]) {
    const html = render(Progress, { value });
    assert.match(html, /data-state="indeterminate"/);
    assert.doesNotMatch(html, /aria-valuenow=/);
    assert.doesNotMatch(html, /NaN|Infinity/);
  }
});

test('inputs preserve native validation and accessible error relationships', () => {
  const html = render(Input, {
    id: 'name',
    required: true,
    disabled: true,
    'aria-invalid': true,
    'aria-describedby': 'error',
  });
  assert.match(html, /required=""/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="error"/);
});

test('code highlighting colours JSX safely in both themes and preserves unknown languages', () => {
  const code = 'const node = <button title="Hello">Click</button>;\n';
  const html = render(HighlightedCode, { code, language: 'TSX' });
  assert.match(html, /light-dark\(/);
  assert.ok(new Set([...html.matchAll(/color:([^";]+)/g)].map((match) => match[1])).size >= 3);
  assert.doesNotMatch(html, /<button/);
  assert.match(html, /&lt;/);
  assert.match(html, /\n$/);
  assert.equal(
    render(HighlightedCode, { code: 'plain\n  text', language: 'unknown' }),
    'plain\n  text',
  );
});
