import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  track: 'modern-web', title: 'D3 idea constellation', description: 'Shape a network of ideas with forces, filters and pinned nodes.', author: 'Lab examples', load: () => import('./Constellation').then(m => ({ default: m.Constellation })),
} satisfies DemoDefinition;
