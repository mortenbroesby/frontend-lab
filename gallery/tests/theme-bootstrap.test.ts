import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { themeBootstrap } from '../theme-bootstrap.ts';

for (const [preference, systemDark, expected] of [
  ['dark', false, 'dark'],
  ['light', true, 'light'],
  ['system', true, 'dark'],
  [null, false, 'light'],
  ['invalid', true, 'dark'],
  ['blocked', true, 'dark'],
] as const) {
  test(`first paint respects ${preference} preference with system dark=${systemDark}`, () => {
    const hook = themeBootstrap().transformIndexHtml;
    assert.ok(hook && typeof hook === 'object' && 'handler' in hook);
    assert.equal(hook.order, 'pre');
    const tags = hook.handler.call({} as never, '', {} as never);
    assert.ok(Array.isArray(tags));
    const script = tags.find((tag) => tag.tag === 'script');
    assert.equal(script?.injectTo, 'head-prepend');
    assert.equal(typeof script.children, 'string');
    const document = { documentElement: { dataset: {} as Record<string, string> } };
    runInNewContext(script.children as string, {
      document,
      localStorage: {
        getItem: () => {
          if (preference === 'blocked') throw new Error('Storage unavailable');
          return preference;
        },
      },
      matchMedia: () => ({ matches: systemDark }),
    });
    assert.equal(document.documentElement.dataset.theme, expected);
  });
}
