# Verification for demos

Verify proportionally: use a focused existing test, type check or build to answer a concrete question. `npm run check` combines formatting, React hooks, architecture, generator/logic tests, per-workspace TypeScript checks and app builds. `npm run analyze:changes` checks introduced findings before committing.

Browser tests, Playwright and browser CI are removed; no browser installation is needed. Reintroduce browser tests only when explicitly requested, such as for a testing demo.

The standalone demo packages, gallery, generator and shared toolchain remain in place. Device Rally has partial physical-device evidence; see the session below. Workshop-network acceptance remains unverified.

[Verification history](VERIFICATION-HISTORY.md) records earlier revisions, not current coverage or requirements. Report only checks run for this change.

## Workspace tooling verification

- Full `npm run check` passed, including a React-version consistency test and optional-requirements metadata validation.
- A temporary Turbo-generated demo passed independent type, build and formatting checks, then was removed. A deliberate type error failed its own demo without failing an unrelated demo. Hook-ordering and missing-effect-dependency probes were rejected by the linter.
- Cache probes: demo source invalidates that demo and the combined gallery; kit source invalidates consumers; a demo manifest also invalidates the dependency map. An unchanged repeat build hit cache. Generated output is excluded; Vite env files are explicit build inputs.
- Fallow doctor passed. The audit has no introduced findings. A bounded route and dependency-map cleanup cleared the four recorded health findings; full checks and browser navigation/keyboard selection passed. Large-function and CSS advisories remain. The reviewed snapshot now lives in `.baselines/`; its comparison passes and rejects a temporary unused-file probe. No suppressions were added.
- Gallery runtime-requirement labels were inspected in the browser. The shared skill is installed as repository instructions; fresh Codex/Copilot invocation remains untested.

## Windows

[Windows compatibility](windows.md) records the scope, safeguards and remaining manual checks. CI runs native Windows and Linux in a checkout path containing spaces. `npm run test:servers` checks gallery and standalone HTTP startup after building; it does not run a browser.

## Device Rally physical-device session — 2026-11-16

On the public HTTPS deployment, the participant opened room `lab-check-1611` on a phone. The laptop browser observed three received cheers, ending with a heart. It subsequently showed zero connected peers. This confirms delivery to the laptop during that session, not bidirectional or reconnect acceptance. Phone/browser details, network type, return delivery and deliberate rejoin verification are still pending participant confirmation.

## Worker responsiveness — 2026-11-16

The built gallery was checked in the laptop browser over the LAN preview. At the same limit of 2,000,000, both modes returned 148,933 primes. One Worker run measured 631.2 ms calculation / 21.1 ms longest animation-callback gap; one main-thread run measured 406.5 ms calculation / 409.3 ms gap. These are individual observations, not portable benchmarks. The metric includes normal frame spacing and is not input latency.

Cancellation returned the UI to “Cancelled. Ready to restart.” The bounded observer test verifies the post-computation frame is included, hidden-tab samples are rejected, and disposed observers do not publish results. No browser-test infrastructure was added.

## Guide navigation — 2026-11-16

At a 390 × 844 browser viewport, the mobile menu exposed Guides and navigated to the complete guide list, closing the menu. The desktop dependency guide → demo → guide path was also followed successfully. This is responsive-browser verification, not physical-phone evidence.
