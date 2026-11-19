import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  tracks: ['modern-web'],
  title: 'Room to think',
  description: 'Measure how main-thread and Worker calculations affect frame gaps.',
  author: 'Lab examples',
  explore: {
    file: 'index.tsx',
    change:
      'Change the initial workload and compare interaction responsiveness on and off the main thread.',
    guide: '/track/modern-web/workers',
  },
} satisfies DemoDefinition;
