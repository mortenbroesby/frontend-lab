# The Front-End Lab playground

An optional local starting point for [choosing a track](../README.md). Examples are reference destinations, not steps you have to complete.

Participant setup and troubleshooting live in [the app](https://frontend-chapter-day.vercel.app/#/guide/setup); edit them in `src/content/setup.md`.

## Architecture and where to work

| File | Responsibility |
| --- | --- |
| `src/app/App.tsx` | Shared navigation, track pages and gallery |
| `src/app/tracks.ts` | Four track identities |
| `src/content/` | Canonical participant guides, rendered as Markdown inside the app |
| `src/app/Guide.tsx` | Lazy-loaded Markdown renderer with tables; raw HTML disabled |
| `src/demo-contract.ts` | Shared `DemoDefinition` type |
| `src/demos/<your-idea>/demo.config.ts` | Demo metadata and component loader, discovered by the host |
| `src/demos/template/` | Copyable bootstrap, separate from completed examples |
| `src/demos/<your-idea>/` | Your component, assets and scoped styles |
| `src/examples/` | Reference implementations and helpers; their discovery configs live in demo folders |
| `src/starters/BrowserStarter.tsx` | Optional one-circle browser starting point on Modern Web Capabilities |
| `src/app/DemoBoundary.tsx` | Render-error fallback around the active demo |
| `src/styles.css` | Shared shell, responsive layout and accessibility styles |
| `tests/` | Logic checks and browser journeys |

[Create and contribute a demo](src/demos/template/README.md). Run `npm run demo:new` from the repository root; Turborepo creates `Demo.tsx`, `demo.config.ts` and `README.md` in your demo folder. The host discovers `demo.config.ts` automatically and uses the folder name as the ID; no central registry or app-shell edit is needed. Use local component state, optional CSS modules and effect cleanup. The gallery orders demos alphabetically by folder ID. Metadata is discovered up front; components load only when opened and unmount when leaving. The render boundary protects navigation from React render failures; it cannot isolate blocking code or catch arbitrary async errors.

`demo.config.ts` default-exports an object satisfying `DemoDefinition` from `../../demo-contract`, with `title`, `track`, `description`, `author` and `load`. The loader imports a module whose default export is your React component. Use the generator and [technical demo guide](src/demos/template/README.md) for the exact file shape.

Hash routes such as `#/track/modern-web`, `#/demo/constellation` and `#/create` keep deep links in one app without server rewrite rules. Sharing is Git-backed: merge a contribution, then pull it locally. There is no live cross-computer sync.

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

See the [migration guide](../docs/internal-migration.md) for GitHub Enterprise Cloud repository access and team contributions. Participants develop locally; the temporary [Vercel gallery](https://frontend-chapter-day.vercel.app) is documented in [hosting and removal](../docs/hosting.md).

`src/theme.css` owns the shell palette. Demo visuals stay independent; Sapphire is not required. Participant Markdown lives in `src/content/` and renders inside the app. Keep it canonical; do not duplicate track guides elsewhere.

## Maintainer reference

[Verification evidence](VERIFICATION.md) · [Hosting and removal](../docs/hosting.md) · [Internal repository migration](../docs/internal-migration.md)
