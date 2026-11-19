import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  tracks: ['experimental-projects'],
  title: 'Generative postcard',
  description: 'Remix a repeatable composition and save it as SVG.',
  author: 'Lab examples',
  explore: {
    file: 'art.ts',
    change: 'Change the spiral angle while keeping the seed fixed.',
    guide: '/track/experimental-projects/postcard',
  },
} satisfies DemoDefinition;
