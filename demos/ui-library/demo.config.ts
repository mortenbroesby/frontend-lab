import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'UI library',
  tracks: ['developer-experience'],
  description: 'Explore shared components, interaction states and keyboard patterns.',
  author: 'Lab examples',
  explore: {
    file: 'forms.tsx',
    change: 'Change a field label and the submit feedback, then try the form with the keyboard.',
    guide: '/track/developer-experience/developer-tools',
  },
} satisfies DemoDefinition;
