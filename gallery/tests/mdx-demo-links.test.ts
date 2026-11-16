import assert from 'node:assert/strict';
import { test } from 'node:test';
import { demoLinks } from '../mdx-demo-links.ts';

const file = {
  fail(message: string): never {
    throw new Error(`ideas.mdx: ${message}`);
  },
};
const link = (value: unknown) => ({
  type: 'mdxJsxTextElement',
  name: 'DemoLink',
  attributes: [{ name: 'id', value }],
});

test('MDX demo links validate nested references and require a literal known ID', () => {
  const validate = demoLinks(new Set(['signals']));
  validate({ type: 'root', children: [{ type: 'paragraph', children: [link('signals')] }] }, file);
  for (const value of [
    'typo',
    undefined,
    { type: 'mdxJsxAttributeValueExpression', value: 'dynamic' },
  ]) {
    assert.throws(
      () => validate({ type: 'root', children: [link(value)] }, file),
      /ideas.mdx: DemoLink/,
    );
  }
});
