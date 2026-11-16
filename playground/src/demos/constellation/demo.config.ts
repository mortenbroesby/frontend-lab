import type { DemoDefinition } from '../../demo-contract';

export default {
  track: 'a', title: 'D3 idea constellation', description: 'Shape a network of ideas with forces, filters and pinned nodes.', author: 'Lab examples', load: () => import('../../examples/Constellation').then(m => ({ default: m.Constellation })),
} satisfies DemoDefinition;
