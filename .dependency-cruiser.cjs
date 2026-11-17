/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'presentation-stays-independent', severity: 'error',
      from: { path: '^presentation/' }, to: { path: '^(demos/)' },
    },
    {
      name: 'apps-do-not-import-presentation', severity: 'error',
      from: { path: '^(gallery/|demos/)' }, to: { path: '^presentation/' },
    },
    {
      name: 'ui-stays-independent', severity: 'error',
      from: { path: '^shared/ui/' }, to: { path: '^(gallery/|demos/|presentation/)' },
    },
    {
      name: 'use-ui-package-exports', severity: 'error',
      from: { pathNot: '^shared/ui/' },
      to: { path: '^shared/ui/', dependencyTypes: ['local'] },
    },
    {
      name: 'no-circular-dependencies', severity: 'error',
      from: {}, to: { circular: true },
    },
    {
      name: 'no-unresolved-imports', severity: 'error',
      from: {}, to: { couldNotResolve: true },
    },
    {
      name: 'demos-stay-independent', severity: 'error',
      comment: 'Keep demo implementations independent; extract shared code only for a concrete need.',
      from: { path: '^demos/([^/]+)/' },
      to: { path: '^demos/', pathNot: '^demos/$1/' },
    },
    {
      name: 'demos-use-kit-not-gallery', severity: 'error',
      from: { path: '^(demos|presentation)/' },
      to: { path: '^gallery/', pathNot: '^gallery/demo-kit/' },
    },
    {
      name: 'gallery-reads-only-demo-metadata', severity: 'error',
      from: { path: '^gallery/src/' },
      to: { path: '^(demos|presentation)/', pathNot: '^demos/[^/]+/demo\\.config\\.ts$' },
    },
    {
      name: 'metadata-stays-declarative', severity: 'error',
      from: { path: '^demos/[^/]+/demo\\.config\\.ts$' },
      to: { path: '^(demos/|presentation/|gallery/src/)' },
    },
    {
      name: 'kit-does-not-depend-on-apps', severity: 'error',
      from: { path: '^gallery/demo-kit/' },
      to: { path: '^(demos/|presentation/|gallery/)', pathNot: '^gallery/demo-kit/' },
    },
    {
      name: 'use-kit-package-exports', severity: 'error',
      from: { pathNot: '^gallery/demo-kit/' },
      to: { path: '^gallery/demo-kit/', dependencyTypes: ['local'] },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)dist/' },
    // SWC parses TypeScript directly; the app keeps its TypeScript 7 compiler.
    parser: 'swc',
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import', 'types', 'default'] },
  },
};
