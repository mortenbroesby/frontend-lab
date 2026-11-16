import type { DemoDefinition } from '../../demo-contract';

export default {
  track: 'developer-experience', title: 'Know your commands', description: 'A read-only Node utility and a reason to keep it small.', author: 'Lab examples', load: () => import('../../examples/Tooling'),
} satisfies DemoDefinition;
