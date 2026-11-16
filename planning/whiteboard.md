# Confluence whiteboard specification

## Purpose and handoff

Create a collaborative workshop space for **The Front-End Lab**, Friday, 20 November 2026, using native, editable Confluence whiteboard elements. This is a specification only; no board has been created. The four tracks are agreed. Experiment suggestions are optional, and participants can work solo or in groups.

The design follows the requested chapter-day format. Earlier workshop screenshots were unavailable during setup; do not claim a visual match to them. Use [agenda](agenda.md), [tracks](tracks.md) and [preparation](preparation.md) as canonical content. The [Mermaid diagram](../whiteboard/structure.mmd) is an overview, not an editable-board import format.

For later construction, resolve the Confluence destination, intended audience and publishing authorisation. Reuse authorisation if already provided. Verify participant edit access, and report missing capabilities rather than claiming a board exists. Do not invite participants or choose an unrelated destination from this specification alone.

## Layout and native elements

Use six numbered zones in reading order:

1. Welcome, objectives and agenda.
2. Preparation and getting started.
3. Overview of the four tracks.
4. Four independent track areas A–D, in a spacious two-by-two layout.
5. Show-and-tell area.
6. Shared takeaways and next steps.

Use editable text, shapes, sticky notes and connectors, grouped by zone where supported. Include a navigation index and track letters as well as colour. Keep contrast readable and instructions distinct from participant notes. Leave several blank prompted notes per collaborative area and room to expand. Screenshots may support findings but must not replace editable board content.

## 1 · Welcome, objectives and agenda

Title: **The Front-End Lab**. Date: **Friday, 20 November 2026**.

Welcome copy:

> Explore, experiment and build something interesting. Pick a track, team up or go solo, and share what you discover. Follow your curiosity; learning matters more than a polished deliverable.

Show the agenda exactly at this level of detail, with **all times Danish local time**:

| Time | Activity |
| --- | --- |
| Before 09:00 | Agenda and track details available for colleagues in India |
| 09:00 | Welcome, introduction and walkthrough of tracks |
| Morning | Coffee break, optional technical presentation and hands-on experimentation |
| 11:30 | Lunch |
| 13:00 | India show & tell; anyone else ready is welcome |
| 14:30–15:00 | Denmark show & tell and wrap-up |

Keep coffee, presentation and experimentation flexible; do not invent additional slots. Add **[VENUE_OR_MEETING_LINK]** and **[HELP_CONTACT]** placeholders until supplied. The optional presentation needs a topic/speaker only if included.

Provide an editable prompt: “What are you curious about today?” with name or group label. Working agreements: respect different starting points, share useful discoveries, ask peers for help and feel free to change direction.

## 2 · Preparation and getting started

Link to the planning repository and its preparation guide:

- https://github.com/mortenbroesby/frontend-chapter-day
- https://github.com/mortenbroesby/frontend-chapter-day/blob/main/planning/preparation.md

Display this start route: **choose a question → choose an existing project or minimal example → try one small thing → record what happened**. No starter or workshop installation is required. An optional Vite/React/TypeScript starter is only under consideration; add a link later if it actually exists and is tested.

Include browser/editor/access checks, own-project setup instructions and permission to use preferred tools/technologies. Keep special API, server or toolchain requirements local to the chosen experiment. The board must enable India colleagues to start before the welcome, without waiting for the organiser.

Create editable columns:

- **Ready / exploring:** name or group, chosen question and starting point.
- **Need help:** attempted step, blocker and help requested.
- **Can help:** name and relevant experience.
- **Setup tips:** verified fixes or useful references others can reuse.

Fallback card: use an existing environment, a simple browser example or peer pairing if setup becomes the experiment. Do not require a facilitator-provided demo or bespoke broken app.

## 3 · Four-track overview

Create four native cards using these exact titles and descriptions:

| Track | Purpose |
| --- | --- |
| 🌐 A · Modern Web Capabilities | Explore a browser API or capability beyond everyday development |
| 🔍 B · Code Quality & Maintainability | Investigate codebase health, dependencies, complexity and boundaries |
| 🛠️ C · Developer Experience & Tooling | Address real recurring workflow friction with a practical improvement |
| 🚀 D · Experimental Projects | Build something that sparks curiosity with your own technologies and approach |

Under each, leave space for participant/group names, question and optional collaboration invitations. Solo participation is equally valid. Allow names to move between tracks and connect cards to their areas. Overlap is welcome; do not create approval gates for choosing a track.

## 4 · Four independent track areas

Each area should work on its own without a spoken briefing. Include an introduction, a concrete first step, optional challenge cards, useful starting points, a discoveries canvas and a show-and-tell prompt. Use the following content and link to the relevant section of `planning/tracks.md` for detail.

### A · Modern Web Capabilities

**Introduction:** Explore what a browser-native capability makes possible.

**Start here:** Pick one API, read its documentation and run or adapt the smallest example in a browser page or your own app. Check browser support and setup requirements before expanding.

**Challenge cards:**

- Visual & Interactive: Canvas, SVG, animation or View Transitions.
- Computing & Performance: Web Workers, WebAssembly or browser scheduling.
- Real-Time Communication: WebSockets, SSE or WebRTC.
- Other Web APIs: choose another capability that interests you.

**Starting points:** Your own app, a minimal browser example or an optional tested starter if later provided. For real-time experiments, establish the local server/peer/signalling needs of the chosen example; no shared backend is promised. Add checked API documentation links when selected, without invented commands.

**Stretch:** Browser fallback, cancellation, keyboard use or reduced motion as appropriate.

**Show:** The experiment, what the capability enabled and an interesting constraint.

### B · Code Quality & Maintainability

**Introduction:** Investigate the health of an existing or suitable sample project.

**Start here:** Choose a project you can access, follow its normal setup and ask one bounded question. Start with existing analysis scripts or a focused source/dependency inspection.

**Challenge cards:** Technical debt discovery (investigate tools such as Fallow); dependency health; duplication/complexity; architecture/boundaries/coupling; automated quality checks.

**Starting points:** An existing codebase and its current tooling, or a suitable public sample with verified setup. Add **[VERIFIED_SAMPLE_LINK — pending selection]** as an optional fallback, not a prerequisite. Fallow is a tool candidate, not required or validated here; check its documentation before use. Private source should not be uploaded to an external service without permission.

**Stretch:** Validate a finding against actual use, test a small improvement on an isolated branch or turn a useful check into repeatable analysis.

**Show:** Evidence-backed findings, false positives/limitations and a possible next step. Fixing every finding is not expected.

### C · Developer Experience & Tooling

**Introduction:** Improve something that repeatedly gets in the way of development.

**Start here:** Name one recurring task, reproduce the friction and define what an improvement would look like. Inspect existing scripts and tool features first.

**Challenge cards:** Faster feedback loops; local tooling; simpler workflows; repetitive-task automation; build/test/debugging improvements; small practical utilities.

**Starting points:** Your own working environment, existing scripts/configuration and one concrete input/output example. A new tool is unnecessary if an existing feature solves the problem.

**Stretch:** Ask a peer to try the change, improve failure feedback or check an important failure case.

**Show:** The original problem, practical change and whether it helped.

### D · Experimental Projects

**Introduction:** Build something interesting outside business requirements.

**Start here:** Choose an idea and reduce it to one demonstrable behaviour. Use your preferred technologies, an existing project or a minimal example.

**Challenge cards:** Browser game; interactive data visualisation; generative art; chapter quiz; developer utility; your own idea.

**Starting points:** Familiar tools, a plain browser page, local/synthetic data or an optional app starter if useful. There is no prescribed stack or required finished product.

**Stretch:** Add a playful interaction, consider accessibility or let a peer try it.

**Show:** A demo, sketch or discovery and the most interesting learning.

### Collaborative canvas within every track

Create distinct editable areas for:

- **Question / idea:** What do I or we want to explore?
- **Approach:** Starting point, tool/API and smallest experiment.
- **Evidence:** What happened? Link code, a trace, screenshot or notes.
- **Discoveries:** What surprised us? What worked or failed?
- **Limitations and help:** What is uncertain or blocked?
- **Share:** Presenter/group, finding or demo, preferred show-and-tell session.

Include name/group labels and optional next experiments. Leave blank prompts; do not pre-populate fictional participant findings. No track should depend on the organiser guiding every technical step.

## 5 · Show-and-tell area

Create two editable sign-up queues:

- **13:00 — India show & tell:** anyone else ready is welcome to present.
- **14:30–15:00 — Denmark show & tell and wrap-up.**

Each row contains name/group, track, title/question, demo/evidence link and any presentation needs. Keep durations flexible based on volunteers; do not assign invented slots. Provide space for asynchronous findings so sharing does not require attendance at both sessions.

Prompt presenters: “What did you try? What did you discover or build? What remains uncertain?” Allow useful failed experiments and incomplete prototypes. Put questions and reusable tips beside each finding.

## 6 · Shared takeaways and next steps

Create editable columns **Learned**, **Enjoyed**, **Would change** and **Want to explore next**. Add a lightweight follow-up table: idea, optional owner, next step and link. These are voluntary follow-ups, not delivery commitments. Keep it usable asynchronously for colleagues who have already finished their day.

## Acceptance checklist for the later board build

- [ ] Six zones and exactly four independent track areas use the agreed names and purposes.
- [ ] Agenda uses Danish local time and only the supplied anchors, including both show-and-tell sessions.
- [ ] Agenda, track starting points and access instructions are available to India colleagues before 09:00 Friday; verify access with a participant.
- [ ] Every track has a usable first step, suggested experiments, useful starting points and editable discovery space without needing an organiser walkthrough.
- [ ] Solo and group participation are supported, with no mandatory shared application or toolchain.
- [ ] Text, cards, notes and connectors remain individually editable and readable; content is not a flattened image.
- [ ] A participant can add/edit a note, move a track selection and paste evidence links.
- [ ] Existing links resolve for participants; missing destinations remain explicit placeholders. No unimplemented commands or invented findings appear.
- [ ] Record the real board URL, access verification and any unsupported host features here; update README and announcement links.

Deliver the board URL and a concise report distinguishing content completion, participant access verification and remaining placeholders.
