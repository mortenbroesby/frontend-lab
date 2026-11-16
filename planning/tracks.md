# Proposed tracks

The confirmed direction is a hands-on, exploratory front-end day with cross-squad collaboration and knowledge sharing. The five-track format, titles and experiments below remain proposals. A–D are working directions; E is explicitly undecided. Examples are a menu, not a checklist.

Each group should choose a question, establish a small baseline, try one change and record what happened. Use its whiteboard area for **question → experiment → evidence → finding → next step**. Finish with a lightweight demo or explanation. No exercises or starters exist yet.

## A · Creative Browser — proposed

**Introduction:** What can the browser make possible without a large library?

**Objective:** Explore native visual and interactive capabilities through a small creative build.

**Experiment menu:**
- Make an interactive Canvas or SVG visualisation using a small synthetic dataset.
- Build a tiny game or playful animation with direct user interaction.
- Explore View Transitions between two states and consider a fallback when unavailable.

**Likely preparation / getting started:** Modern browser, editor and DevTools. Once selected, use a minimal browser page or the agreed Vite/React/TypeScript starter. Begin with one visible object and one interaction; confirm support for the chosen API before expanding.

**Optional stretch:** Keyboard controls, reduced-motion behaviour, accessible text alternatives or comparing SVG and Canvas for the same scene.

**Possible outcome:** A short interactive demo plus notes on browser support, usability and what was unexpectedly easy or hard.

## B · Push the Browser — proposed

**Introduction:** Can the interface stay usable while the browser does serious work?

**Objective:** Understand where work runs and how different approaches affect responsiveness.

**Experiment menu:**
- Compare a main-thread computation with a Web Worker implementation while interacting with the UI.
- Split a long task into chunks and compare responsiveness with an uninterrupted baseline.
- Explore WebAssembly for one bounded computation and compare the whole path, including data transfer and startup costs.

**Likely preparation / getting started:** Browser performance tools and a small deterministic synthetic workload. The starter must support local serving. Begin with a bounded workload and record baseline interaction behaviour. WebAssembly is optional: choose and verify a toolchain only if that challenge is selected; it must not block everyone else's setup.

**Optional stretch:** Cancellation, progress updates, transferable data or varying input size to identify crossover points.

**Possible outcome:** Side-by-side behaviour or a timing table with methodology, limitations and a recommendation about when the technique helps.

## C · Performance Detective — proposed

**Introduction:** Find the bottleneck before reaching for an optimisation.

**Objective:** Use evidence to explain a slow interaction, render or load sequence and verify an improvement.

**Experiment menu:**
- Profile a React interaction and identify unnecessary or expensive rendering.
- Read a network waterfall and test one loading strategy.
- Investigate bundle composition or an expensive operation, then measure one targeted change.

**Likely preparation / getting started:** Browser DevTools; React profiling tooling if the chosen sample uses React. Organisers must prepare a small reproducible sample with observable bottlenecks and synthetic data. Choose one user journey, record browser/device conditions and capture a baseline before editing.

**Optional stretch:** Check whether the improvement holds under throttling or introduces a different regression. Compare repeat measurements instead of relying on a single run.

**Possible outcome:** A before/after trace, explanation of the cause and a small justified fix. Avoid claiming a universal speed-up from one device.

## D · Developer Experience & Tooling — proposed

**Introduction:** What small annoyance could we remove from an engineer's day?

**Objective:** Build a focused utility and evaluate whether it makes a real workflow clearer or faster.

**Experiment menu:**
- Build a small CLI that validates a fixture or produces a useful report.
- Explore build-tool diagnostics and improve one feedback loop.
- Prototype a developer utility or investigate a monorepo workflow using a tiny local fixture.

**Likely preparation / getting started:** Identify one pain point, its intended user and a concrete input/output example. Use the agreed Node.js baseline for scripts; a UI starter only when useful. Use local fixtures rather than production integrations. Monorepo investigation does not require converting this repository into a monorepo.

**Optional stretch:** Helpful errors, a representative automated test, cross-platform use or measuring time saved against the original workflow.

**Possible outcome:** A working small utility, usage example and honest account of its trade-offs.

## E · To Be Decided — explicitly provisional

Choose one direction after discussion; do not prepare two complete exercises by default.

| Candidate | Objective and challenge suggestions | Likely preparation and first step | Stretch and possible outcome |
| --- | --- | --- | --- |
| Architecture Under Pressure | Explore how a small UI design responds to changing requirements: add an alternative data source, a new feature or a changed state boundary | Agree a tiny starter and two or three requirement-change cards; sketch the initial design before applying one card | Compare a second design; demonstrate the change and record coupling, complexity and trade-offs |
| Resilient Interfaces | Keep an interface understandable under slow responses, errors, retries or out-of-order results | Agree a tiny UI and deterministic local fault simulation; start with one failure scenario | Cancellation, recovery and accessible status feedback; demonstrate failure/recovery and explain what the user experiences |

**Decision criteria:** Participant interest, distinction from A–D, achievable setup by Thursday and a demonstrable result within a day. Architecture should stay hands-on rather than becoming only a design discussion; resilience should focus on user experience and correctness rather than repeating C's speed investigation.

**Shared findings and show-and-tell:** Whichever candidate is chosen, capture the original assumption, changed condition, observed result and next question. Update this file, AGENTS.md, the announcement, board specification and Mermaid diagram after the organiser confirms the choice.
