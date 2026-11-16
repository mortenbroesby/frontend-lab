# Verification for demos

Verify proportionally: use a focused existing test, type check or build to answer a concrete question. `npm run check` combines formatting, React hooks, architecture, generator/logic tests, per-workspace TypeScript checks and app builds. `npm run analyze:changes` checks introduced findings before committing.

Browser tests, Playwright and browser CI are removed; no browser installation is needed. Reintroduce browser tests only when explicitly requested, such as for a testing demo.

The standalone demo packages, gallery, generator and shared toolchain remain in place. Physical phones and the workshop network remain untested for Device Rally.

[Verification history](VERIFICATION-HISTORY.md) records earlier revisions, not current coverage or requirements. Report only checks run for this change.

## Workspace tooling verification

- Full `npm run check` passed, including a React-version consistency test and optional-requirements metadata validation.
- A temporary Turbo-generated demo passed independent type, build and formatting checks, then was removed. A deliberate type error failed its own demo without failing an unrelated demo. Hook-ordering and missing-effect-dependency probes were rejected by the linter.
- Cache probes: demo source invalidates that demo and the combined gallery; kit source invalidates consumers; a demo manifest also invalidates the dependency map. An unchanged repeat build hit cache. Generated output is excluded; Vite env files are explicit build inputs.
- Fallow doctor passed. The audit has no introduced findings; existing complexity warnings remain, including line-count increases from formatting. No suppression or baseline was added.
- Gallery runtime-requirement labels were inspected in the browser. The shared skill is installed as repository instructions; fresh Codex/Copilot invocation remains untested.
