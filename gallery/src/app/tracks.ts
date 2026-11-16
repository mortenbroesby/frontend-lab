import type { TrackId } from '../demo-contract';

export const tracks = [
  {
    id: 'modern-web',
    guides: [
      {
        slug: 'devices',
        title: 'Connect two browsers',
        description: 'Set up Device Rally, check its connection limits and try a small change.',
      },
      {
        slug: 'experiments',
        title: 'Explore browser capabilities',
        description: 'Try workers, messaging and dependency graphs, then change one thing.',
      },
    ],
    title: 'Modern Web Capabilities',
    description: 'Connect devices, create interactive graphics or run work in the background.',
  },
  {
    id: 'code-quality',
    guides: [
      {
        slug: 'fallow',
        title: 'Investigate with Fallow',
        description: 'Trace a finding, check the evidence and decide what is worth changing.',
      },
      {
        slug: 'experiments',
        title: 'Investigate tests and boundaries',
        description: 'Explore a test gap and the import rules that keep demos independent.',
      },
    ],
    title: 'Code Quality & Maintainability',
    description: 'Explore dependencies, simplify confusing code or improve a test.',
  },
  {
    id: 'developer-experience',
    guides: [
      {
        slug: 'experiments',
        title: 'Find your shortest feedback loop',
        description: 'Use real tests, watch mode and build caches to narrow your next check.',
      },
    ],
    title: 'Developer Experience & Tooling',
    description:
      'Explore faster tests, useful scripts, local development tools or agent workflows.',
  },
  {
    id: 'experimental-projects',
    guides: [
      {
        slug: 'experiments',
        title: 'Take an experiment apart',
        description: 'Change the rules of a little world or remix a repeatable SVG postcard.',
      },
    ],
    title: 'Experimental Projects',
    description: 'Make a game, an instrument, a visualisation or something of your own.',
  },
] satisfies {
  id: TrackId;
  title: string;
  description: string;
  guides: { slug: string; title: string; description: string }[];
}[];
