import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  tracks: ['modern-web'],
  title: 'One setting, two tabs',
  description: 'Synchronise a list preference and see why messaging is not persistence.',
  author: 'Lab examples',
  explore: {
    file: 'index.tsx',
    change: 'Change the default density and compare a new tab with one that is already open.',
    guide: '/track/modern-web/tab-settings',
  },
} satisfies DemoDefinition;
