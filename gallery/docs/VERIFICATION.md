# Verification for demos

Keep verification small and tied to the change. Use an existing focused logic test, TypeScript check or build when it answers a concrete question. `npm run check` combines formatting, React hooks, architecture, generator/logic tests, per-workspace TypeScript checks and app builds. `npm run analyze:changes` checks introduced findings before committing.

Browser tests, Playwright and browser CI have been removed. No browser installation is needed. Add browser tests later only for an explicitly requested purpose, such as a testing demo.

The standalone demo packages, gallery, generator and shared toolchain remain in place. Physical phones and the workshop network remain untested for Device Rally.

Earlier results in [verification history](VERIFICATION-HISTORY.md) describe previous revisions, not current coverage or required checks. Report only checks actually run for the current change.

## Workspace tooling verification

- Full `npm run check` passed, including a React-version consistency test and optional-requirements metadata validation.
- The actual Turbo generator created a temporary demo that passed its independent type check, build and formatting check; the temporary demo was removed. A deliberate type error failed its own demo without failing an unrelated demo. Hook-ordering and missing-effect-dependency probes were rejected by the linter.
- Cache probes: demo source invalidates that demo and the combined gallery; kit source invalidates consumers; a demo manifest also invalidates the dependency map. An unchanged repeat build hit cache. Generated output is excluded; Vite env files are explicit build inputs.
- Fallow doctor passed. The audit has no introduced findings; existing complexity warnings remain, including line-count increases from formatting. No suppression or baseline was added.
- Gallery runtime-requirement labels were inspected in the browser. The shared agent skill is installed as repository instructions; fresh Codex/Copilot invocation has not been exercised.
