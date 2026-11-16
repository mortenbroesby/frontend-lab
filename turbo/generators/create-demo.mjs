import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

export const marker = '  // Generated demos are inserted below this line.';

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
  if (!['a', 'b', 'c', 'd'].includes(track)) throw new Error('Choose track a, b, c or d.');
  for (const key of ['description', 'author']) {
    if (typeof answers[key] !== 'string' || !answers[key].trim() || answers[key].length > 240) {
      throw new Error(`${key} must contain 1–240 characters.`);
    }
  }
  const src = join(root, 'playground/src');
  const registryPath = join(src, 'demo-registry.ts');
  const registry = await readFile(registryPath, 'utf8');
  if (registry.split(marker).length !== 2) throw new Error('Expected exactly one generator marker in demo-registry.ts.');
  if (new RegExp(`\\bid\\s*:\\s*['"]${id}['"]`).test(registry)) throw new Error(`Demo ${id} is already registered.`);
  const template = await readFile(join(src, 'demos/template/Demo.tsx'), 'utf8');
  const nameSlot = "useState('What if…')";
  if (template.split(nameSlot).length !== 2) throw new Error('Expected one initial idea in the demo template.');
  const component = template.replace(nameSlot, () => `useState(${JSON.stringify(name)})`);
  const folder = join(src, 'demos', id);
  // Exclusive creation protects an existing participant folder, including with --force.
  await mkdir(folder);
  try {
    await writeFile(join(folder, 'Demo.tsx'), component);
    await writeFile(join(folder, 'README.md'), `# ${name}\n\nOpen /#/demo/${id} in the lab. Edit Demo.tsx to build your experiment.\n\nRun npm run check from the repository root before sharing. Keep styles local (Demo.module.css), and clean up timers, listeners and Workers on unmount.\n\nRecord your question, what you tried and what you learned here.\n`);
    const entry = `  { id: '${id}', track: '${track}', title: ${JSON.stringify(answers.title.trim())}, description: ${JSON.stringify(answers.description.trim())}, author: ${JSON.stringify(answers.author.trim())}, Component: lazy(() => import('./demos/${id}/Demo')) },`;
    // Fail if a manual edit occurred while we were generating files.
    if (await readFile(registryPath, 'utf8') !== registry) throw new Error('Registry changed; retry after the other edit finishes.');
    await writeFile(registryPath, registry.replace(marker, () => `${marker}\n${entry}`));
  } catch (error) {
    await rm(folder, { recursive: true, force: true });
    throw error;
  }
  return `Created playground/src/demos/${id}. Open /#/demo/${id} at your dev server. Run npm run dev if it is not running.`;
}
