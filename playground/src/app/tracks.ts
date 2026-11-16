import type { TrackId } from '../demo-contract';

export const tracks = [
  { id: 'modern-web', title: 'Modern Web Capabilities', description: 'Explore visuals, computation, communication and unfamiliar browser APIs.' },
  { id: 'code-quality', title: 'Code Quality & Maintainability', description: 'Investigate code health, dependencies, complexity and architecture.' },
  { id: 'developer-experience', title: 'Developer Experience & Tooling', description: 'Find a recurring frustration and try a practical improvement.' },
  { id: 'experimental-projects', title: 'Experimental Projects', description: 'Build a game, a visual story, a quiz—or something entirely your own.' },
] satisfies { id: TrackId; title: string; description: string }[];
