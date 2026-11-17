import { createDemo, validateName } from './create-demo.mjs';

/** @param {import('@turbo/gen').PlopTypes.NodePlopAPI} plop */
export default function generator(plop) {
  plop.setGenerator('demo', {
    description: 'Create a standalone React demo with automatic gallery discovery',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Demo name (shown in the gallery):',
        validate: (value) => validateName(value) || 'Enter a name: 1–240 characters, one line.',
      },
    ],
    actions: [(answers) => createDemo(answers.turbo.paths.root, answers)],
  });
}
