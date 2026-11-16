import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  requirements: ['offline'],
  track: 'modern-web',
  title: 'Dependency ripple',
  description:
    'Change one package. Trace its reach through this repository with an interactive D3 dependency map.',
  author: 'Lab examples',
} satisfies DemoDefinition;
