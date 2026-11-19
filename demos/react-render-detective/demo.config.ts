import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'React Render Detective',
  tracks: ['developer-experience'],
  description: 'Spot rerenders, test memo and see why prop identity matters.',
  author: 'Lab examples',
  explore: {
    file: 'experiment.tsx',
    change: 'Change one prop passed to a child and observe the render count before adding memo.',
    guide: '/track/developer-experience/rendering',
  },
} satisfies DemoDefinition;
