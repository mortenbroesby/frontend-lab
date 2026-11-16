> Historical record only. Browser tests and their tooling have since been removed; these are not current verification requirements. See [current guidance](VERIFICATION.md).

# Historical verification record

Historical evidence, not setup instructions. Some commands, paths and integrations were later removed. Use [current status](VERIFICATION.md), [Start Here](../../README.md#start-here) and the [Fallow guide](../src/content/tracks/code-quality/fallow.mdx) for current guidance.

## Environment

- macOS on the organiser's Intel Mac.
- Node.js 24.19.0; npm 11.6.2.
- Google Chrome 157.0.8103.52, automated through Playwright 1.65.1.
- Exact versions in `package.json` and `package-lock.json`; reproducible install: `npm ci`.

## Completed checks

- Fresh staged-file export to a temporary directory without dependencies or build output: `npm ci` and `npm run check` both passed.
- `npm run check`: TypeScript, four Node logic tests and a production build.
- Six browser journeys against the production bundle: SVG remix/export and independent idea input; real Worker/main-thread results; interaction/cancellation while a Worker is pending; two-tab messaging and safe text rendering; narrow-screen/reduced-motion/keyboard entry; unsupported-capability fallback.
- The cancellation test delays Worker messages for a deterministic pending state. A separate real-Worker test verifies the bundle and calculation.
- Live development edit: changing `src/starters/ProjectStarter.tsx` updated the running page, then the source was restored.
- Desktop (1440 px) and mobile (390 px) screenshots inspected; narrow-screen test also checks horizontal overflow.
- Official SVG, Worker, BroadcastChannel, Web APIs and optional Knip reference pages checked for availability.

## Repository cleanup check

After moving the app to `gallery/` and consolidating participant guides under `tracks/`, local documentation links and old-path references were checked. `npm run check` and all six browser journeys passed from the new location. The package manifest, lockfile and example behaviour were unchanged.

## D3 constellation check

After adding `d3-force`, `npm run check` and all eight Chrome browser journeys passed. New checks cover cluster filtering, switching layouts, pointer dragging, keyboard pinning, releasing pins, hide/show lifecycle, reduced-motion startup and narrow-screen overflow. The rendered desktop graph was visually reviewed. The graph uses illustrative data, not real participant or repository relationships.

## Limits and participant checks still needed

- Independent participant setup remains unobserved; Windows, Linux, Safari, Firefox and organisation-specific proxy/device policies remain untested.
- Same-origin tab communication is not cross-device networking. No WebSocket server, WebRTC signalling or WebAssembly toolchain is provided.
- Main-thread comparison deliberately blocks this page briefly. Timing varies by device and excludes Worker startup/messaging; this is an exploration example, not a benchmark claim.
- Fallow is verified locally on Intel macOS; its native binaries on participant operating systems and corporate networks still need validation. See the Fallow check below.
- Accessibility has basic keyboard, labels, reduced-motion and responsive checks, not a full assistive-technology audit.
- No Confluence board, invitations, Teams post or hosted deployment was created by this work. Verify participant repository/board access separately.

## Recheck after changes

From the repository root: run `npm ci`, then `npm run check`. Browser automation described here belonged to the earlier revision and has been removed. Tie results to the checked commit; never reuse old runs as new evidence.

## Shared lab SPA and contribution workflow — 16 November 2026

- One HTML entry, hash navigation for four tracks, a gallery and a separate copyable demo template. Reference demos are lazy-loaded and unmount on navigation.
- `npm run check` passed: TypeScript, 11 Node tests (including the maximum prime-count workload and Developer Experience & Tooling scripts), and the production build.
- All 10 Chrome browser journeys passed against the production build. Coverage includes existing SVG/D3/Worker/messaging behaviour, navigation without a document reload, direct-route refresh, unknown-route fallback, keyboard entry and a failed lazy import that leaves navigation usable.
- In an isolated temporary copy, a copied demo template and one registry entry appeared in the gallery and Developer Experience & Tooling, opened and accepted input without shell edits. Removed temporary files and server afterward. This reused dependencies; it was not a fresh participant install.
- Reviewed desktop/mobile screenshots and checked home, all four tracks and create view for overflow at 390 px.
- Track guides now separate minimal bootstraps from worked examples. Git branches/PRs and pulling merged contributions are documented; no backend, deployment or new dependency was added.

Clean-install evidence is historical. Participant setup/access and other operating systems/browsers remain unverified.

## Turborepo and demo generator — 16 November 2026

- Added npm workspaces with `gallery/` as the first app workspace, one root lockfile, pinned Turbo/@turbo/gen 2.11.11, root task scripts and the `demo` generator. No per-demo packages or remote cache.
- `npm run check` passed through Turbo: four generator tests, 11 app/script tests, TypeScript and production build. All ten existing Chrome browser journeys also passed through the root Turbo command.
- A temporary copy without node_modules/build/cache output passed root `npm ci` and checks. `npm run demo:new -- --args ...` generated a demo whose production build loaded in Chrome, appeared in the gallery and Experimental Projects, and accepted input. The separate five-prompt interactive flow also passed.
- The npm script uses `turbo gen demo`. On the installed version the `turbo gen run demo` spelling opened an extra picker; the tested shorthand selects the generator directly. Its action uses Turbo’s injected root path, avoiding compiled-generator module URLs.
- Tests reject invalid path-like IDs, reserved names, invalid tracks, empty metadata, duplicate registered IDs and existing folders. Text containing quotes/newlines/replacement tokens is safely encoded in the registry. A missing marker fails before creating files.
- The phone preview remains a local-network HTTP preview of the built app. No external deployment or prototypes.danske.net integration was added. React-only scope is recorded in the participant docs and AGENTS.md.

Independent participant setup and other operating systems remain unverified. Earlier layouts are historical; follow current root setup instructions.

## Required demo names and README presentation — 16 November 2026

- The first generator prompt is now the demo name, with no default. It suggests an editable folder ID afterward. Missing, whitespace-only and multiline names are rejected before writes, including through the generator action. The name becomes the gallery title, initial starter idea and generated README heading.
- `npm run check` passed: six generator tests, 11 app/script tests, TypeScript and production build. All ten Chrome browser journeys passed.
- In a temporary copy, the prompt rejected an empty name, accepted a name and suggested its ID. The positional CLI example also succeeded. Both demos built; Chrome confirmed names in headings and starter fields.
- The root README follows the owner's Astrograph and Everyday Assistants presentation: centered introduction, factual badges, section navigation, emoji headings, quick start, documentation links and author footer. GitHub's Markdown renderer accepted it; a styled browser preview was visually inspected, navigation anchors and local links were checked. The preview checks layout, not pixel-identical GitHub styling.

The existing platform and independent-participant limitations still apply.

## Fallow integration — 16 November 2026

- Fallow 3.43.1 installed from the root lockfile with `npm ci` on Intel macOS / Node 24.19.0 / npm 11.6.2. The CLI reports a verified signed binary.
- Built-in discovery identified the app workspace and 11 entry points, including Vite, the Turbo generator and tests. No custom configuration or blanket ignores were needed.
- Combined analysis and dead-code analysis exit 1 with the existing unused `marker` export; health exits 1 with the existing App complexity finding. These expected findings are not passing gates; participants can investigate them in [the guide](../src/content/tracks/code-quality/fallow.mdx).
- Duplication and architecture scans exit 0; duplication skips six files under its default ignores. Architecture boundaries and rule packs are not configured, so their absence is not evidence of policy compliance.
- Symbol tracing, the `d3-force` dependency trace, discovery, advisory health mode and JSON report output were exercised. The dependency trace points to `Constellation.tsx`. Local reports remain ignored.
- `npm run check` passed: six generator tests, eleven app/script tests, type checking and production build. All ten Chrome browser journeys passed.
- A separate 390 px browser smoke check followed Code Quality & Maintainability → Investigate with Fallow: command visible, no page errors or horizontal overflow. Inspected the full-page screenshot. The walkthrough explains analysis; it is not a browser-side analyzer.
- Windows, Linux, Apple Silicon and participant proxy policies have not been tested. No automatic fixes, hooks, cloud integration or CI gate were enabled.

## Official Fallow agent and Git integration — 16 November 2026

- Applied the official `fallow agent install --harness codex --harness claude` after its dry-run preview, plus `fallow hooks install --target git`. Committed skills, MCP registrations, agent hooks and the managed AGENTS.md task map. The Git pre-commit hook is local and must be installed per clone.
- A second agent install reported every managed surface unchanged. `fallow agent status` and `fallow hooks status` reported the intended surfaces installed; `fallow doctor` reported seven passes, no warnings/failures and two optional checks skipped.
- In a disposable repository, Git/Codex/Claude hooks allowed a staged documentation change. A staged unused source file made Git return 1 and both agent hooks return 2, identifying the finding. No failing commit ran; the fixture was removed.
- A direct stdio MCP handshake initialized Fallow 3.43.1 and returned 44 tools. This proves local server startup, not trust or loading in this Codex/Claude session.
- `npm run check` passed all 17 logic/generator tests, type checking and the production build. Browser code is unchanged from the preceding browser verification.
- No global agent configuration, personal approval files, cloud connection or hosted CI was added. Generated hooks retain official fail-open behavior for documented missing-tool/runtime-error cases. Trust and GUI PATH behavior still require verification in each participant's client.

## Internal migration preparation and lab theme — 16 November 2026

- Shared shell colors now live in `src/theme.css`; track/gallery colors follow track IDs. Desktop (1440 px) and mobile (390 px) production screenshots were visually reviewed. Sapphire was not added.
- `npm run check` passed 17 generator/logic tests, TypeScript and the build; all ten Chrome browser journeys passed with the updated theme and relative asset base.
- A separate production build received synthetic `VITE_SOURCE_URL` through root Turbo, served temporarily only at `/chapter-lab/`. Browser assertions verified the configured source link, direct demo URL and reload, lazy-loaded Worker demo, actual Worker computation (9,592 primes), and no page errors or horizontal mobile overflow. Closed the server and restored the normal local build.
- GitHub Pages publication is opt-in through `PAGES_ENABLED`; the workflow and migration/access guide are prepared. No enterprise repository, membership, Pages visibility or deployment has been configured. Hosted verification and destination policy compatibility are separate from these local checks.

## Scope update: local workshop, no hosting — 16 November 2026

- At the user's request, removed Pages publishing, deployment permissions, enablement variables and hosting instructions. Reverted the hosting-specific relative asset base. The GitHub workflow only verifies code; the migration guide covers repository/team access and local participation.
- The first Linux GitHub verification exposed a pre-existing platform-specific lockfile: TypeScript's Linux binary was absent. Regenerated the lockfile from the pinned manifests in an empty temporary directory. Versions stayed unchanged; the lockfile now records missing optional platform packages. A fresh local `npm ci` and `npm run check` passed.
- The earlier nested-hosting smoke test is historical evidence only; shared hosting is deferred and no site was published.

## Lean Codex and Copilot CLI integration — 16 November 2026

- Removed Claude configuration/skills and both generated 974-line agent gate scripts. Both supported clients now share AGENTS.md and one short `.agents/skills/fallow` pointer to the installed official skill. MCP configuration is limited to `.codex/config.toml` and `.github/mcp.json`.
- The official Git pre-commit hook remains the shared automatic commit gate. In a temporary repository it allowed a clean staged change and rejected a newly staged unused file. Pre-push checks are instructions, not an automatic hook. PR CI remains enabled.
- Fallow doctor reported ready; `npm run check` passed all 17 tests, type checking and build. The shared MCP binary initialized and returned 44 tools. Browser code was unchanged; browser tests were not repeated.
- Copilot CLI is not installed in this environment. Its configuration follows GitHub's documented project MCP, AGENTS.md and `.agents/skills` formats; discovery and tool use in an actual trusted Copilot session remain unverified. Codex also needs a fresh trusted session to load its project configuration.
