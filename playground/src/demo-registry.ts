import { lazy } from 'react';
import { discoverDemos } from './demo-contract';

// Metadata is eager; implementations remain behind each definition's load().
const definitions = import.meta.glob('./demos/*/demo.config.ts', { eager: true, import: 'default' });
export const demos = discoverDemos(definitions).map(({ load, ...metadata }) => ({
  ...metadata,
  Component: lazy(load),
}));
