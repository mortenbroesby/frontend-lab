# Motion with purpose

## Outcome

Build one standalone demo and one practical guide about motion that explains a change. Within a minute, a participant can edit a card, save it, compare still and animated feedback, and identify what Motion and Lottie each contribute.

The demo lives in `demos/motion-with-purpose/`, under Experimental Projects. The guide is `motion.mdx` in that track. Both link to each other when hosted in the gallery; the demo also builds and runs alone.

## Stories and tasks

### 1. Understand the interaction

As a participant, I can compare the same real local save action with and without animation.

- [x] Generate the standalone workspace and metadata.
- [x] Build an editable card with a saved value and clear save confirmation. Save immediately; do not invent a server, delay or loading state.
- [x] Offer Still, Motion, and Motion + Lottie treatments, with a small timing control and replay.
- [x] Explain the visible cause and effect next to the experiment.

Acceptance: changing the card and saving updates its value in every treatment. Replay repeats feedback without changing data. The interface explains that values last only for this page visit.

### 2. Make both animation workflows tangible

As a developer, I can distinguish React-driven transitions from a reusable animation asset.

- [x] Use `motion/react` for layout and confirmation transitions.
- [x] Bundle an original, finite Lottie JSON animation; render it with `lottie-web`'s SVG renderer.
- [x] Include the actual file, provenance, reuse terms and an asset download.
- [x] Respect system reduced motion and the Still treatment; keep the confirmation understandable without animation.
- [x] Destroy Lottie instances on cleanup; avoid loops, remote assets and animation-driven business state.

Acceptance: Lottie creates real SVG geometry from the JSON asset. Replays work repeatedly without accumulating players. Reduced motion shows a final frame. The original file is usable independently of the gallery.

### 3. Teach transfer to another repository

As a developer, I can apply the approach in my own React app.

- [x] Write an experiment-first guide linked to the demo.
- [x] Explain CSS vs Motion vs Lottie and SVG artwork vs Lottie animation data.
- [x] Include installation, a small working React example, first edits and observable success checks.
- [x] Cover interruption, state ownership, layout shift, reduced motion, asset licensing and cleanup.
- [x] Link official Motion, Lottie and MDN resources at the relevant steps.
- [x] Register the guide for track, All guides and command-menu discovery.

Acceptance: commands and example imports match installed packages. A reader can start with an existing React app, without importing Lab-specific components. Guide links resolve to the actual demo.

### 4. Deliver a coherent learning journey

As a participant, I can use the guide and demo on a laptop or phone.

- [x] Review desktop and phone spacing, light/dark presentation and keyboard controls.
- [x] Exercise edit/save/replay, all treatments, timing changes and reduced motion in the browser.
- [x] Verify gallery-to-demo-to-guide navigation and the independent built app.
- [x] Run bounded type/build, lint, formatting, architecture and Fallow checks. Add logic tests only if nontrivial pure logic warrants them.
- [x] Commit and push scoped milestones to main; record evidence here and leave a LAN preview.

Acceptance: no horizontal overflow at phone width, no remote asset requirement, no browser-test infrastructure. Report any unverified behavior separately from passing build checks.

## Decisions and limits

Motion animates React UI; Lottie plays a vector timeline. Both demonstrate a distinct job, rather than two versions of the same framework comparison. Use `lottie-web` directly so the guide exposes player creation and cleanup without another wrapper dependency. Keep dependencies local to this demo.

Create a small original asset in Lottie JSON rather than borrowing an animation with unclear rights. Describe it honestly as hand-authored animation data, not an After Effects export. Production teams can follow the linked design-tool export workflow instead.

No network saving, fake performance claims, perpetual decorative animation, new gallery framework or Rive/GSAP implementation. Public deployment is outside this milestone while Vercel's daily quota is exhausted.

## Evidence and status

Implemented the standalone workspace with Motion 14.14.0 and Lottie Web 5.13.0. The guide is registered under Experimental Projects and includes examples for an external React project, first edits, official resources and asset workflow guidance.

Verification on 17 November 2026:

- Root `npm run check`: all 22 Turbo type/build tasks plus formatting, lint, architecture and existing tests passed. No new browser-test infrastructure or artificial unit tests.
- Both guide TSX snippets were extracted temporarily and compiled against the installed dependencies; temporary files were removed.
- Fallow: no dead code or duplication errors. Main component complexity is advisory after separating the editor, treatment controls and confirmation into local components; no suppressed rules or refreshed baselines.
- Built standalone demo at LAN port 4181: edit/save updates the title, cancel preserves it, blank input disables saving, Enter saves, and focus returns to Edit card.
- Still/Motion/Motion + Lottie, timing slider up to 750 ms, repeated replay and page-reset behavior exercised. Final replay leaves one confirmation and one SVG player; revision stays unchanged.
- Lottie renders the check from JSON into SVG. Reduced-motion emulation shows the completed check and instant transitions. Media emulation was restored afterward.
- Phone viewport 390 px: content width 375 px with no horizontal overflow; edit/Enter save worked. Desktop light and phone dark layouts inspected. Viewport override restored.
- Gallery guide link opens the demo; the demo's guide link returns to the registered guide. Standalone build omits the gallery link unless configured.

Known limits: the standalone bundle triggers Vite's size advisory (about 204 kB gzip including shared UI, React and both animation libraries). The lightweight SVG player removes the unused expression engine. No performance benchmark or physical-phone acceptance is claimed. Public Vercel deployment remains blocked by its daily quota.

The requested new app goal could not be created because the previous goal remains blocked on physical Device Rally acceptance. That check remains incomplete; this plan does not mark it done.

References: [Motion animation](https://motion.dev/docs/react-animation), [layout](https://motion.dev/docs/react-layout-animations), [reduced motion](https://motion.dev/docs/react-accessibility), [Lottie Web](https://github.com/airbnb/lottie-web).
