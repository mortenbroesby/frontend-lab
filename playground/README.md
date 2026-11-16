# The Front-End Lab playground

An optional local starting point for [choosing a track](../README.md). Examples are reference destinations, not steps you have to complete.

Run `npm ci` and `npm run dev` from the repository root, then open the printed address. **Local setup** in the app contains participant setup and troubleshooting.

## Architecture and where to work

| File | Responsibility |
| --- | --- |
| `src/app/App.tsx` | Shared navigation, track pages and gallery |
| `src/app/tracks.ts` | Four track identities |
| `src/content/` | MDX participant pages with embedded React starters |
| `src/app/Guide.tsx` | Lazy MDX page loading and shared heading/table styles |
| `src/demo-contract.ts` | Shared `DemoDefinition` type |
| `src/demos/<your-idea>/demo.config.ts` | Demo metadata and component loader, discovered by the host |
| `src/demos/template/` | Copyable bootstrap, separate from completed examples |
| `src/demos/<your-idea>/` | Your component, assets and scoped styles |
| `src/demos/<id>/index.html` | Independently runnable app entry, also included in the gallery build |
| `src/starters/BrowserStarter.tsx` | Optional one-circle browser starting point on Modern Web Capabilities |
| `../packages/demo-kit/DemoBoundary.tsx` | Render-error fallback around the active demo |
| `../packages/demo-kit/styles.css` | Shared shell, responsive layout and accessibility styles |
| `tests/` | Logic checks and browser journeys |

Open **Create a demo** in the app. Run `npm run demo:new` from the repository root; Turborepo creates an independent app workspace with `Demo.tsx`, `demo.config.ts`, HTML/TypeScript entries and `README.md` in your demo folder. The host discovers `demo.config.ts` automatically and uses the folder name as the ID; no central registry or app-shell edit is needed. Use local component state, optional CSS modules and effect cleanup. The gallery orders demos alphabetically by folder ID. Metadata is discovered up front; components load only when opened and unmount when leaving. The render boundary protects navigation from React render failures; it cannot isolate blocking code or catch arbitrary async errors.

`demo.config.ts` default-exports an object satisfying `DemoDefinition` from `@lab/demo-kit/types`, with `title`, `track`, `description`, `author` and optional `load` for standalone entries. Inline entries require `load`. The loader imports a module whose default export is your React component. Use the generator and **Create a demo** page in the app for the exact file shape.

Hash routes such as `#/track/modern-web`, `#/demo/constellation` and `#/create` keep deep links in one app without server rewrite rules. Sharing is Git-backed: merge a contribution, then pull it locally. There is no live cross-computer sync.

## Author a track page

Edit the track's `src/content/tracks/<track-id>/*.mdx` page. Write prose and code blocks normally, import an existing React starter, and place it beside the instruction that uses it. The Modern Web getting-started page demonstrates this pattern.

Keep completed examples in their demo routes. Link between app pages with `#/track/...`, `#/demo/...` or `#/guide/...`; do not link to a deployment domain or raw guide file. Each MDX page is compiled at build time and loaded on demand. Imports and JSX are trusted application code, so do not load remote or user-authored MDX at runtime.

## Useful commands

Run `npm ci`, `npm run demo:new`, `npm run dev` and `npm run check` from the repository root. Turbo coordinates the workspace tasks. The following app-specific commands also work from `playground` after the root install:

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development with fast refresh |
| `npm run typecheck` | TypeScript check without producing files |
| `npm test` | Node tests for art, computation and Developer Experience & Tooling scripts |
| `npm run test:watch` | Repeat those tests when source changes; stop with Ctrl+C |
| `npm run build` | Type check and production bundle |
| `npm run preview` | Serve an already built bundle locally |
| `npm run check` | Type check, logic tests and production bundle |
| `npm ls --depth=0` | Inspect direct installed dependencies for a quality investigation |

## Internal repository and theme

See the [migration guide](../docs/internal-migration.md) for GitHub Enterprise Cloud repository access and team contributions. Participants develop locally. Temporary deployment settings are documented separately in `docs/hosting.md`.

`../packages/demo-kit/theme.css` owns the shell palette. Demo visuals stay independent; Sapphire is not required. Participant MDX lives in `src/content/` and compiles with the app. Keep it canonical; do not duplicate track guides elsewhere.

## Maintainer reference

[Verification evidence](VERIFICATION.md) · [Hosting and removal](../docs/hosting.md) · [Internal repository migration](../docs/internal-migration.md)

Each demo has its own dev/build/preview commands: `npm run dev --workspace @lab/demo-art`, for example. The gallery includes their HTML entries and Open standalone demo links. See **Create a demo** in the app for the canonical standalone guide.
