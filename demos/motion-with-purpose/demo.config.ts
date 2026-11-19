import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Motion with purpose',
  tracks: ['experimental-projects'],
  description: 'Filter, rearrange and open a collection of graphic prints with connected motion.',
  author: 'Lab examples',
  explore: {
    file: 'index.tsx',
    change:
      'Change the default transition duration and compare how rearranging the collection feels.',
    guide: '/track/experimental-projects/motion',
  },
} satisfies DemoDefinition;
