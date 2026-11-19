import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Signal Garden',
  description:
    'Switch formations, send a ripple and follow particle families in a D3-powered world. Change a movement rule to make it your own.',
  tracks: ['modern-web', 'experimental-projects'],
  author: 'Frontend Lab',
  explore: {
    file: 'model.ts',
    change: 'Change a formation radius in targetFor and compare the particle movement.',
    guide: '/track/experimental-projects/little-world',
  },
} satisfies DemoDefinition;
