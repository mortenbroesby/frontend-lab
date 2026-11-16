import type { TrackId } from '../demo-contract';

export const tracks = [
  {
    id: 'modern-web',
    title: 'Modern Web Capabilities',
    description: 'Explore browser APIs for visuals, computation and communication.',
  },
  {
    id: 'code-quality',
    title: 'Code Quality & Maintainability',
    description: 'Investigate code health, dependencies, complexity and architecture.',
  },
  {
    id: 'developer-experience',
    title: 'Developer Experience & Tooling',
    description: 'Find friction. Try an improvement.',
  },
  {
    id: 'experimental-projects',
    title: 'Experimental Projects',
    description: 'Build a game, visual story, quiz—or your own idea.',
  },
] satisfies { id: TrackId; title: string; description: string }[];
