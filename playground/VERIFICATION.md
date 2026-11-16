# Current verification status

## Reconciliation with onboarding changes

Merged `origin/main` at `cc5f54d` into `feat/in-app-track-guides`. Preserved the track-specific generator, its end-to-end test, reference-page instructions and CI browser checks. MDX now describes the generated circle directly, without manual copying; deployment links remain absent.

- `npm run check` passed: 22 unit/generator tests, TypeScript and build.
- Sixteen browser cases passed in the full run; the remaining mobile reference-page case passed on a targeted rerun after correcting its selector for the D3 layout (17 total).
- Fallow changed-code audit against `origin/main` passed with advisory warnings. No unresolved Git conflict entries or conflict markers remain.


## MDX participant experience

Branch `feat/in-app-track-guides` replaces the earlier Markdown viewer with build-time MDX pages. The Modern Web starter, Experimental Projects starter and Create a demo preview are embedded beside their instructions. Completed examples remain separate. Repository-wide tracked-file scanning found no deployment URLs; the README introduces local startup without raw guide links.

- `npm ci` and `npm run check` passed: 20 generator/unit tests, TypeScript and the production build.
- All 15 Chrome journeys passed, including the interactive MDX starter, all guide links, phone-width layout and recovery from a failed MDX chunk.
- Fallow doctor and the changed-code audit passed; advisory complexity and styling warnings remain.
- MDX compiles as trusted repository code. The runtime Markdown parser is removed; individual guide chunks range from about 0.6 to 4.4 kB gzip.
- Production deployment and independent participant acceptance remain unverified.

## Earlier in-app participant guides

Branch `feat/in-app-track-guides`, based on `506a9a9`:

- Participant guides moved to `src/content/`; track starts, exploration tables, worked examples, setup, demo creation, contributions and findings render in the app.
- `npm ci` and `npm run check` passed on Node 24.19.0 / npm 11.6.2: 20 generator/unit tests, TypeScript and production build.
- All 13 Chrome browser journeys passed, including all track guides, internal guide links, back/reload navigation and phone-width table scrolling.
- Fallow doctor passed all seven applicable checks. Changed-code audit against `origin/main` passed; advisory complexity and styling findings remain. App cyclomatic complexity decreased from 21 to 16.
- Markdown and GFM tables load in a separate guide chunk (approximately 66 kB gzip including content). Raw HTML is disabled. No new documentation server or source-link environment setting is needed.
- Production deployment and independent participant acceptance are not claimed for this branch.

## Participant documentation revision · 16 November 2026

Checked in `docs/participant-journeys`, based on `4ad159a`, with only Markdown changes:

- Fresh root `npm ci` passed on Intel macOS with Node 24.13.0 and npm 11.6.2.
- `npm run check` passed: six generator tests, eleven app/script tests, TypeScript and production build (no Turbo cache hit).
- Local Markdown paths and heading anchors resolved; documented npm scripts were checked against the root and app manifests.
- Fallow doctor passed seven checks with no warnings; `npm run analyze:changes` passed with no introduced issues.
- Browser tests were not rerun: this revision changes no app code, UI behaviour, dependencies or configuration. Independent participant setup remains unobserved.

## Folder discovery and named tracks · PR #2

Implementation: `feat/typed-demo-discovery`, verified at `c49dd1d` on 16 November 2026. The subsequent merge from `main` reconciles documentation only; the checks below distinguish implementation verification from that reconciliation.

- The generator writes only its own folder: `Demo.tsx`, `demo.config.ts` and `README.md`. The metadata filename avoids a macOS case-insensitive resolution collision with `Demo.tsx`.
- Typed metadata, folder-derived IDs, alphabetical folder ordering and lazy component loading are implemented. Reference implementations remain in `src/examples/`, with discovered configs in demo folders. No participant edit to a central registry is needed.
- Full track titles appear in the app and guides. IDs and documentation folders are `modern-web`, `code-quality`, `developer-experience` and `experimental-projects`.
- Twenty unit/generator tests, TypeScript and the production build passed. Eleven Chrome journeys passed, including navigation through all four named tracks. A separate temporary generated-demo browser smoke check passed during discovery implementation.
- Local Markdown targets resolved, and the Fallow changed-code gate passed with no introduced findings. Existing complexity and styling findings remain.
- The documentation reconciliation reran `npm run check`; browser tests were not repeated for the documentation-only conflict resolution. Independent participant acceptance remains unobserved.

## Recorded baseline: `4ad159a` · 16 November 2026

The latest recorded checks before the participant-guide revision are below. These are local technical evidence, not independent participant acceptance. Detailed results and retired setups are kept in [verification history](VERIFICATION-HISTORY.md).

- Intel macOS, Node 24.19.0 and npm 11.6.2: root `npm ci` and `npm run check` passed after the portable lockfile update. The later lean-agent revision passed all 17 generator/logic tests, type checking and the build.
- The last UI verification passed ten Chrome browser journeys. Browser code was unchanged in the subsequent local-only hosting and agent-configuration revisions, so those revisions did not rerun the browser suite.
- Fallow doctor reported ready. Its changed-code Git hook allowed a clean fixture and rejected a newly unused file. Existing analyzer findings are investigation material, not passing full-analysis gates; see the [Fallow guide](../tracks/code-quality/fallow.md).
- Supported agents are Codex and Copilot CLI. The local MCP binary initialized with 44 tools; fresh trusted-client discovery remains unverified. Copilot CLI was not installed in the recorded environment.

## Remaining checks

- Independent participant clone, repository access and setup have not been observed.
- Windows, Linux, Apple Silicon, Safari, Firefox and organisation-specific network/device policies need validation. The portable lockfile is not evidence of successful installation on every platform.
- BroadcastChannel connects same-origin tabs in one browser context; it has not demonstrated communication between separate devices. No cross-device relay or signalling service is included in this baseline.
- Accessibility checks cover basic keyboard, labels, reduced motion and responsive layout, not a full assistive-technology audit.
- Worker timings vary by device and exclude startup/messaging. No performance improvement or participant time savings is established by these checks.
- Shared hosting and internal repository migration remain unverified and outside this documentation change.

## Recheck after changes

From the repository root, run `npm ci` and `npm run check`. UI/browser changes also require `npm run test:browser` using the [browser setup](README.md#browser-checks). Run `npm run analyze:changes` before committing or pushing. Tie new results to the checked revision and changed files; do not present historical runs as new evidence.
