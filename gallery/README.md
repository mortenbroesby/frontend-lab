# The Front-End Lab gallery

An optional local starting point for [choosing a track](../README.md). Examples are reference destinations, not steps you have to complete.

Run `npm ci` and `npm run dev` from the repository root, then open the printed address. **Local setup** in the app contains participant setup and troubleshooting.

## Architecture and where to work

| File | Responsibility |
| --- | --- |
| `src/app/App.tsx` | Shared navigation, track pages and gallery |
| `src/app/tracks.ts` | Four track identities |
| `src/content/` | MDX participant pages with embedded React starters |
| `src/app/Guide.tsx` | Lazy MDX page loading and shared heading/table styles |
| `src/demo-contract.ts` | Folder discovery and metadata validation |
| `../demos/<your-idea>/demo.config.ts` | Typed gallery metadata, discovered by the host |
| `src/starters/` | Copyable bootstrap, separate from completed examples |
| `../demos/<your-idea>/` | Your component, assets and scoped styles |
| `../demos/<id>/index.html` | Independently runnable app entry, also included in the gallery build |
| `src/starters/BrowserStarter.tsx` | Optional one-circle browser starting point on Modern Web Capabilities |
| `../shared/` | Framework-independent utilities shared through `@lab/shared` exports |
| `demo-kit/DemoBoundary.tsx` | Render-error fallback around the active demo |
| `demo-kit/styles.css` | Shared shell, responsive layout and accessibility styles |
| `tests/` | Gallery metadata-discovery checks; demo tests live beside demo logic |

Open **Create a demo** in the app for the generator and independent-app commands. Each demo owns its entry, state, styles and cleanup. The gallery reads metadata and links to the app; it does not import demo components.

The repository-root `index.html` opens the gallery. Its Vite config uses the repository as root so `demos/<id>/index.html` works in development and production without copying files or custom routing. The combined output stays in `gallery/dist/`; individual workspace builds stay in `demos/<id>/dist/`.

Hash routes such as `#/track/modern-web`, `#/demo/constellation` and `#/create` keep deep links in one app without server rewrite rules. Sharing is Git-backed: merge a contribution, then pull it locally. Source changes are shared through Git; Device Rally separately demonstrates live peer messaging.

## Author a track page

Edit the track's `src/content/tracks/<track-id>/*.mdx` page. Write prose and code blocks normally, import an existing React starter, and place it beside the instruction that uses it. The Modern Web getting-started page demonstrates this pattern.

Keep completed examples in their demo routes. Link between app pages with `#/track/...`, `#/demo/...` or `#/guide/...`; do not link to a deployment domain or raw guide file. Each MDX page is compiled at build time and loaded on demand. Imports and JSX are trusted application code, so do not load remote or user-authored MDX at runtime.

## Useful commands

Run `npm ci`, `npm run demo:new`, `npm run dev` and `npm run check` from the repository root. Turbo coordinates the workspace tasks. The following app-specific commands also work from `gallery` after the root install:

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development with fast refresh |
| `npm run typecheck` | TypeScript check without producing files |
| `npm test` | Gallery metadata-discovery tests |
| `npm run test:watch` | Repeat those tests when source changes; stop with Ctrl+C |
| `npm run build` | Type check and production bundle |
| `npm run preview` | Serve an already built bundle locally |
| `npm run check` | Type check and production bundle |
| `npm ls --depth=0` | Inspect direct installed dependencies for a quality investigation |

From the repository root, `npm run check:architecture` enforces import boundaries with dependency-cruiser. It also runs first in `npm run check` and CI. See [shared utilities](../shared/README.md) before extracting common helpers.

From the repository root, `npm test` includes generator, script and demo-workspace tests; `npm run check` also type-checks and builds the gallery. Use `npm test --workspace @lab/demo-workers` for a focused demo check.

## Internal repository and theme

See the [migration guide](docs/internal-migration.md) for GitHub Enterprise Cloud repository access and team contributions. Participants develop locally. Temporary deployment settings are documented separately in `gallery/docs/hosting.md`.

`demo-kit/theme.css` owns the shell palette. Demo visuals stay independent; Sapphire is not required. Participant MDX lives in `src/content/` and compiles with the app. Keep it canonical; do not duplicate track guides elsewhere.

## Maintainer reference

[Design decisions and reasoning](docs/decisions/README.md) · [Verification evidence](docs/VERIFICATION.md) · [Hosting and removal](docs/hosting.md) · [Internal repository migration](docs/internal-migration.md)

Each demo has its own dev/build/preview commands: `npm run dev --workspace @lab/demo-art`, for example. The gallery includes their HTML entries and Open standalone demo links. See **Create a demo** in the app for the canonical standalone guide.
