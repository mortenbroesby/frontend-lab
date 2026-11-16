import type { DemoDefinition } from '../../demo-contract';

export default {
  track: 'modern-web', title: 'Signals between tabs', description: 'Send local messages using BroadcastChannel.', author: 'Lab examples', load: () => import('../../examples/Signals').then(m => ({ default: m.Signals })),
} satisfies DemoDefinition;
