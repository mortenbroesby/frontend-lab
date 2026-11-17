import type { TrackId } from '../demo-contract';

export const tracks = [
  {
    id: 'modern-web',
    guides: [
      {
        slug: 'devices',
        title: 'Connect two browsers',
        description: 'Explore peers, messages and what your screens need to share.',
      },
      {
        slug: 'workers',
        title: 'Keep the interface responsive',
        description:
          'Investigate which work can move off-thread and whether it improves responsiveness.',
      },
      {
        slug: 'tab-settings',
        title: 'Synchronise a setting between tabs',
        description:
          'Decide what tabs should share and explore messaging, persistence and conflicting changes.',
      },
    ],
    title: 'Modern Web Capabilities',
    description: 'Connect devices, create interactive graphics or run work in the background.',
  },
  {
    id: 'code-quality',
    guides: [
      {
        slug: 'tdd',
        title: 'Build a behaviour with TDD',
        description: 'Write a failing test, make it pass and refactor through one small behaviour.',
      },
      {
        slug: 'state-machines',
        title: 'What is a state machine?',
        description:
          'Explore XState through a TV remote whose buttons change meaning during playback.',
      },
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
        slug: 'first-game',
        title: 'Make your first browser game',
        description: 'Choose a game framework, build one playable mechanic and make it your own.',
      },
      {
        slug: 'motion',
        title: 'Add motion with purpose',
        description:
          'Explore when CSS, Motion or a Lottie illustration helps explain an interaction.',
      },
      {
        slug: 'little-world',
        title: 'Build a tiny moving world',
        description:
          'Invent a behaviour and explore how state, rules and time shape a small world.',
      },
      {
        slug: 'postcard',
        title: 'Make generative SVG art',
        description: 'Explore visual rules, controlled randomness and reproducible compositions.',
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
