import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

export function validateId(id) {
  return (
    typeof id === 'string' &&
    /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(id) &&
    id.length <= 60 &&
    !/^(template|con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(id)
  );
}

export function validateName(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= 240 &&
    !/[\r\n]/.test(value)
  );
}

export async function createDemo(root, answers) {
  const { id, track } = answers;
  if (!validateName(answers.title))
    throw new Error('Demo name is required: enter 1–240 characters on one line.');
  const name = answers.title.trim();
  if (!validateId(id))
    throw new Error(
      'Use a unique lowercase kebab-case ID, up to 60 characters; template and system names are reserved.',
    );
  if (
    !['modern-web', 'code-quality', 'developer-experience', 'experimental-projects'].includes(track)
  )
    throw new Error('Choose a named track from the generator menu.');
  for (const key of ['description', 'author']) {
    if (typeof answers[key] !== 'string' || !answers[key].trim() || answers[key].length > 240) {
      throw new Error(`${key} must contain 1–240 characters.`);
    }
  }
  const kit = JSON.parse(await readFile(join(root, 'gallery/demo-kit/package.json'), 'utf8'));
  const src = join(root, 'gallery/src');
  const modernWeb = track === 'modern-web';
  const templatePath = modernWeb ? 'starters/BrowserStarter.tsx' : 'starters/IdeaStarter.tsx';
  const template = await readFile(join(src, templatePath), 'utf8');
  const nameSlot = modernWeb ? 'One shape. Your next question.' : "useState('What if…')";
  if (template.split(nameSlot).length !== 2)
    throw new Error('Expected one name slot in the demo template.');
  const component = template
    .replace(nameSlot, () =>
      modernWeb ? `{${JSON.stringify(name)}}` : `useState(${JSON.stringify(name)})`,
    )
    .replace('export function BrowserStarter()', 'export default function Demo()')
    .replace(
      'To get your own copy, run <code>npm run demo:new</code> and choose Modern Web Capabilities. ',
      'This is your independent circle starter. ',
    );
  const firstChange = modernWeb
    ? 'Change the circle fill colour in index.tsx, save, then move the radius control.'
    : 'Change "An idea, taking shape" in index.tsx to your own heading and save.';
  const folder = join(root, 'demos', id);
  // Exclusive creation protects an existing participant folder, including with --force.
  await mkdir(folder);
  try {
    await writeFile(join(folder, 'index.tsx'), component);
    for (const file of ['index.html', 'main.tsx']) {
      const source = await readFile(
        join(root, 'turbo/generators/templates', `${file}.template`),
        'utf8',
      );
      await writeFile(join(folder, file), source.replaceAll('__DEMO_ID__', id));
    }
    await writeFile(
      join(folder, 'package.json'),
      JSON.stringify(
        {
          name: `@lab/demo-${id}`,
          private: true,
          version: '0.1.0',
          type: 'module',
          dependencies: { '@lab/demo-kit': '*', '@lab/ui': '*', react: kit.dependencies.react },
          scripts: {
            dev: 'vite --config ../../gallery/vite.demo.config.ts --host 127.0.0.1',
            typecheck: 'tsc --noEmit',
            check: 'npm run typecheck && npm run build',
            build: 'vite build --config ../../gallery/vite.demo.config.ts',
            preview: 'vite preview --config ../../gallery/vite.demo.config.ts --host 127.0.0.1',
          },
        },
        null,
        2,
      ) + '\n',
    );
    await writeFile(
      join(folder, 'tsconfig.json'),
      JSON.stringify(
        {
          extends: '../../tsconfig.base.json',
          include: ['**/*.ts', '**/*.tsx'],
          exclude: ['dist', 'node_modules'],
        },
        null,
        2,
      ) + '\n',
    );
    await writeFile(
      join(folder, 'README.md'),
      `# ${name}

From the repository root:

\`\`\`sh
npm install
npm run dev --workspace @lab/demo-${id}
\`\`\`

Install once after generation to link the new workspace. Open the URL printed by Vite.
Edit demos/${id}/index.tsx and save; the browser updates automatically. ${firstChange}

The gallery discovers demo.config.ts automatically; no registration needed.
With npm run dev at the root, open the gallery URL followed by #/demo/${id}.

Check this demo: npm run check --workspace @lab/demo-${id}.
For types only: npm run typecheck --workspace @lab/demo-${id}.
The build goes into demos/${id}/dist/. Add tests when you have logic worth testing.
`,
    );
    const definition = `import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: ${JSON.stringify(name)},
  track: ${JSON.stringify(track)},
  description: ${JSON.stringify(answers.description.trim())},
  author: ${JSON.stringify(answers.author.trim())},
} satisfies DemoDefinition;
`;
    // Load at execution time: Turbo's config bundler cannot bundle Prettier's runtime.
    const formatterModule = 'prettier';
    const { format, resolveConfig } = await import(formatterModule);
    const formatting = await resolveConfig(join(root, '.prettierrc.json'));
    for (const file of ['index.tsx', 'main.tsx']) {
      const path = join(folder, file);
      await writeFile(
        path,
        await format(await readFile(path, 'utf8'), { ...formatting, filepath: path }),
      );
    }
    // Publish metadata last so discovery never sees a half-created component.
    await writeFile(
      join(folder, 'demo.config.ts'),
      await format(definition, { ...formatting, parser: 'typescript' }),
    );
  } catch (error) {
    await rm(folder, { recursive: true, force: true });
    throw error;
  }
  return `Created demos/${id}.

From the repository root:
  npm install
  npm run dev --workspace @lab/demo-${id}

Install once after generation to link the new workspace. Open the URL printed by Vite.
Edit demos/${id}/index.tsx and save; the browser updates automatically.
${firstChange}

Gallery (optional): npm run dev, then its printed URL + #/demo/${id}.
Check: npm run check --workspace @lab/demo-${id}.`;
}
