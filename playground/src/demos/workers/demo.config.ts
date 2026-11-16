import type { DemoDefinition } from '../../demo-contract';

export default {
  track: 'modern-web', title: 'Room to think', description: 'Compare a calculation on the main thread and in a Worker.', author: 'Lab examples', load: () => import('../../examples/Workers').then(m => ({ default: m.Workers })),
} satisfies DemoDefinition;
