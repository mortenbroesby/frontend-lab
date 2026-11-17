/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'ui-stays-independent', severity: 'error',
      from: { path: '^shared/ui/' }, to: { path: '^(gallery/|demos/|showcases/)' },
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
      name: 'showcases-stay-independent', severity: 'error',
      from: { path: '^showcases/([^/]+)/' },
      to: { path: '^(showcases/|demos/)', pathNot: '^showcases/$1/' },
    },
    {
      name: 'demos-do-not-import-showcases', severity: 'error',
      from: { path: '^demos/' }, to: { path: '^showcases/' },
    },
    {
      name: 'demos-use-kit-not-gallery', severity: 'error',
      from: { path: '^(demos|showcases)/' },
      to: { path: '^gallery/', pathNot: '^gallery/demo-kit/' },
    },
    {
      name: 'gallery-reads-only-demo-metadata', severity: 'error',
      from: { path: '^gallery/src/' },
      to: { path: '^(demos|showcases)/', pathNot: '^(demos/[^/]+/demo|showcases/[^/]+/showcase)\\.config\\.ts$' },
    },
    {
      name: 'metadata-stays-declarative', severity: 'error',
      from: { path: '^(demos/[^/]+/demo|showcases/[^/]+/showcase)\\.config\\.ts$' },
      to: { path: '^(demos/|showcases/|gallery/src/)' },
    },
    {
      name: 'kit-does-not-depend-on-apps', severity: 'error',
      from: { path: '^gallery/demo-kit/' },
      to: { path: '^(demos/|showcases/|gallery/)', pathNot: '^gallery/demo-kit/' },
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
