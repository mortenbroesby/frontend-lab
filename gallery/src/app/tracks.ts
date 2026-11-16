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
        slug: 'dependencies',
        title: 'Trace a dependency’s reach',
        description: 'Follow consumers to choose where to investigate a package change.',
      },
      {
        slug: 'workers',
        title: 'Keep the interface responsive',
        description: 'Separate calculation speed from the browser’s ability to respond.',
      },
      {
        slug: 'tab-settings',
        title: 'Synchronise a setting between tabs',
        description:
          'Send a real preference change, then discover what a late-arriving tab misses.',
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
        slug: 'little-world',
        title: 'Change one rule in a little world',
        description: 'Predict how a sensing or movement rule changes a small simulation.',
      },
      {
        slug: 'postcard',
        title: 'Reproduce a generative composition',
        description:
          'Keep randomness fixed while changing the visual rule, then export the result.',
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
