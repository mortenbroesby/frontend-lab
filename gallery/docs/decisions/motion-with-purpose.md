# Motion with purpose

## Outcome

Build one standalone demo and one practical guide about motion that explains a change. Within a minute, a participant can edit a card, save it, compare still and animated feedback, and identify what Motion and Lottie each contribute.

The demo lives in `demos/motion-with-purpose/`, under Experimental Projects. The guide is `motion.mdx` in that track. Both link to each other when hosted in the gallery; the demo also builds and runs alone.

## Stories and tasks

### 1. Understand the interaction

As a participant, I can compare the same real local save action with and without animation.

- [ ] Generate the standalone workspace and metadata.
- [ ] Build an editable card with a saved value and clear save confirmation. Save immediately; do not invent a server, delay or loading state.
- [ ] Offer Still, Motion, and Motion + Lottie treatments, with a small timing control and replay.
- [ ] Explain the visible cause and effect next to the experiment.

Acceptance: changing the card and saving updates its value in every treatment. Replay repeats feedback without changing data. The interface explains that values last only for this page visit.

### 2. Make both animation workflows tangible

As a developer, I can distinguish React-driven transitions from a reusable animation asset.

- [ ] Use `motion/react` for layout and confirmation transitions.
- [ ] Bundle an original, finite Lottie JSON animation; render it with `lottie-web`'s SVG renderer.
- [ ] Include the actual file, provenance, reuse terms and an asset download.
- [ ] Respect system reduced motion and the Still treatment; keep the confirmation understandable without animation.
- [ ] Destroy Lottie instances on cleanup; avoid loops, remote assets and animation-driven business state.

Acceptance: Lottie creates real SVG geometry from the JSON asset. Replays work repeatedly without accumulating players. Reduced motion shows a final frame. The original file is usable independently of the gallery.

### 3. Teach transfer to another repository

As a developer, I can apply the approach in my own React app.

- [ ] Write an experiment-first guide linked to the demo.
- [ ] Explain CSS vs Motion vs Lottie and SVG artwork vs Lottie animation data.
- [ ] Include installation, a small working React example, first edits and observable success checks.
- [ ] Cover interruption, state ownership, layout shift, reduced motion, asset licensing and cleanup.
- [ ] Link official Motion, Lottie and MDN resources at the relevant steps.
- [ ] Register the guide for track, All guides and command-menu discovery.

Acceptance: commands and example imports match installed packages. A reader can start with an existing React app, without importing Lab-specific components. Guide links resolve to the actual demo.

### 4. Deliver a coherent learning journey

As a participant, I can use the guide and demo on a laptop or phone.

- [ ] Review desktop and phone spacing, light/dark presentation and keyboard controls.
- [ ] Exercise edit/save/replay, all treatments, timing changes and reduced motion in the browser.
- [ ] Verify gallery-to-demo-to-guide navigation and the independent built app.
- [ ] Run bounded type/build, lint, formatting, architecture and Fallow checks. Add logic tests only if nontrivial pure logic warrants them.
- [ ] Commit and push scoped milestones to main; record evidence here and leave a LAN preview.

Acceptance: no horizontal overflow at phone width, no remote asset requirement, no browser-test infrastructure. Report any unverified behavior separately from passing build checks.

## Decisions and limits

Motion animates React UI; Lottie plays a vector timeline. Both demonstrate a distinct job, rather than two versions of the same framework comparison. Use `lottie-web` directly so the guide exposes player creation and cleanup without another wrapper dependency. Keep dependencies local to this demo.

Create a small original asset in Lottie JSON rather than borrowing an animation with unclear rights. Describe it honestly as hand-authored animation data, not an After Effects export. Production teams can follow the linked design-tool export workflow instead.

No network saving, fake performance claims, perpetual decorative animation, new gallery framework or Rive/GSAP implementation. Public deployment is outside this milestone while Vercel's daily quota is exhausted.

## Evidence and status

Plan prepared; implementation not yet verified. The requested new app goal could not be created because the previous goal remains blocked on physical Device Rally acceptance. That check remains incomplete; this plan does not mark it done.

References: [Motion animation](https://motion.dev/docs/react-animation), [layout](https://motion.dev/docs/react-layout-animations), [reduced motion](https://motion.dev/docs/react-accessibility), [Lottie Web](https://github.com/airbnb/lottie-web).
