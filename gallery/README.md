# The Front-End Lab gallery

The app helps participants explore ideas, try standalone demos and follow practical guides. Use the [root README](../README.md) for setup; participant instructions live in the app.

## Where to work

| Location | Responsibility |
| --- | --- |
| `src/app/App.tsx` | Page routing, focus management and shell composition |
| `src/app/LabNavigation.tsx` | Desktop navigation, mobile menu and command palette integration |
| `src/app/Home.tsx`, `TrackPage.tsx` | Homepage and track-page composition |
| `src/app/DemoGallery.tsx`, `GuideGallery.tsx` | Demo search and guide listings |
| `src/app/gallery.css` | Gallery layout, navigation and content styling |
| `src/app/tracks.ts` | Four track identities and guide listings |
| `src/app/Guide.tsx`, `GuideView.tsx` | Lazy MDX loading, shared components and loading/error states |
| `src/content/` | Participant MDX pages |
| `mdx-demo-links.ts` | Build-time validation of MDX demo references |
| `src/demo-contract.ts` | Metadata discovery and validation |
| `../demos/<id>/` | Independent demo source, metadata, assets and tests |
| `../turbo/generators/templates/` | New-demo templates |
| `demo-kit/` | Shared demo mount, error boundary, command palette and shell styles |
| `../shared/ui/` | Reusable controls and theme tokens |

The gallery reads demo metadata and links to HTML entries; it never imports demo components. Each demo owns its UI, state, styles and cleanup. Follow the [architecture decision](docs/decisions/elegant-frontend-architecture.md).

## Author a track page

Edit `src/content/tracks/<track-id>/*.mdx`. Content compiles at build time and loads on demand. MDX is trusted repository code; never load remote or user-authored MDX at runtime.

- **Headings:** the app owns the page's `h1`. Markdown heading levels render unchanged: start sections at `##`, then use `###` for subsections.
- **Ideas:** `TrackPage` selects the `ideas` layout explicitly. Use `IdeaGrid` with `Idea` children, each with a `title`, short `summary`, and full explanation/resources inside. `Inspiration` holds reference examples; `IdeaNote` holds an optional closing sentence.
- **Guides:** each track has Ideas, Demos and Guides tabs. Add a guide listing in `src/app/tracks.ts` and a matching `<slug>.mdx` in that track’s content folder. The listing supplies both navigation and valid routes. Keep runnable experiments in Demos and explanations in Guides.
- **Instructions:** the default `document` layout provides a narrow reading column. `GuideView` supplies loading and error states for both layouts.
- **Internal links:** use hash routes such as `#/track/modern-web` and `#/guide/setup`.
- **Demo links:** use `<DemoLink id="cross-tab-messaging">Open cross-tab messaging</DemoLink>`. The ID must be a literal matching a demo folder. The MDX compiler rejects invalid references; the link resolves through discovered metadata to the standalone entry.

Keep full explanations and external references in the MDX. Do not link to temporary deployment domains or raw guide files.

## Build and verification

Run root commands from the [README](../README.md); Turbo coordinates workspaces. For gallery-only work, use `npm run typecheck`, `npm test`, `npm run build` or `npm run dev` from this directory. `npm run preview` serves the built gallery. See **Create a demo** in the app for standalone commands.

Vite uses the repository root: root `index.html` opens the gallery and `demos/<id>/index.html` opens a demo. Combined output goes to `gallery/dist/`; independent demo builds go to `demos/<id>/dist/`. Hash routes need no server rewrites.

`npm run check` at the root checks formatting, hooks, architecture, tests, types and builds. Run `npm run analyze:changes` before committing. Gallery tests cover metadata discovery and MDX link validation; demo tests belong beside their logic. No browser-testing framework is installed.

Every demo owns `typecheck`, `build` and `check`. Turbo builds run type checks first; a direct workspace build only bundles. Tests are optional. Root dependencies and `tsconfig.base.json` provide shared tooling, and the generator takes React's version from the demo kit.

Turbo normally hashes package-local inputs. The gallery also hashes demo sources and root HTML; the dependency map hashes the manifests it displays. Use `turbo run build --dry=json` to inspect inputs and dependencies when changing these rules. Generated output is excluded.

## Command palette

Open with **⌘K / Ctrl+K**, or **Menu → command palette** on mobile. Search navigation, demos and guides; use arrows to move, Enter to select and Escape to close. Appearance controls choose light, dark or system mode.

**Ctrl+Enter** opens a local debug snapshot; **Shift+Enter** opens all demos. Reload clears unsaved in-memory state. The kit owns palette behavior in `demo-kit/CommandMenu.tsx`; the gallery supplies links from its metadata. Standalone demos use the same palette and link back when configured.

## Maintainer references

[Design decisions](docs/decisions/README.md) · [Shared UI](../shared/ui/README.md) · [Verification](docs/VERIFICATION.md) · [Hosting](docs/hosting.md) · [Internal repository migration](docs/internal-migration.md)
