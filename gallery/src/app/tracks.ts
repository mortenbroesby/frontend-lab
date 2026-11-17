import type { TrackId } from '../demo-contract';

export const tracks = [
  {
    id: 'modern-web',
    guides: [
      {
        slug: 'devices',
        title: 'Connect two browsers',
        description: 'Build a reaction button that sends a message to another browser.',
      },
      {
        slug: 'workers',
        title: 'Keep the interface responsive',
        description: 'Move a calculation into a Web Worker and return its result to React.',
      },
      {
        slug: 'tab-settings',
        title: 'Synchronise a setting between tabs',
        description: 'Build a shared preference with BroadcastChannel, then explore persistence.',
      },
    ],
    title: 'Modern Web Capabilities',
    description: 'Connect devices, create interactive graphics or run work in the background.',
  },
  {
    id: 'code-quality',
    guides: [
      {
        slug: 'dependencies',
        title: 'Trace a dependency’s reach',
        description: 'Follow consumers to choose where to investigate a package change.',
      },
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
        title: 'Profile a React interaction',
        description: 'Record an interaction, follow the work and evaluate one improvement.',
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
        slug: 'motion',
        title: 'Add motion with purpose',
        description: 'Connect an action to its result with Motion and a reusable Lottie animation.',
      },
      {
        slug: 'little-world',
        title: 'Build a tiny moving world',
        description: 'Create a movement rule, animate a creature and give it a goal.',
      },
      {
        slug: 'postcard',
        title: 'Make generative SVG art',
        description: 'Generate shapes from a seed, invent a visual rule and export your artwork.',
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
