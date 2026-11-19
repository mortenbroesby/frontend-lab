import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Browser Beat',
  tracks: ['experimental-projects'],
  description:
    'Shape an original chiptune loop with a sequencer, synthesizer controls and a live oscilloscope.',
  author: 'Frontend Lab',
  explore: {
    file: 'pattern.ts',
    change: 'Change a note in one song and listen to how it changes the loop.',
  },
} satisfies DemoDefinition;
