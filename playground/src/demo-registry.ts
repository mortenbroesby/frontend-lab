import type { DemoComponent } from '@lab/demo-kit/types';
import { lazy } from 'react';
import { discoverDemos } from './demo-contract';

// Only metadata is eager; inline components load when opened.
const definitions = import.meta.glob('../../demos/*/demo.config.ts', { eager: true, import: 'default' });
const components = import.meta.glob<{ default: DemoComponent }>('../../demos/*/index.tsx');
export const demos = discoverDemos(definitions, components).map(({ load, ...metadata }) => ({
  ...metadata,
  href: `${import.meta.env.BASE_URL}demos/${metadata.id}/index.html`,
  Component: load ? lazy(load) : undefined,
}));
