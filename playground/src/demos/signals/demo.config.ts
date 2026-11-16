import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  track: 'modern-web', title: 'Signals between tabs', description: 'Send local messages using BroadcastChannel.', author: 'Lab examples', load: () => import('./Signals').then(m => ({ default: m.Signals })),
} satisfies DemoDefinition;
