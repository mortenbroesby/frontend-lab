import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Merge Bouncer',
  tracks: ['experimental-projects'],
  description:
    'Guard the neon office as the release knight. Merge clean changes, test suspicious ones and keep regressions out of the release.',
  author: 'Lab examples',
  explore: {
    file: 'rules.ts',
    change: 'Change one PR clue or arrival time, then replay the release.',
  },
} satisfies DemoDefinition;
