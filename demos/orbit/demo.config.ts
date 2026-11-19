import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Orbit · A scroll story',
  tracks: ['experimental-projects'],
  description: 'Scroll to reveal, spin and flip a speaker, then choose its finish.',
  author: 'Lab examples',
  explore: {
    file: 'index.tsx',
    change: 'Change one finish colour and scroll to its colour selector.',
    guide: '/track/experimental-projects/motion',
  },
} satisfies DemoDefinition;
