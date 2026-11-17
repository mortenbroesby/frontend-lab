# Presentation working draft

Status: first draft for discussion. Target: a 20–30-minute technical spotlight for front-end engineers. The deck is in `slides.tsx`; this document is our notebook for changing its story, collecting evidence and trying ideas. Neither the title nor the running order is final.

## What we want

An authentic presentation grounded in an actual project, not a technology showcase for its own sake. Show the result, explain a real constraint, then make the engineering decisions understandable. Keep the slides visual and brief; put context and uncertainty in speaker notes. Leave room for an interactive illustration and discussion.

Working title: **Same components. Different screen.**

Working subtitle: **Building a familiar world on an unfamiliar platform.**

Proposed central idea: a required rendering platform does not have to dictate the developer-facing component model. In this project, the abstraction helped both component development and testing.

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

The current draft develops the firsthand story across the whole spotlight. We can compress it back into two slides if the broader browser-capabilities direction is preferred.

## Draft running order

| Slide ID | Purpose | Approximate time | What would improve it |
| --- | --- | --- | --- |
| `front-end-lab` | Establish the story and working title | 1 min | Confirm title and speaker introduction |
| `television` | Show what was actually built | 3 min | A shareable recording or screenshot; product and role context |
| `constraint` | Explain the contractual Lightning requirement | 2 min | A concise description of the project context |
| `friction` | Explain the imperative/component-model gap | 3 min | A specific example of developer friction |
| `bridge` | Trace JSX through the custom renderer to Lightning | 4 min | A small real component and its primitive counterpart |
| `illustration` | Make an update visible through a small interaction | 4 min | Replace conceptual code with a verified example if available |
| `testing` | Explain why the abstraction also helped testing | 4 min | One real test, its assertions and mocked boundary |
| `evolution` | Acknowledge the later move to Solid | 1 min, optional | Firsthand reason for the switch, otherwise omit |
| `takeaways` | Return to the two practical benefits | 2 min | One honest maintenance tradeoff and discussion |

About 24 minutes before questions. These are rehearsal estimates, not a fixed schedule. If time is tight, remove the Solid slide and shorten the illustration.

## What the interactive slide actually does

`experiment.tsx` is a small React DOM illustration. A button changes a highlighted card and a conceptual JSX snippet together. It demonstrates the distinction between describing desired output and the renderer responsible for displaying it.

It does **not** run Lightning, implement a reconciler, reproduce the original API, or execute the original tests. Its visible caption says so. It uses no external services or continuous animation, and its preview is disabled. No original project assets or code have been supplied.

The testing slide groups the component model, the default mocked environment and the real-primitives option. It is not a recovered test architecture or a literal execution pipeline.

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

- [Lightning 3 Renderer](https://www.lightningjs.io/api/renderer/)
- [Blits introduction](https://lightningjs.io/v3-docs/blits/getting_started/intro.html)

These sources describe the current platform; they are not evidence of our project's architecture or migration.

## How we iterate

Edit slide content and notes in `slides.tsx`, then record new recollections here. Move an open question into the confirmed section only after the presenter clarifies it or we recover evidence. Keep illustrative examples labelled. Rehearse in presenter mode to check pacing; view audience mode to judge text density. Update this notebook when the story changes rather than accumulating competing summaries.
