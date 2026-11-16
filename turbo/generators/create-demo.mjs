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
  const { id, track, presentation = 'standalone' } = answers;
  if (!['standalone', 'inline'].includes(presentation)) throw new Error('Choose standalone or inline presentation.');
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
  const modernWeb = track === 'modern-web';
  const templatePath = modernWeb ? 'starters/BrowserStarter.tsx' : 'demos/template/Demo.tsx';
  const template = await readFile(join(src, templatePath), 'utf8');
  const nameSlot = modernWeb ? 'One shape. Your next question.' : "useState('What if…')";
  if (template.split(nameSlot).length !== 2) throw new Error('Expected one name slot in the demo template.');
  const component = template
    .replace(nameSlot, () => modernWeb ? `{${JSON.stringify(name)}}` : `useState(${JSON.stringify(name)})`)
    .replace('export function BrowserStarter()', 'export default function Demo()')
    .replace('To get your own copy, run <code>npm run demo:new</code> and choose Modern Web Capabilities. ', 'This is your independent circle starter. ');
  const firstChange = modernWeb
    ? 'Change the circle fill colour in Demo.tsx, save, then move the radius control.'
    : 'Change "An idea, taking shape" in Demo.tsx to your own heading and save.';
  const folder = join(src, 'demos', id);
  // Exclusive creation protects an existing participant folder, including with --force.
  await mkdir(folder);
  try {
    await writeFile(join(folder, 'Demo.tsx'), component);
    for (const file of ['index.html', 'main.tsx']) {
      const source = await readFile(join(src, 'demos/template', `${file}.template`), 'utf8');
      await writeFile(join(folder, file), source.replaceAll('__DEMO_ID__', id));
    }
    await writeFile(join(folder, 'package.json'), JSON.stringify({
      name: `@lab/demo-${id}`, private: true, version: '0.1.0', type: 'module',
      dependencies: { '@lab/demo-kit': '*', react: '19.3.1' },
      scripts: {
        dev: 'vite --config ../../../vite.demo.config.ts --host 127.0.0.1',
        build: 'vite build --config ../../../vite.demo.config.ts',
        preview: 'vite preview --config ../../../vite.demo.config.ts --host 127.0.0.1',
      },
    }, null, 2) + '\n');
    await writeFile(join(folder, 'README.md'), `# ${name}

## Open your demo

From the repository root, run npm run dev (or keep your existing dev server running).
Open its printed local address followed by #/demo/${id}; use Open standalone demo to launch the app. Your demo also appears in the gallery and your track.
This is your local copy; the hosted gallery updates only after your contribution is merged and deployed.

## Run independently

Run npm install after generation to refresh workspace links and the lockfile.
Use npm run dev --workspace @lab/demo-${id} to start this app alone.
Use npm run build --workspace @lab/demo-${id} to produce its deployable dist/ folder.
Both standalone and inline gallery presentation include these commands.

## First change

Edit playground/src/demos/${id}/Demo.tsx. ${firstChange}
Refresh the page: your code change should remain. Form inputs and other in-memory state may reset.
Navigate away and back to check the demo still works. You can replace this starter with your own idea.

## What belongs here

- index.html and main.tsx: your app entry. Replace the React entry for a different runtime.
- package.json: independent dev/build/preview commands and dependencies.
- Demo.tsx: your independent React component.
- demo.config.ts: gallery title, track, description, author and lazy component loader. The folder name is the URL ID.
- README.md: your question, what you tried, one observation and what to try next.

Keep styles local (Demo.module.css) and clean up timers, listeners and Workers on unmount.
Explore [your track's references](../../../../tracks/${track}/examples.md) when you want a hint; no finished example is required.

## Share

Run npm run check from the repository root. For UI/browser changes, also follow the browser checks in [CONTRIBUTING.md](../../../../CONTRIBUTING.md).
Use that guide to commit your folder and open a pull request. No central registry edit is needed.
`);
    const definition = `import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  presentation: ${JSON.stringify(presentation)},
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
  return `Created playground/src/demos/${id}.
1. Run npm run dev from the repository root, or keep your existing server running.
2. Open its printed local address followed by #/demo/${id}.
3. Edit playground/src/demos/${id}/Demo.tsx. ${firstChange}
4. Refresh: your code change stays; temporary input may reset.
Next steps and sharing: playground/src/demos/${id}/README.md.`;
}
