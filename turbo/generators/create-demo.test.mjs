import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDemo } from './create-demo.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'lab-generator-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'playground/src/demos'), { recursive: true });
  await cp(new URL('../../playground/src/demos/template', import.meta.url), join(root, 'playground/src/demos/template'), { recursive: true });
  await cp(new URL('../../playground/src/demo-registry.ts', import.meta.url), join(root, 'playground/src/demo-registry.ts'));
  return root;
}
const answers = { id: 'chapter-quiz', track: 'd', title: 'Quiz "hello" $&', author: 'Morten', description: 'One question\nTwo answers' };

test('creates a working template and safely registers user-supplied text', async t => {
  const root = await fixture(t);
  await createDemo(root, answers);
  const registry = await readFile(join(root, 'playground/src/demo-registry.ts'), 'utf8');
  assert.ok(registry.includes(`title: ${JSON.stringify(answers.title)}`));
  assert.ok(registry.includes(`description: ${JSON.stringify(answers.description)}`));
  assert.ok(registry.includes("import('./demos/chapter-quiz/Demo')"));
  assert.match(await readFile(join(root, 'playground/src/demos/chapter-quiz/Demo.tsx'), 'utf8'), /export default function Demo/);
});

test('rejects existing registry IDs and folders without modifying work', async t => {
  const root = await fixture(t);
  const path = join(root, 'playground/src/demo-registry.ts');
  const before = await readFile(path, 'utf8');
  await assert.rejects(createDemo(root, { ...answers, id: 'art' }), /already registered/);
  await mkdir(join(root, 'playground/src/demos/chapter-quiz'));
  await writeFile(join(root, 'playground/src/demos/chapter-quiz/keep.txt'), 'participant work');
  await assert.rejects(createDemo(root, answers), /exist/i);
  assert.equal(await readFile(path, 'utf8'), before);
  assert.equal(await readFile(join(root, 'playground/src/demos/chapter-quiz/keep.txt'), 'utf8'), 'participant work');
});

test('invalid names, tracks and empty metadata cause no writes', async t => {
  const root = await fixture(t);
  for (const patch of [{ id: '../escape' }, { id: 'Bad Name' }, { id: 'template' }, { id: 'con' }, { track: 'e' }, { title: ' ' }, { author: '' }]) {
    await assert.rejects(createDemo(root, { ...answers, ...patch }));
  }
  assert.deepEqual(await readdir(join(root, 'playground/src/demos')), ['template']);
});

test('a missing registration marker fails before creating a demo', async t => {
  const root = await fixture(t);
  const path = join(root, 'playground/src/demo-registry.ts');
  await writeFile(path, 'changed registry');
  await assert.rejects(createDemo(root, answers), /marker/);
  assert.deepEqual(await readdir(join(root, 'playground/src/demos')), ['template']);
  assert.equal(await readFile(path, 'utf8'), 'changed registry');
});
