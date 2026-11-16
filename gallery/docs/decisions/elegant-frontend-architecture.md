# Use EFA principles with flat demo packages

We use ideas from Michal Zalecki’s [Elegant Frontend Architecture](https://michalzalecki.com/elegant-frontend-architecture/) and its [reference structure](https://github.com/MichalZalecki/elegant-frontend-architecture): directional dependencies, feature ownership, explicit public interfaces and colocated supporting code. EFA allows small features to stay flat. This is a practical adaptation, not a claim that our folders implement every EFA layer.

## Why this approach

Participants need examples they can run and understand independently. We considered EFA to clarify ownership as the gallery and demo collection grow. Self-contained demo packages and a small shared kit give us useful boundaries while keeping the workshop approachable.

We chose to keep small demos flat instead of introducing the full set of architectural layer folders. The tradeoff is that import boundaries rely on review; we have not added custom enforcement. Reconsider that only if cross-demo coupling becomes a recurring problem.

## Our boundaries

| Owner | Responsibility | Allowed connections |
| --- | --- | --- |
| `gallery/src/app/` | Routes, guide composition and catalogue UI | Gallery modules and public kit exports |
| `gallery/src/demo-registry.ts` | Discover titles, descriptions and app URLs | Demo metadata only; never demo components |
| `demos/<id>/` | One independent experience, including state, effects, helpers and focused tests | Its own files, declared dependencies and public kit exports |
| `gallery/demo-kit/` | Shared types, presentation, mounting and gallery-link configuration | Its own files and declared dependencies; no imports back into gallery app or demos |
| Root scripts and Vite configs | Development, builds and checks across packages | Workspace configuration and app entry points |

The combined site build reads every demo’s HTML entry. That is build-time composition, not a gallery runtime dependency on demo implementations. Individual apps remain buildable separately.

Use the kit’s package exports instead of relative imports into its internals. Keep demo-specific services and state local. Existing pure helpers such as artwork generation, prime counting and graph traversal can be understood and tested without React. Keep their tests next to them.

Do not add `application/domain/ui/infrastructure` folders to every demo, barrel files, a global store or browser-API wrappers solely to match a diagram. Direct API use is often the lesson. Extract a helper when it makes a real responsibility clearer.

## Review evidence

The import review found no cross-demo implementation imports or reverse dependencies from the kit. Artwork and Worker tests now belong to their demo packages; root commands coordinate their execution alongside gallery, generator and script tests.

`npm run analyze:architecture` checks cycles. No custom Fallow boundary rules are configured, so zero boundary violations is not automated proof of these written rules. Review imports when changing ownership; use a bounded check for the affected code. No browser-test infrastructure is required.
