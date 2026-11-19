import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  tracks: ['modern-web', 'code-quality'],
  title: 'Dependency ripple',
  description: 'Trace package impact in this repo’s interactive D3 dependency map.',
  author: 'Lab examples',
  explore: {
    file: 'graph.ts',
    change: 'Add a small test graph and predict which consumers impactOf should return.',
    guide: '/track/code-quality/dependencies',
  },
} satisfies DemoDefinition;
