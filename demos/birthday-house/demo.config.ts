import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Fødselsdagshuset',
  tracks: ['experimental-projects'],
  description: 'Et hyggeligt fødselsdagsmysterium i tre rum — bygget med Babylon.js.',
  author: 'Lab examples',
  explore: {
    file: 'birthday.ts',
    change: 'Replace the photo and write a personal birthday message.',
  },
} satisfies DemoDefinition;
