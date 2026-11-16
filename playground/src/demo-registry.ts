import { lazy } from 'react';
import { discoverDemos } from './demo-contract';

// Metadata is eager; implementations remain behind each definition's load().
const definitions = import.meta.glob('./demos/*/demo.config.ts', { eager: true, import: 'default' });
export const demos = discoverDemos(definitions).map(({ load, ...metadata }) => ({
  ...metadata,
  href: `${import.meta.env.BASE_URL}src/demos/${metadata.id}/index.html`,
  Component: load ? lazy(load) : undefined,
}));
