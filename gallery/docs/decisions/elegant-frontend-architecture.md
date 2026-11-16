# Use EFA principles with flat demo packages

We use ideas from Michal Zalecki’s [Elegant Frontend Architecture](https://michalzalecki.com/elegant-frontend-architecture/) and its [reference structure](https://github.com/MichalZalecki/elegant-frontend-architecture): directional dependencies, feature ownership, explicit public interfaces and colocated supporting code. Small features stay flat; we adapt EFA rather than implement every layer.

## Why this approach

Participants need independently runnable, understandable examples. EFA clarifies ownership through standalone demo packages and a small shared kit.

Keep small demos flat. Dependency-cruiser enforces import boundaries. Demo-specific helpers stay local; we removed the empty utilities workspace until consumers need one.

## Our boundaries

| Owner | Responsibility | Allowed connections |
| --- | --- | --- |
| `gallery/src/app/` | Routes, guide composition and catalogue UI | Gallery modules and public kit exports |
| `gallery/src/demo-registry.ts` | Discover titles, descriptions and app URLs | Demo metadata only; never demo components |
| `demos/<id>/` | One independent experience, including state, effects, helpers and focused tests | Its own files, declared dependencies and public kit exports |
| `gallery/demo-kit/` | Shared types, presentation, mounting and gallery-link configuration | Own files and declared dependencies; never gallery app or demos |
| Root scripts and Vite configs | Development, builds and checks across packages | Workspace configuration and app entry points |

The combined build reads demo HTML entries without creating gallery runtime dependencies on their implementations. Apps also build independently.

Use the kit’s package exports instead of relative imports into its internals. Keep demo-specific services and state local. Pure helpers—artwork generation, prime counting, graph traversal—work without React. Colocate their tests.

Do not add `application/domain/ui/infrastructure` folders to every demo, barrel files, a global store or browser-API wrappers solely to match a diagram. Direct API use is often the lesson. Extract a helper when it makes a real responsibility clearer.

## Review evidence

Import review found no cross-demo implementation imports or reverse kit dependencies. Artwork and Worker tests live in their packages; root commands coordinate gallery, generator, script and demo tests.

`npm run check:architecture` runs the rules in `.dependency-cruiser.cjs`. It rejects cross-demo imports, gallery imports of demo implementation, metadata importing app logic, reverse kit dependencies, relative imports into shared packages, unresolved imports and cycles. The root `check` command and CI run it. Probes confirmed every rule rejects invalid imports, including type-only cross-demo imports, with a failing exit status.

Dependency-cruiser uses SWC because its compiler parser does not yet support TypeScript 7. Workspaces own their type checks and share root compiler options. The scan covers static imports in TS/TSX/JS; MDX content, Vite glob expansion and computed runtime imports still need review. It does not enforce all logic placement or replace review.

Fallow audits code quality; `npm run analyze:architecture` produces its architecture report. No browser-test infrastructure is required.
