import { discoverDemos } from './demo-contract';

// The catalogue reads metadata only; each demo owns its app entry and runtime.
const definitions = import.meta.glob('../../demos/*/demo.config.ts', { eager: true, import: 'default' });
export const demos = discoverDemos(definitions).map(metadata => ({
  ...metadata,
  href: `${import.meta.env.BASE_URL}demos/${metadata.id}/index.html`,
}));
