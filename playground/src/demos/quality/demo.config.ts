import type { DemoDefinition } from '../../demo-contract';

export default {
  track: 'code-quality', title: 'A test gap, investigated', description: 'Follow evidence from a question to a small confidence improvement.', author: 'Lab examples', load: () => import('../../examples/Quality'),
} satisfies DemoDefinition;
