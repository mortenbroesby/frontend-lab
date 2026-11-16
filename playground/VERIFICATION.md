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
- Live development edit: changing `YourLab.tsx` updated the running page, then the source was restored.
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
- Fallow is not installed or validated; the candidate tool identity and suitability should be verified if participants choose it.
- Accessibility has basic keyboard, labels, reduced-motion and responsive checks, not a full assistive-technology audit.
- No Confluence board, invitations, Teams post or hosted deployment was created by this work. Verify participant repository/board access separately.

## Recheck after changes

From `playground`: run `npm ci`, then `npm run check`. For UI or browser behaviour changes, run `npm run test:browser` with the optional browser setup documented in its README. Keep results tied to the commit being checked; do not claim a new result from an old run.
