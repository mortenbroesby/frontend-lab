import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

export function validateId(id) {
  return typeof id === 'string' && /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id)
    && id.length <= 60 && !/^(template|con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(id);
}

export function validateName(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 240 && !/[\r\n]/.test(value);
}

export async function createDemo(root, answers) {
  const { id, track } = answers;
  if (!validateName(answers.title)) throw new Error('Demo name is required: enter 1–240 characters on one line.');
  const name = answers.title.trim();
  if (!validateId(id)) throw new Error('Use a unique lowercase kebab-case ID, up to 60 characters; template and system names are reserved.');
  if (!['modern-web', 'code-quality', 'developer-experience', 'experimental-projects'].includes(track)) throw new Error('Choose a named track from the generator menu.');
  for (const key of ['description', 'author']) {
    if (typeof answers[key] !== 'string' || !answers[key].trim() || answers[key].length > 240) {
      throw new Error(`${key} must contain 1–240 characters.`);
    }
  }
  const src = join(root, 'playground/src');
  const template = await readFile(join(src, 'demos/template/Demo.tsx'), 'utf8');
  const nameSlot = "useState('What if…')";
  if (template.split(nameSlot).length !== 2) throw new Error('Expected one initial idea in the demo template.');
  const component = template.replace(nameSlot, () => `useState(${JSON.stringify(name)})`);
  const folder = join(src, 'demos', id);
  // Exclusive creation protects an existing participant folder, including with --force.
  await mkdir(folder);
  try {
    await writeFile(join(folder, 'Demo.tsx'), component);
    await writeFile(join(folder, 'README.md'), `# ${name}\n\nOpen #/demo/${id} in the lab. Edit Demo.tsx to build your experiment.\n\nRun npm run check from the repository root before sharing. Keep styles local (Demo.module.css), and clean up timers, listeners and Workers on unmount.\n\nRecord your question, what you tried and what you learned here.\n`);
    const definition = `import type { DemoDefinition } from '../../demo-contract';

export default {
  title: ${JSON.stringify(name)},
  track: ${JSON.stringify(track)},
  description: ${JSON.stringify(answers.description.trim())},
  author: ${JSON.stringify(answers.author.trim())},
  load: () => import('./Demo'),
} satisfies DemoDefinition;
`;
    // Publish metadata last so discovery never sees a half-created component.
    await writeFile(join(folder, 'demo.config.ts'), definition);
  } catch (error) {
    await rm(folder, { recursive: true, force: true });
    throw error;
  }
  return `Created playground/src/demos/${id}. Open #/demo/${id} at your dev server. Run npm run dev if it is not running.`;
}
