# Verification for demos

Verify proportionally: use a focused existing test, type check or build to answer a concrete question. `npm run check` combines formatting, React hooks, architecture, generator/logic tests, per-workspace TypeScript checks and app builds. `npm run analyze:changes` checks introduced findings before committing.

Browser tests, Playwright and browser CI are removed; no browser installation is needed. Reintroduce browser tests only when explicitly requested, such as for a testing demo.

The standalone demo packages, gallery, generator and shared toolchain remain in place. Device Rally has partial physical-device evidence; see the session below. Target-network acceptance remains unverified.

[Verification history](VERIFICATION-HISTORY.md) records earlier revisions, not current coverage or requirements. Report only checks run for this change.

## Workspace tooling verification

- Full `npm run check` passed, including a React-version consistency test and optional-requirements metadata validation.
- A temporary Turbo-generated demo passed independent type, build and formatting checks, then was removed. A deliberate type error failed its own demo without failing an unrelated demo. Hook-ordering and missing-effect-dependency probes were rejected by the linter.
- Cache probes: demo source invalidates that demo and the combined gallery; kit source invalidates consumers; a demo manifest also invalidates the dependency map. An unchanged repeat build hit cache. Generated output is excluded; Vite env files are explicit build inputs.
- Fallow doctor passed. The audit has no introduced findings. A bounded route and dependency-map cleanup cleared the four recorded health findings; full checks and browser navigation/keyboard selection passed. Large-function and CSS advisories remain. The reviewed snapshot now lives in `.baselines/`; its comparison passes and rejects a temporary unused-file probe. No suppressions were added.
- Gallery runtime-requirement labels were inspected in the browser. The shared skill is installed as repository instructions; fresh Codex/Copilot invocation remains untested.

## Windows

[Windows compatibility](windows.md) records the scope, safeguards and remaining manual checks. The previous Windows/Linux CI workflow has been removed; current revisions require local verification on the destination machines. `npm run test:servers` checks gallery and standalone HTTP startup after building; it does not run a browser.

## Device Rally physical-device session — 2026-11-16

On the public HTTPS deployment, the participant opened room `lab-check-1611` on a phone. The laptop browser observed three received cheers, ending with a heart. It subsequently showed zero connected peers. This confirms delivery to the laptop during that session, not bidirectional or reconnect acceptance. Phone/browser details, network type, return delivery and deliberate rejoin verification are still pending participant confirmation.

## Worker responsiveness — 2026-11-16

The built gallery was checked in the laptop browser over the LAN preview. At the same limit of 2,000,000, both modes returned 148,933 primes. One Worker run measured 631.2 ms calculation / 21.1 ms longest animation-callback gap; one main-thread run measured 406.5 ms calculation / 409.3 ms gap. These are individual observations, not portable benchmarks. The metric includes normal frame spacing and is not input latency.

Cancellation returned the UI to “Cancelled. Ready to restart.” The bounded observer test verifies the post-computation frame is included, hidden-tab samples are rejected, and disposed observers do not publish results. No browser-test infrastructure was added.

## Guide navigation — 2026-11-16

At a 390 × 844 browser viewport, the mobile menu exposed Guides and navigated to the complete guide list, closing the menu. The desktop dependency guide → demo → guide path was also followed successfully. This is responsive-browser verification, not physical-phone evidence.

## Learning journeys delivery audit — 2026-11-16

Software and content were delivered through `6e27cc6`; the physical-device acceptance below remains incomplete. Four tracks and eight standalone demo packages remain.

| Requirement | Evidence | Status |
| --- | --- | --- |
| Guide discovery | All-guides route, desktop/mobile navigation, command-palette entries and track-card guide counts are present. Mobile menu → Guides and desktop command-palette → rendering guide were followed. Code Quality’s empty demo list → its guides was followed. | Delivered |
| Demo / guide connections | Worker, rendering, tab settings, dependency graph, postcard, ecosystem and devices link to focused guides; those guides link back with DemoLink. Gallery links are conditional on galleryHref. The Worker standalone build ran over LAN without a gallery link. | Delivered |
| Missing-test exercise | Temporarily accepting Number(limit) passed the old suite; adding the numeric-string rejection test failed; restoring validation passed. Both temporary edits were removed. Current compute.ts still uses Number.isInteger(limit). | Verified exercise; no deliberate defect committed |
| Tab preference synchronization | Two browser tabs exchanged Compact and Comfortable updates in both directions. Reloading one returned it to Comfortable with no received messages while the other remained Compact. The later card-layout change preserves the same messaging behaviour. | Delivered |
| Focused guides | Rendering and terminal feedback are separate. The mixed browser experiments page was replaced by a dependency investigation; postcard and ecosystem each have their own guide. Guides include application outside this repo and official references. | Delivered |
| Worker responsiveness | See measured values above. Observer test covers the final frame, hidden samples and cleanup. Following the layout change, both modes again returned 41,538 primes at 500,000; the table stayed within the phone-width page. | Delivered |
| Reproducible postcard | Pure tests cover deterministic layouts. Browser SVG circle attributes matched after re-entering seed 123 with Spiral; restoring the starting composition matched the initial seed 42 / Scatter output. | Delivered |
| Physical Device Rally | Three phone-to-laptop cheers observed over public HTTPS. No verified return delivery, deliberate rejoin, device/browser identification or network identification. Participant said they can test later. | Pending participant |

The final layout pass completed all 20 check tasks. Fallow reported no dead code or duplication; estimated-coverage and CSS advisories remain. Browser checks used 390px and 1280px viewports, with dark-mode graph controls also inspected. No browser-test suite was added.

### Resume physical-device acceptance

Use a fresh or agreed room on trusted HTTPS with the phone page in the foreground. Confirm both peer counts, send a cheer each way, deliberately leave/rejoin and repeat. Record phone/browser and Wi-Fi/mobile data, plus whether it is the intended network. Do not treat two laptop browser windows or the existing one-way evidence as completing this check.

## Focused lint rules

`npm run lint` uses the root Oxlint config for React hooks, a small explicit correctness baseline and type-aware `no-floating-promises` / `no-misused-promises` checks. The pinned `oxlint-tsgolint` companion resolves workspace TypeScript types; normal workspace typechecking remains separate. Run lint locally through `npm run check`; no CI workflow is configured.

Only imported Node `test()` registrations are allowlisted in test files, because the test runner owns their outcome. Other Promises in those files remain checked. Await, return or handle rejection as appropriate; `void` marks intentional detachment but does not handle a rejection by itself.

Temporary fixtures verified that unhandled Promises, async callbacks passed to `forEach`, missing JSX keys, constant object comparisons and async Promise executors fail. Awaited/caught Promises and Node test registrations pass; an unrelated async function named `test` still fails. The fixtures were removed after verification. No accessibility rules or additional lint directories were added.
