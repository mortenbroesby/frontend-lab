import type { Link } from './graph';

interface Manifest {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}
export const groups = [
  { name: 'Workspace', colour: '#8ee6cc' },
  { name: 'Runtime dependency', colour: '#ffc88a' },
  { name: 'Development tool', colour: '#bcaeff' },
];

// Build-time snapshot of declared dependencies, not a source-code or lockfile analysis.
const manifests = import.meta.glob<Manifest>(
  [
    '../*/package.json',
    '../../gallery/demo-kit/package.json',
    '../../shared/*/package.json',
    '../../showcases/*/package.json',
    '../../gallery/package.json',
    '../../package.json',
  ],
  { eager: true, import: 'default' },
);
const workspaceNames = new Set(Object.values(manifests).map((pkg) => pkg.name));
const runtimeNames = new Set(
  Object.values(manifests).flatMap((pkg) => Object.keys(pkg.dependencies ?? {})),
);
export const links: Link[] = Object.values(manifests).flatMap((pkg) =>
  Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).map((target) => ({
    source: pkg.name,
    target,
  })),
);
const paths = new Map(
  Object.entries(manifests).map(([path, pkg]) => [
    pkg.name,
    path.replace('../../', '').replace('../', 'demos/'),
  ]),
);
export const modules = [...new Set([...workspaceNames, ...links.map((link) => link.target)])].map(
  (id) => ({
    id,
    name: id
      .replace('@lab/demo-', '')
      .replace('@lab/', '')
      .replace('front-end-lab-gallery', 'gallery')
      .replace('frontend-chapter-day', 'repo tooling'),
    category: workspaceNames.has(id) ? 0 : runtimeNames.has(id) ? 1 : 2,
    path: paths.get(id) ?? 'External dependency',
  }),
);
