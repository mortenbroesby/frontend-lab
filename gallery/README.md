# The Front-End Lab gallery

A local starting point for [choosing a track](../README.md). Examples are optional references.

Follow the root README for first-time setup. In the app, use **Local setup**.

## Where to work

| File | Responsibility |
| --- | --- |
| `src/app/App.tsx` | Shared navigation, track pages and gallery |
| `src/app/tracks.ts` | Four track identities |
| `src/content/` | MDX participant pages |
| `src/app/Guide.tsx` | Lazy MDX page loading and shared heading/table styles |
| `src/demo-contract.ts` | Folder discovery and metadata validation |
| `../demos/<your-idea>/demo.config.ts` | Discovered gallery metadata |
| `../turbo/generators/templates/` | Templates copied into new demos |
| `../demos/<your-idea>/` | Your component, assets and scoped styles |
| `../demos/<id>/index.html` | Standalone entry, included in the gallery build |
| `demo-kit/DemoBoundary.tsx` | Render-error fallback around the active demo |
| `demo-kit/styles.css` | Shared shell, responsive layout and accessibility styles |
| `tests/` | Gallery metadata-discovery checks; demo tests live beside demo logic |

Open **Create a demo** in the app for the generator and independent-app commands. Each demo owns its entry, state, styles and cleanup. The gallery reads metadata and links to the app; it does not import demo components.

Root `index.html` opens the gallery. Vite uses the repository root so demo HTML entries work in development and production without copying or custom routing. Combined output goes to `gallery/dist/`; standalone builds to `demos/<id>/dist/`.

Hash routes (`#/track/modern-web`, `#/demo/constellation`, `#/create`) support deep links without server rewrites. Device Rally demonstrates live peer messaging.

## Author a track page

Edit `src/content/tracks/<track-id>/*.mdx`. Tracks have Ideas and Demos tabs; shared setup and demo creation are in the main navigation.

Keep completed examples in their demo routes. Link between app pages with `#/track/...`, `#/demo/...` or `#/guide/...`; do not link to a deployment domain or raw guide file. MDX compiles at build time and loads on demand. Its imports and JSX are trusted code; never load remote or user-authored MDX at runtime.

## Useful commands

Run `npm ci`, `npm run demo:new`, `npm run dev` and `npm run check` at the root; Turbo coordinates workspaces. After installation, these commands also work from `gallery`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development with fast refresh |
| `npm run typecheck` | Type-check without emitting files |
| `npm test` | Gallery metadata-discovery tests |
| `npm run test:watch` | Watch tests; Ctrl+C to stop |
| `npm run build` | Production bundle |
| `npm run preview` | Serve an already built bundle locally |
| `npm run check` | Type check and production bundle |
| `npm ls --depth=0` | List installed direct dependencies |

From the repository root, `npm test` includes generator and workspace tests; `npm run check` also formats-checks, checks hooks, type-checks each workspace and builds all apps. Use `npm test --workspace @lab/demo-workers` for a focused demo check.

## Internal repository and theme

See the [migration guide](docs/internal-migration.md) for GitHub Enterprise Cloud repository access and team contributions. Participants develop locally. Temporary deployment settings live in [hosting](docs/hosting.md).

`../shared/ui/theme.css` owns the monochrome shell palette; `demo-kit/styles.css` owns shared layout and controls. See the [visual-style decision](docs/decisions/visual-style.md) for the Vercel-inspired direction and [shared UI decision](docs/decisions/shared-ui.md) for Tailwind usage. Demo visuals stay independent; Sapphire is not required. Keep participant guides canonical in `src/content/`.

## Maintainer reference

[Design decisions and reasoning](docs/decisions/README.md) · [Verification evidence](docs/VERIFICATION.md) · [Hosting and removal](docs/hosting.md) · [Internal repository migration](docs/internal-migration.md)

Each demo has its own dev/build/preview commands: `npm run dev --workspace @lab/demo-art`, for example. The gallery includes their HTML entries and Open standalone demo links. See **Create a demo** in the app for the canonical standalone guide.

## Independent checks and caching

Every demo has `typecheck`, `build` and `check`; `check` runs both. Direct `build` only bundles; Turbo builds type-check first, after checking kit dependencies. Tests are optional and colocated.

Toolchain dependencies live at the root. `tsconfig.base.json` holds shared compiler options; each workspace includes only its own files. The generator takes React's version from the demo kit; a workspace test catches drift across consumers.

Turbo uses package-local inputs by default. The gallery's build also hashes demo source and root HTML; the dependency map also hashes the manifests it displays. Generated output is excluded. Inspect `tasks[].inputs` and `tasks[].dependencies` in `turbo run build --dry=json` when changing these rules. Changes to the root toolchain or shared compiler config can still invalidate all tasks.

`npm run format` formats code and styles with Prettier. `npm run lint` runs only Oxlint's hooks-ordering and exhaustive-dependency checks. These complement TypeScript, Fallow and dependency-cruiser. MDX prose stays as authored. No browser-test framework is installed.

Optional `requirements` in `demo.config.ts` labels internet, secure-context or offline-after-setup needs before opening a demo. Labels do not check permissions.
