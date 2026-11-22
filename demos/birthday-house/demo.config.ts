import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Birthday House',
  tracks: ['experimental-projects'],
  description: 'A three-room birthday mystery in blue hour, built in Babylon.js.',
  author: 'Lab examples',
  explore: {
    file: 'birthday.ts',
    change: 'Replace the photo and write a personal birthday message.',
  },
} satisfies DemoDefinition;
