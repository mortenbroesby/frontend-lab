import type { DemoDefinition } from '../../demo-contract';

export default {
  title: 'Device rally',
  track: 'modern-web',
  description: 'Find other browsers automatically and send giant emoji cheers with Trystero and WebRTC.',
  author: 'Lab examples',
  load: () => import('./Demo'),
} satisfies DemoDefinition;
