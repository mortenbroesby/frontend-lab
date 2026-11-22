import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'The Birthday Portrait',
  tracks: ['experimental-projects'],
  description:
    'Explore a photographer’s attic, decipher a birthday note and unlock a hidden portrait.',
  author: 'Lab examples',
  explore: { file: 'birthday.ts', change: 'Personalise the photograph and birthday message.' },
} satisfies DemoDefinition;
