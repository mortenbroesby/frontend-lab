import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Orbit · A scroll story',
  tracks: ['experimental-projects'],
  description: 'Scroll to tilt and turn a speaker, then choose a finish and spin it yourself.',
  author: 'Lab examples',
  explore: {
    file: 'finishes.ts',
    change: 'Change one palette stop, then drag the colour slider through it.',
    guide: '/track/experimental-projects/motion',
  },
} satisfies DemoDefinition;
