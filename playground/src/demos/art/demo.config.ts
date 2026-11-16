import type { DemoDefinition } from '../../demo-contract';

export default {
  track: 'experimental-projects', title: 'Generative postcard', description: 'Remix a repeatable composition and take it home as SVG.', author: 'Lab examples', load: () => import('../../examples/ArtStudio').then(m => ({ default: m.Art })),
} satisfies DemoDefinition;
