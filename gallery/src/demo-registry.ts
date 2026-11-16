import { discoverDemos } from './demo-contract';

// The catalogue reads metadata only; each demo owns its app entry and runtime.
const definitions = import.meta.glob('../../demos/*/demo.config.ts', {
  eager: true,
  import: 'default',
});
// Optional, demo-owned artwork; no demo runtime is imported into the gallery.
const previews = import.meta.glob<string>('../../demos/*/preview.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});
export const demos = discoverDemos(definitions).map((metadata) => ({
  ...metadata,
  preview: previews[`../../demos/${metadata.id}/preview.svg`],
  href: `${import.meta.env.BASE_URL}demos/${metadata.id}/index.html`,
}));
