# Exploration kit verification

Implementation baseline: optional local kit for the four agreed tracks. This records technical evidence, not participant acceptance or a published workshop board.

## Environment

- macOS on the organiser's Intel Mac.
- Node.js 24.19.0; npm 11.6.2.
- Google Chrome 157.0.8103.52, automated through Playwright 1.65.1.
- Dependency versions are exact in `package.json` and `package-lock.json`; `npm ci` is the reproducible install command.

## Completed checks

- Fresh staged-file export into a new temporary directory, with no dependencies or build output: `npm ci` and `npm run check` both passed.
- `npm run check`: TypeScript, four Node logic tests and a production build.
- Six browser journeys against the production bundle: SVG remix/export and independent idea input; real Worker/main-thread results; interaction/cancellation while a Worker is pending; two-tab messaging and safe text rendering; narrow-screen/reduced-motion/keyboard entry; unsupported-capability fallback.
- The cancellation test delays Worker message delivery to make the pending state deterministic. The separate real-Worker test verifies the actual bundle and calculation path.
- Live development edit: changing `src/starters/ProjectStarter.tsx` updated the running page, then the source was restored.
- Desktop (1440 px) and mobile (390 px) screenshots visually inspected; the narrow-screen test also checks for horizontal overflow.
- Official SVG, Worker, BroadcastChannel, Web APIs and optional Knip reference pages checked for availability.

## Repository cleanup check

After moving the app to `playground/` and consolidating participant guides under `tracks/`, local documentation links and old-path references were checked. `npm run check` and all six browser journeys passed from the new location. The package manifest, lockfile and example behaviour were unchanged.

## D3 constellation check

After adding `d3-force`, `npm run check` passed and all eight browser journeys passed in Chrome. The new checks cover cluster filtering, switching layouts, pointer dragging, keyboard pinning, releasing pins, hide/show lifecycle, reduced-motion startup and narrow-screen overflow. The rendered desktop graph was visually reviewed. The graph uses illustrative data, not real participant or repository relationships.

## Limits and participant checks still needed

- Independent participant setup has not been observed. Windows, Linux, Safari, Firefox and organisation-specific proxy/device policies have not been tested.
- Same-origin tab communication is not cross-device networking. No WebSocket server, WebRTC signalling or WebAssembly toolchain is provided.
- Main-thread comparison deliberately blocks this page briefly. Timing varies by device and excludes Worker startup/messaging; this is an exploration example, not a benchmark claim.
- Fallow is verified locally on Intel macOS; its native binaries on participant operating systems and corporate networks still need validation. See the Fallow check below.
- Accessibility has basic keyboard, labels, reduced-motion and responsive checks, not a full assistive-technology audit.
- No Confluence board, invitations, Teams post or hosted deployment was created by this work. Verify participant repository/board access separately.

## Recheck after changes

From the repository root: run `npm ci`, then `npm run check`. For UI or browser behaviour changes, run `npm run test:browser` with the optional browser setup documented in its README. Keep results tied to the commit being checked; do not claim a new result from an old run.

## Shared lab SPA and contribution workflow — 16 November 2026

- One HTML entry, hash navigation for four tracks, a gallery and a separate copyable demo template. Reference demos are lazy-loaded and unmount on navigation.
- `npm run check` passed: TypeScript, 11 Node tests (including the maximum prime-count workload and Track C scripts), and the production build.
- All 10 Chrome browser journeys passed against the production build. Coverage includes existing SVG/D3/Worker/messaging behaviour, navigation without a document reload, direct-route refresh, unknown-route fallback, keyboard entry and a failed lazy import that leaves navigation usable.
- In an isolated temporary copy, copied the demo template and added one registry entry. The new contribution appeared in the shared gallery and Track C, opened and accepted input, without editing the shell. Temporary files and server were removed afterward. This reused installed dependencies; it was not a new participant install.
- Desktop and mobile screenshots were reviewed. Home, all four track pages and the create view were checked for horizontal overflow at 390 px.
- Track guides now separate minimal bootstraps from worked examples. Git branches/PRs and pulling merged contributions are documented; no backend, deployment or new dependency was added.

The earlier clean-install evidence remains historical. Independent participant setup, access and other operating systems/browsers remain unverified.

## Turborepo and demo generator — 16 November 2026

- Added npm workspaces with `playground/` as the first app workspace, one root lockfile, pinned Turbo/@turbo/gen 2.11.11, root task scripts and the `demo` generator. No per-demo packages or remote cache.
- `npm run check` passed through Turbo: four generator tests, 11 app/script tests, TypeScript and production build. All ten existing Chrome browser journeys also passed through the root Turbo command.
- A temporary copy without node_modules/build/cache output passed root `npm ci` and checks. The actual `npm run demo:new -- --args ...` command generated a demo; its production build loaded in Chrome, appeared in the gallery and Track D, and responded to input. The interactive five-prompt flow was separately completed successfully.
- The npm script uses `turbo gen demo`. On the installed version the `turbo gen run demo` spelling opened an extra picker; the tested shorthand selects the generator directly. Its action uses Turbo's injected root path, so it does not rely on module URLs after generator compilation.
- Tests reject invalid path-like IDs, reserved names, invalid tracks, empty metadata, duplicate registered IDs and existing folders. Text containing quotes/newlines/replacement tokens is safely encoded in the registry. A missing marker fails before creating files.
- The phone preview remains a local-network HTTP preview of the built app. No external deployment or prototypes.danske.net integration was added. React-only scope is recorded in the participant docs and AGENTS.md.

Independent participant setup and other operating systems remain unverified. Earlier verification sections describe their historical layouts; use the current root setup instructions.

## Required demo names and README presentation — 16 November 2026

- The first generator prompt is now the demo name, with no default. It suggests an editable folder ID afterward. Missing, whitespace-only and multiline names are rejected before writes, including through the generator action. The name becomes the gallery title, initial starter idea and generated README heading.
- `npm run check` passed: six generator tests, 11 app/script tests, TypeScript and production build. All ten Chrome browser journeys passed.
- In a temporary copy, the interactive prompt rejected an empty name, then accepted a name and suggested its ID. The updated positional CLI example also generated successfully. Both generated demos built, and their names were checked in the rendered headings and starter fields in Chrome.
- The root README follows the owner's Astrograph and Everyday Assistants presentation: centered introduction, factual badges, section navigation, emoji headings, quick start, documentation links and author footer. GitHub's Markdown renderer accepted it; a styled browser preview was visually inspected, navigation anchors and local links were checked. The preview is a layout check, not a claim of pixel-identical GitHub styling.

The existing platform and independent-participant limitations still apply.

## Fallow integration — 16 November 2026

- Fallow 3.43.1 installed from the root lockfile with `npm ci` on Intel macOS / Node 24.19.0 / npm 11.6.2. The CLI reports a verified signed binary.
- Built-in discovery identified the app workspace and 11 entry points, including Vite, the Turbo generator and tests. No custom configuration or blanket ignores were needed.
- Combined analysis and dead-code analysis exit 1 with the existing unused `marker` export; health exits 1 with the existing App complexity finding. These are expected findings, not passing gates. They remain available for the participant investigations in [the guide](../tracks/b/fallow.md).
- Duplication and architecture scans exit 0; duplication skips six files under its default ignores. Architecture boundaries and rule packs are not configured, so their absence is not evidence of policy compliance.
- Symbol tracing, the `d3-force` dependency trace, discovery, advisory health mode and JSON report output were exercised. The dependency trace points to `Constellation.tsx`. Local reports remain ignored.
- `npm run check` passed: six generator tests, eleven app/script tests, type checking and production build. All ten Chrome browser journeys passed.
- Separate browser smoke check followed Track B → Investigate with Fallow at 390 px width, checked the command was visible, and found no page errors or horizontal document overflow. The full-page screenshot was visually inspected. The walkthrough is explanatory content, not a live browser-side analyzer.
- Windows, Linux, Apple Silicon and participant proxy policies have not been tested. No automatic fixes, hooks, cloud integration or CI gate were enabled.

## Official Fallow agent and Git integration — 16 November 2026

- Applied the official `fallow agent install --harness codex --harness claude` after its dry-run preview, plus `fallow hooks install --target git`. Committed skills, MCP registrations, agent hooks and the managed AGENTS.md task map. The Git pre-commit hook is local and must be installed per clone.
- A second agent install reported every managed surface unchanged. `fallow agent status` and `fallow hooks status` reported the intended surfaces installed; `fallow doctor` reported seven passes, no warnings/failures and two optional checks skipped.
- In a disposable Git repository, the generated Git/Codex/Claude hooks all allowed a harmless staged documentation change. Adding a staged unused source file made Git return 1 and both agent hooks return 2 with the finding identified. No failing commit was executed; the fixture was removed.
- A direct stdio MCP handshake initialized Fallow 3.43.1 and returned 44 tools. This proves the server can start locally, not that this existing Codex/Claude session has trusted and loaded it.
- `npm run check` passed all 17 logic/generator tests, type checking and the production build. Browser code is unchanged from the preceding browser verification.
- No global agent configuration, personal approval files, cloud connection or hosted CI was added. Generated hooks retain official fail-open behavior for documented missing-tool/runtime-error cases. Trust and GUI PATH behavior still require verification in each participant's client.
