import { discoverDemos } from './demo-contract';

const definitions = import.meta.glob('../../showcases/*/showcase.config.ts', {
  eager: true,
  import: 'default',
});
const previews = import.meta.glob<string>('../../showcases/*/preview.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});
export const showcases = discoverDemos(definitions, 'showcases').map((metadata) => ({
  ...metadata,
  preview: previews[`../../showcases/${metadata.id}/preview.svg`],
  href: `${import.meta.env.BASE_URL}showcases/${metadata.id}/index.html`,
}));
