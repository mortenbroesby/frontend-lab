import { lazy } from 'react';

// Add one entry per demo. Keep its implementation and styles in its own folder.
// Lazy imports keep inactive experiments out of the running page.
export const demos = [
  { id: 'constellation', track: 'a', title: 'D3 idea constellation', description: 'Shape a network of ideas with forces, filters and pinned nodes.', author: 'Lab examples', Component: lazy(() => import('./examples/Constellation').then(m => ({ default: m.Constellation }))) },
  { id: 'workers', track: 'a', title: 'Room to think', description: 'Compare a calculation on the main thread and in a Worker.', author: 'Lab examples', Component: lazy(() => import('./examples/Workers').then(m => ({ default: m.Workers }))) },
  { id: 'signals', track: 'a', title: 'Signals between tabs', description: 'Send local messages using BroadcastChannel.', author: 'Lab examples', Component: lazy(() => import('./examples/Signals').then(m => ({ default: m.Signals }))) },
  { id: 'quality', track: 'b', title: 'A test gap, investigated', description: 'Follow evidence from a question to a small confidence improvement.', author: 'Lab examples', Component: lazy(() => import('./examples/Quality')) },
  { id: 'tooling', track: 'c', title: 'Know your commands', description: 'A read-only Node utility and a reason to keep it small.', author: 'Lab examples', Component: lazy(() => import('./examples/Tooling')) },
  { id: 'art', track: 'd', title: 'Generative postcard', description: 'Remix a repeatable composition and take it home as SVG.', author: 'Lab examples', Component: lazy(() => import('./examples/ArtStudio').then(m => ({ default: m.Art }))) },
];
