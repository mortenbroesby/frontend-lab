import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Little world',
  tracks: ['experimental-projects'],
  description: 'Plant food and change the rules of a tiny pond.',
  author: 'Lab examples',
  explore: {
    file: 'world.ts',
    change: 'Change the initial creature count and watch how quickly the food disappears.',
    guide: '/track/experimental-projects/little-world',
  },
} satisfies DemoDefinition;
