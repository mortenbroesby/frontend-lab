import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  title: 'Lunar Lander',
  tracks: ['modern-web', 'experimental-projects'],
  description:
    'A tiny Moon landing. Rust flies the spacecraft; Canvas draws the view. Mind the fuel.',
  author: 'Lab examples',
  explore: {
    file: 'paint.ts',
    change:
      'Change a terrain colour without installing Rust. Physics changes live in rust/src/lib.rs and require the Rust steps in this demo’s README.',
    guide: '/track/experimental-projects/first-game',
  },
} satisfies DemoDefinition;
