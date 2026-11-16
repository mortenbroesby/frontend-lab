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
  await mkdir(join(root, 'demos'), { recursive: true });
  await cp(new URL('./templates', import.meta.url), join(root, 'turbo/generators/templates'), { recursive: true });
  await cp(new URL('../../playground/src/starters', import.meta.url), join(root, 'playground/src/starters'), { recursive: true });
  await writeFile(join(root, 'playground/src/demo-registry.ts'), 'do not edit');
  return root;
}
const answers = { id: 'chapter-quiz', track: 'experimental-projects', title: 'Quiz "hello" $&', author: 'Morten', description: 'One question\nTwo answers' };

test('creates a working template and typed metadata with safely escaped text', async t => {
  const root = await fixture(t);
  await createDemo(root, answers);
  const registry = await readFile(join(root, 'demos/chapter-quiz/demo.config.ts'), 'utf8');
  assert.ok(registry.includes(`title: ${JSON.stringify(answers.title)}`));
  assert.ok(registry.includes(`description: ${JSON.stringify(answers.description)}`));
  assert.doesNotMatch(registry, /load:|import\(/);
  const component = await readFile(join(root, 'demos/chapter-quiz/index.tsx'), 'utf8');
  assert.match(component, /export default function Demo/);
  assert.ok(component.includes(`useState(${JSON.stringify(answers.title)})`));
  assert.ok((await readFile(join(root, 'demos/chapter-quiz/README.md'), 'utf8')).startsWith('# Quiz'));
});

test('rejects existing demo folders without modifying work', async t => {
  const root = await fixture(t);
  const path = join(root, 'playground/src/demo-registry.ts');
  const before = await readFile(path, 'utf8');
  await mkdir(join(root, 'demos/art'));
  await assert.rejects(createDemo(root, { ...answers, id: 'art' }), /exist/i);
  await mkdir(join(root, 'demos/chapter-quiz'));
  await writeFile(join(root, 'demos/chapter-quiz/keep.txt'), 'participant work');
  await assert.rejects(createDemo(root, answers), /exist/i);
  assert.equal(await readFile(path, 'utf8'), before);
  assert.equal(await readFile(join(root, 'demos/chapter-quiz/keep.txt'), 'utf8'), 'participant work');
});

test('invalid names, tracks and empty metadata cause no writes', async t => {
  const root = await fixture(t);
  for (const patch of [{ id: '../escape' }, { id: 'Bad Name' }, { id: 'template' }, { id: 'con' }, { track: 'e' }, { track: 'a' }, { track: 'b' }, { track: 'c' }, { track: 'd' }, { title: ' ' }, { author: '' }]) {
    await assert.rejects(createDemo(root, { ...answers, ...patch }));
  }
  assert.deepEqual(await readdir(join(root, 'demos')), []);
});

test('different demos can be generated concurrently without editing shared files', async t => {
  const root = await fixture(t);
  await Promise.all([createDemo(root, answers), createDemo(root, { ...answers, id: 'another-demo' })]);
  assert.equal(await readFile(join(root, 'playground/src/demo-registry.ts'), 'utf8'), 'do not edit');
  for (const id of ['chapter-quiz', 'another-demo']) {
    assert.match(await readFile(join(root, 'demos', id, 'demo.config.ts'), 'utf8'), /satisfies DemoDefinition/);
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
  assert.deepEqual(await readdir(join(root, 'demos')), []);
});

test('every named track choice produces matching typed metadata', async t => {
  const root = await fixture(t);
  let config;
  configureGenerator({ setGenerator: (_name, value) => { config = value; } });
  const choices = config.prompts.find(prompt => prompt.name === 'track').choices;
  assert.deepEqual(choices.map(choice => choice.value), ['modern-web', 'code-quality', 'developer-experience', 'experimental-projects']);
  for (const { name, value } of choices) {
    assert.doesNotMatch(name, /^[A-D] ·/);
    await createDemo(root, { ...answers, id: value, track: value });
    const metadata = await readFile(join(root, 'demos', value, 'demo.config.ts'), 'utf8');
    assert.ok(metadata.includes(`track: ${JSON.stringify(value)}`));
  }
});


test('gives participants an exact route, editable file and persistent first change', async t => {
  const root = await fixture(t);
  const instructions = await createDemo(root, answers);
  assert.match(instructions, /npm run dev/);
  assert.match(instructions, /#\/demo\/chapter-quiz/);
  assert.match(instructions, /demos\/chapter-quiz\/index\.tsx/);
  const notes = await readFile(join(root, 'demos/chapter-quiz/README.md'), 'utf8');
  assert.match(notes, /Findings/);
  assert.match(notes, /refresh/i);
  assert.match(notes, /demo\.config\.ts/);
  assert.match(notes, /npm run dev --workspace/);
});

test('Modern Web generates an independent circle bootstrap, leaving the shared starter unchanged', async t => {
  const root = await fixture(t);
  const starter = join(root, 'playground/src/starters/BrowserStarter.tsx');
  const before = await readFile(starter, 'utf8');
  await createDemo(root, { ...answers, track: 'modern-web' });
  const component = await readFile(join(root, 'demos/chapter-quiz/index.tsx'), 'utf8');
  assert.match(component, /export default function Demo/);
  assert.match(component, /<circle/);
  assert.match(component, /Circle radius/);
  assert.doesNotMatch(component, /Edit.*src\/starters/);
  assert.equal(await readFile(starter, 'utf8'), before);
});


test('every generated demo has its own app and standalone is the default', async t => {
  const root = await fixture(t);
  await createDemo(root, answers);
  const folder = join(root, 'demos/chapter-quiz');
  const pkg = JSON.parse(await readFile(join(folder, 'package.json'), 'utf8'));
  assert.equal(pkg.name, '@lab/demo-chapter-quiz');
  assert.ok(pkg.scripts.dev && pkg.scripts.build && pkg.scripts.preview);
  assert.match(await readFile(join(folder, 'index.html'), 'utf8'), /main.tsx/);
  assert.match(await readFile(join(folder, 'demo.config.ts'), 'utf8'), /presentation: "standalone"/);
  await createDemo(root, { ...answers, id: 'inline-demo', presentation: 'inline' });
  assert.match(await readFile(join(root, 'demos/inline-demo/demo.config.ts'), 'utf8'), /presentation: "inline"/);
  assert.ok(await readFile(join(root, 'demos/inline-demo/package.json'), 'utf8'));
  await assert.rejects(createDemo(root, { ...answers, id: 'bad-mode', presentation: 'invalid' }));
});
