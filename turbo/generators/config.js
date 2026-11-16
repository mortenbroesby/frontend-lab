import { createDemo, validateId } from './create-demo.mjs';

/** @param {import('@turbo/gen').PlopTypes.NodePlopAPI} plop */
export default function generator(plop) {
  const required = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 240 || 'Enter 1–240 characters.';
  plop.setGenerator('demo', {
    description: 'Create a React demo and register it in the shared lab',
    prompts: [
      { type: 'input', name: 'id', message: 'Demo ID (e.g. chapter-quiz):', validate: value => validateId(value) || 'Use lowercase kebab-case; template and system names are reserved.' },
      { type: 'list', name: 'track', message: 'Which track?', choices: [
        { name: 'A · Modern Web Capabilities', value: 'a' },
        { name: 'B · Code Quality & Maintainability', value: 'b' },
        { name: 'C · Developer Experience & Tooling', value: 'c' },
        { name: 'D · Experimental Projects', value: 'd' },
      ] },
      { type: 'input', name: 'title', message: 'Demo title:', validate: required },
      { type: 'input', name: 'author', message: 'Your name or group:', validate: required },
      { type: 'input', name: 'description', message: 'What can someone try or learn?', validate: required },
    ],
    actions: [answers => createDemo(answers.turbo.paths.root, answers)],
  });
}
