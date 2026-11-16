import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  track: 'experimental-projects', title: 'Generative postcard', description: 'Remix a repeatable composition and take it home as SVG.', author: 'Lab examples', load: () => import('./ArtStudio').then(m => ({ default: m.Art })),
} satisfies DemoDefinition;
