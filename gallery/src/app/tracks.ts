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
      {
        slug: 'workers',
        title: 'Keep the interface responsive',
        description: 'Separate calculation speed from the browser’s ability to respond.',
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
        slug: 'test-confidence',
        title: 'Find a missing test',
        description: 'Trace a behaviour, choose a boundary and justify the expected result.',
      },
      {
        slug: 'architecture',
        title: 'Protect an architecture boundary',
        description:
          'Turn an ownership decision into an import rule and prove it catches a violation.',
      },
    ],
    title: 'Code Quality & Maintainability',
    description: 'Explore dependencies, simplify confusing code or improve a test.',
  },
  {
    id: 'developer-experience',
    guides: [
      {
        slug: 'feedback-loop',
        title: 'Find your shortest feedback loop',
        description: 'Use real tests, watch mode and build caches to narrow your next check.',
      },
      {
        slug: 'rendering',
        title: 'Why did React render again?',
        description: 'Compare prop identity and local state before deciding whether memo helps.',
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
