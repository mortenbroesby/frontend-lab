import { createDemo, validateId, validateName } from './create-demo.mjs';

/** @param {import('@turbo/gen').PlopTypes.NodePlopAPI} plop */
export default function generator(plop) {
  const required = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 240 || 'Enter 1–240 characters.';
  plop.setGenerator('demo', {
    description: 'Create a React demo and register it in the shared lab',
    prompts: [
      { type: 'input', name: 'title', message: 'Demo name (shown in the gallery):', validate: value => validateName(value) || 'Give your demo a name: 1–240 characters on one line.' },
      { type: 'input', name: 'id', message: 'Demo ID (folder and URL):', default: answers => answers.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60).replace(/-$/, ''), validate: value => validateId(value) || 'Use lowercase kebab-case; template and system names are reserved.' },
      { type: 'list', name: 'track', message: 'Which track?', choices: [
        { name: 'Modern Web Capabilities', value: 'modern-web' },
        { name: 'Code Quality & Maintainability', value: 'code-quality' },
        { name: 'Developer Experience & Tooling', value: 'developer-experience' },
        { name: 'Experimental Projects', value: 'experimental-projects' },
      ] },
      { type: 'input', name: 'author', message: 'Your name or group:', validate: required },
      { type: 'input', name: 'description', message: 'What can someone try or learn?', validate: required },
      { type: 'list', name: 'presentation', message: 'Gallery presentation (both have their own app):', default: 'standalone', choices: [{ name: 'Standalone — open the demo app', value: 'standalone' }, { name: 'Inline — also render inside the gallery (React)', value: 'inline' }] },
    ],
    actions: [answers => createDemo(answers.turbo.paths.root, answers)],
  });
}
