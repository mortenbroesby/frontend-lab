import type { DemoDefinition } from '@lab/demo-kit/types';
export default {
  title: 'Remote / Canvas TV',
  description:
    'Browse a Canvas TV with a keyboard remote. An XState machine keeps browsing, playback and controls in distinct states.',
  tracks: ['modern-web', 'code-quality'],
  author: 'Frontend Lab',
  explore: {
    file: 'catalogue.ts',
    change: 'Change a programme title, then navigate to it with the remote.',
    guide: '/track/code-quality/state-machines',
  },
} satisfies DemoDefinition;
