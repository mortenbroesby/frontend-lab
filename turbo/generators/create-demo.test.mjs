import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createDemo } from './create-demo.mjs';
import configureGenerator from './config.js';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'lab-generator-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'playground/src/demos'), { recursive: true });
  await cp(new URL('../../playground/src/demos/template', import.meta.url), join(root, 'playground/src/demos/template'), { recursive: true });
  await writeFile(join(root, 'playground/src/demo-registry.ts'), 'do not edit');
  return root;
}
const answers = { id: 'chapter-quiz', track: 'd', title: 'Quiz "hello" $&', author: 'Morten', description: 'One question\nTwo answers' };

test('creates a working template and typed metadata with safely escaped text', async t => {
  const root = await fixture(t);
  await createDemo(root, answers);
  const registry = await readFile(join(root, 'playground/src/demos/chapter-quiz/demo.config.ts'), 'utf8');
  assert.ok(registry.includes(`title: ${JSON.stringify(answers.title)}`));
  assert.ok(registry.includes(`description: ${JSON.stringify(answers.description)}`));
  assert.ok(registry.includes("import('./Demo')"));
  const component = await readFile(join(root, 'playground/src/demos/chapter-quiz/Demo.tsx'), 'utf8');
  assert.match(component, /export default function Demo/);
  assert.ok(component.includes(`useState(${JSON.stringify(answers.title)})`));
  assert.ok((await readFile(join(root, 'playground/src/demos/chapter-quiz/README.md'), 'utf8')).startsWith('# Quiz'));
});

test('rejects existing demo folders without modifying work', async t => {
  const root = await fixture(t);
  const path = join(root, 'playground/src/demo-registry.ts');
  const before = await readFile(path, 'utf8');
  await mkdir(join(root, 'playground/src/demos/art'));
  await assert.rejects(createDemo(root, { ...answers, id: 'art' }), /exist/i);
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

test('different demos can be generated concurrently without editing shared files', async t => {
  const root = await fixture(t);
  await Promise.all([createDemo(root, answers), createDemo(root, { ...answers, id: 'another-demo' })]);
  assert.equal(await readFile(join(root, 'playground/src/demo-registry.ts'), 'utf8'), 'do not edit');
  for (const id of ['chapter-quiz', 'another-demo']) {
    assert.match(await readFile(join(root, 'playground/src/demos', id, 'demo.config.ts'), 'utf8'), /satisfies DemoDefinition/);
  }
});

test('asks for a name first without a default and suggests an editable folder ID', () => {
  let config;
  configureGenerator({ setGenerator: (_name, value) => { config = value; } });
  const [name, id] = config.prompts;
  assert.equal(name.name, 'title');
  assert.match(name.message, /Demo name/);
  assert.equal(name.default, undefined);
  for (const value of ['', '   ', undefined, 'Two\nlines']) assert.notEqual(name.validate(value), true);
  assert.equal(name.validate('Chapter Quiz'), true);
  assert.equal(id.default({ title: 'Chapter Quiz!' }), 'chapter-quiz');
});

test('missing, whitespace-only and multiline names leave all files untouched', async t => {
  const root = await fixture(t);
  const registry = join(root, 'playground/src/demo-registry.ts');
  const before = await readFile(registry, 'utf8');
  for (const title of [undefined, '', '  ', 'Two\nlines']) {
    await assert.rejects(createDemo(root, { ...answers, title }), /name/i);
  }
  assert.equal(await readFile(registry, 'utf8'), before);
  assert.deepEqual(await readdir(join(root, 'playground/src/demos')), ['template']);
});
