import type { TrackId } from '../demo-contract';

export const ideas = [
  { id: 'phone-controller', track: 'modern-web', title: 'Turn your phone into a controller', description: 'Make a reaction or control travel between two browsers.' },
  { id: 'change-impact', track: 'modern-web', title: 'See how a code change spreads', description: 'Build an interactive map of dependencies and their consumers.' },
  { id: 'smooth-interface', track: 'modern-web', title: 'Keep an interface smooth under load', description: 'Move a calculation off the main thread and keep interacting.' },
  { id: 'dependency-health', track: 'code-quality', title: 'Find what your project no longer needs', description: 'Investigate dependencies and distinguish useful code from clutter.' },
  { id: 'faster-feedback', track: 'developer-experience', title: 'Make your feedback loop faster', description: 'Improve one frustrating step in your everyday workflow.' },
  { id: 'generative-art', track: 'experimental-projects', title: 'Create generative artwork', description: 'Turn a few shapes and a little randomness into a visual experiment.' },
] satisfies { id: string; track: TrackId; title: string; description: string }[];
