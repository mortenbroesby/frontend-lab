import type { TrackId } from '../demo-contract';

export const tracks = [
  {
    id: 'modern-web',
    title: 'Modern Web Capabilities',
    description: 'Connect devices, create interactive graphics or run work in the background.',
  },
  {
    id: 'code-quality',
    title: 'Code Quality & Maintainability',
    description: 'Explore dependencies, simplify confusing code or improve a test.',
  },
  {
    id: 'developer-experience',
    title: 'Developer Experience & Tooling',
    description:
      'Explore faster tests, useful scripts, local development tools or agent workflows.',
  },
  {
    id: 'experimental-projects',
    title: 'Experimental Projects',
    description: 'Make a game, an instrument, a visualisation or something of your own.',
  },
] satisfies { id: TrackId; title: string; description: string }[];
