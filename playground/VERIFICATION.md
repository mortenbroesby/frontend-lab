# Current verification status

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
- Typed metadata, folder-derived IDs, alphabetical folder ordering and lazy component loading are implemented. Reference implementations and independent app entries live in `src/demos/<id>/`, alongside their discovered metadata. No participant edit to a central registry is needed.
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
