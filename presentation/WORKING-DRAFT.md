# Presentation working draft

Status: a 13-slide introduction to the chapter day and a 25–30-minute spotlight, including demos and questions. Slide content and presenter notes live in `slides.tsx`.

## Focus and tone

Introduce the day, show what is possible, then help people choose something to explore. Use plain, honest language. The TV experience supports the broader idea that familiar front-end skills apply to different inputs and rendering targets; it is not the centre of the talk. Keep contractual history, the custom renderer and testing details in presenter notes for questions.

Participants can work alone or together, compare existing solutions, investigate a real codebase or build a small experiment. No production-ready result is expected. Keep schedules and logistics separate from the main story.

## Agreed running order

| Slide | Purpose |
| --- | --- |
| 1. The Frontend Lab | Quiet entrance slide |
| 2. Today is for experimenting | Set expectations for hands-on exploration |
| 3. Four ways to explore | Introduce the four agreed tracks equally |
| 4. Change one assumption | Consider sound, alternative inputs and shared screens |
| 5. Could the browser be an instrument? | Brief personal inspiration |
| 6. Browser Beat | Live music demo |
| 7. What makes that possible? | React → Web Audio → speakers; Canvas visualises the signal |
| 8. A screen without a pointer | Focus, directional navigation and returning |
| 9. The interface doesn’t have to be HTML | DOM versus Canvas; introduce Lightning with a link |
| 10. Familiar skills, different constraints | State, components and tooling |
| 11. Try the TV interface | Final live demo |
| 12. Where would you take it? | Connect the examples back to all four tracks |
| 13. Choose your starting point | Questions and a link into the Lab |

The two demos remain independent applications embedded in the deck. Continue links follow the running order. The D3 showcase is not part of this talk. All slides include presenter notes; rehearse to fit the time rather than adding filler.

## Confirmed recollections from our conversation

These are the presenter's recollections, not claims independently verified against the original source code.

- The team built a fully working, fully animated, canvas-based web application for smart TVs, involving Comcast's Xfinity set-top boxes.
- Lightning was required contractually through the Comcast collaboration. The team did not freely select it following a technology comparison. This describes that project, not a universal or current Xfinity policy.
- The biggest recalled challenge was Lightning's imperative programming model, which differed from the component-oriented frameworks the engineers were used to.
- The team built an abstraction over Lightning-based primitives, exposing familiar JSX to engineers.
- This used a custom React renderer, rather than merely JSX syntax independent of React.
- The aim was to provide an ecosystem and development experience familiar to React engineers. Do not assume every React feature or library was supported.
- The abstraction let engineers get up and running building components quickly. There are no established quantitative claims about onboarding time or productivity.
- There was no suitable testing framework for that setup, so the team also built testing tools. The abstraction made that easier.
- Tests normally mocked parts of the rendering environment, including some Canvas functionality. Tests against real Lightning primitives also existed.
- The exact mocking/stubbing terminology and implementation are not currently recalled. Do not assert a separate test renderer, pixel-accurate simulation, jsdom, shallow rendering, snapshots or a particular mocking library.
- The team later switched to Solid.js. The reason, timing, migration details and effect on the testing setup remain unknown.

## How we arrived here

We initially considered four directions: the Lab's architecture and minimal infrastructure; browser capabilities beyond everyday product work; faster feedback loops; and purposeful motion. The TV project introduced a stronger firsthand story.

The story first looked like “The browser beyond the page,” with one or two Lightning slides. As the component abstraction and testing tools emerged, the proposed focus shifted toward the boundary between component authoring and rendering. Possible alternative titles remain:

- **JSX doesn't have to mean HTML.** More technical; useful if we spend longer on the renderer.
- **The browser beyond the page.** Broader; useful if the TV story stays short and leads into workshop experiments.
- **Building a familiar world on an unfamiliar platform.** Closest to the team's developer-experience problem.

The first draft expanded this into nine slides. That was too much: the presenter clarified that the TV story should occupy only two or three slides. The current version has three, with a live showcase as its centrepiece.

## Current three-slide section

| Slide | Purpose | Approximate time |
| --- | --- | --- |
| The TV project | Explain Lightning and the original project | 1–2 minutes |
| No pointer. Where is your focus? | Explore remote navigation in the embedded Canvas TV | 2–3 minutes |
| How our app worked. | Explain the component-to-renderer flow and its benefit at a high level | 2–3 minutes |

This remains a three-slide section within the eight-slide talk. Do not expand it into the whole presentation. The later Solid migration belongs in optional speaker context, not another slide.

## The live showcase

`demos/canvas-tv/` is an independent React + Canvas 2D app, discoverable in the gallery. It draws a 16:9 streaming-style interface with original generated landscapes and fictional titles. React manages the selection and Canvas draws the actual interface; this is not HTML styled to look like Canvas.

Use arrow keys to move through two catalogue rows, Enter to play a full-frame animated short and Escape to return. Horizontal movement scrolls the shelf; each row remembers its last selection. The visible focus ring is central to the experience. On-screen remote buttons also support touch and provide ordinary accessible controls, with a text announcement of the selected programme. Tab remains available to leave the screen. Reduced motion removes focus/scroll animation and freezes the scenery. The background has moving mountain layers, drifting mist and a changing night sky, with automatic support for the system reduced-motion preference.

The presentation embeds the actual demo inline through its `?embed=1` view. No new tab is needed. The iframe keeps TV arrow keys separate from slide navigation; Tab leads to Continue presentation. Presenter previews stay static. The combined gallery build supplies the URL; standalone presentation builds can set `VITE_GALLERY_URL`. The standalone demo remains available in the gallery.

This is **not Lightning**, the original application, a custom React renderer or a video streaming service. It illustrates the interaction model using native Canvas. Actual TV hardware compatibility is unverified. The original product and its technical history remain distinct from this example.

A useful live sequence: put the pointer aside; move right until the row scrolls; move down, then back up; select a title; return. Discuss how focus, spatial movement and restoring a selection affect usability when there is no pointer.

## A personal moment to add when recalled

One short, concrete memory could make the story more personal: something awkward to implement, something the component layer made easier, or something that surprised the team. No specific incident has been supplied yet. Keep this as a notebook prompt, not an invented anecdote or an audience-facing placeholder.

## Open questions, in priority order

1. What original visual or code example can we show? A short recording would be the strongest opening; do not rebuild the old application just to obtain footage.
2. What was a concrete imperative operation that became easier through the component abstraction?
3. What did the testing library let engineers assert, and which parts of Canvas/Lightning were mocked?
4. What did the abstraction make the team responsible for maintaining? Recover an actual tradeoff rather than presenting guesses as experience.
5. Why did the team later move to Solid, and which parts of the architecture carried over?
6. What product name, period, personal role and device details should appear publicly?

None blocks this first draft. Keep unresolved details out of factual slide copy until confirmed.

## Candidate additions—not established facts

- A before/after code comparison showing equivalent output.
- One component followed through authoring, rendering and a test assertion.
- A short discussion of which responsibilities belong at the renderer boundary.
- A connection back to the Lab: experimenting with rendering targets or test doubles on a small scale.
- An audience question: “Which part of your platform is fixed—and which part could you make easier to work with?”

Do not turn the talk into a complete reconciler tutorial, a React-versus-Solid comparison, or a claim that every team needs a custom framework. Do not add speculative performance numbers, device limits, accessibility guarantees or implementation history.

## Naming and reference material

Current documentation uses LightningJS, Lightning 3 Renderer and Blits (the higher-level application framework). That naming does not identify the version used in this historical project. Refer to the project as Lightning until its actual version is recovered.

- [Lightning overview and documentation](https://lightningjs.io/) — linked from the TV slide; current site, not a version claim about our project.
- [Lightning 3 Renderer](https://www.lightningjs.io/api/renderer/)
- [Blits introduction](https://lightningjs.io/v3-docs/blits/getting_started/intro.html)

These sources describe the current platform; they are not evidence of our project's architecture or migration.

## How we iterate

Edit slide content and notes in `slides.tsx`, then record new recollections here. Move an open question into the confirmed section only after the presenter clarifies it or we recover evidence. Keep illustrative examples labelled. Rehearse in presenter mode to check pacing; view audience mode to judge text density. Update this notebook when the story changes rather than accumulating competing summaries.

## Browser instrument

Browser Beat precedes the TV section. Its live slide leads to a short explanation of the signal path, then remote input. It is a new experiment inspired by demoscene/tracker music, not part of the historical TV project. React controls native Web Audio; Canvas displays the live waveform. The four faders shape tempo, pitch, tone and echo. The embedded performance view stays separate from the standalone sequencer. Presenter previews are static and silent; leaving the live slide removes the instrument and its audio context.
