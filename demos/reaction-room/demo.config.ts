import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Reaction Room',
  tracks: ['modern-web'],
  description: 'Create a room, tap together and set a shared reaction wall on fire.',
  requirements: ['internet', 'secure-context'],
  author: 'Lab examples',
  explore: {
    file: 'reactions.ts',
    change: 'Replace one reaction icon; open the same version on both screens and try it together.',
    guide: '/track/modern-web/devices',
  },
} satisfies DemoDefinition;
