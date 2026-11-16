# Four agreed tracks

Pick a track, go solo or team up, and follow your curiosity. The track structure is agreed; the ideas below are optional starting points. Use your own repository, tools and technologies where appropriate. No bespoke exercise or organiser-led technical walkthrough is required.

For any track: choose one question, try the smallest useful experiment, record what happened and share a discovery. Capture **question → approach → evidence → learning → possible next step** in your board area. You can change scope or track along the way.

## 🌐 A · Modern Web Capabilities

**Explore:** Modern browser APIs and capabilities beyond everyday front-end development.

**Possible areas:**

- Visual & Interactive: Canvas, SVG, animations and View Transitions.
- Computing & Performance: Web Workers, WebAssembly and browser scheduling.
- Real-Time Communication: WebSockets, Server-Sent Events (SSE) and WebRTC.
- Other Web APIs: any browser-native capability that interests you.

**Start independently:** Pick one API and a question it could answer. Open its documentation, check browser support and begin with its smallest example in a browser page or your own app. An optional Vite/React/TypeScript starter may help later, but is not required. Choose the smallest interaction that demonstrates the capability.

**Suggested experiments:** Animate a state transition; compare a small calculation on the main thread and in a Worker; try a local real-time message experiment; or explore another API of your choice. For real-time work, first establish what server, peer or signalling setup your chosen example needs; use a runnable local example or choose a simpler API if setup dominates. No shared communication service is promised.

**Optional stretch:** Explore cancellation, browser fallback, keyboard use or reduced motion where relevant.

**Share:** A small demonstration plus what the API enabled, its constraints and what you would try next.

## 🔍 B · Code Quality & Maintainability

**Explore:** The health, quality and maintainability of an existing codebase or suitable sample project.

**Possible areas:**

- Automated technical debt discovery: investigate tools such as Fallow.
- Dependency health: unused, outdated or problematic dependencies.
- Code complexity: duplication, complexity and maintainability.
- Architecture: dependencies, boundaries and coupling.
- Automation: repeatable analysis and quality checks.

**Start independently:** Choose a repository you can work with and get its existing documented setup running. Select one question, such as “Which dependencies appear unused?” or “Where are boundaries unclear?” Begin with its existing analysis scripts, dependency information or a focused source inspection. No specially prepared broken application is needed.

**Suggested experiments:** Evaluate an analysis tool on a small scope; trace one dependency boundary; investigate duplicated logic; or prototype a repeatable quality check. Fallow is a candidate to investigate, not a required installation or an endorsed tool with verified capabilities. Consult the selected tool's documentation before running it. Check a few findings against actual usage before deciding they represent debt; an outdated dependency is not automatically a problem.

**Fallback:** If you cannot use a work repository, use a small project you already know or a suitable public sample with setup instructions. A shared sample link still needs selection and a setup check; this must not block own-project exploration. Do not upload private source to external analysis services without permission.

**Optional stretch:** Test whether a validated finding can become a useful automated check, or try one small improvement on an isolated branch.

**Share:** Findings with evidence, false positives/limitations and a practical next step. There is no obligation to fix every finding.

## 🛠️ C · Developer Experience & Tooling

**Explore:** A recurring source of friction in your front-end development workflow and a practical way to reduce it.

**Possible areas:** Faster feedback loops, better local tooling, simpler workflows, repetitive-task automation, build/test/debugging improvements and small utilities or scripts.

**Start independently:** Write down one task you repeat, what makes it awkward and what a useful improvement would look like. Reproduce it in your existing environment. Check existing scripts and native tool features before building anything.

**Suggested experiments:** Shorten the path to a focused test; simplify a local setup step; automate a repetitive edit or report; improve debugging feedback; or make a small utility for an actual need. Keep one concrete input/output example and compare the workflow before and after.

**Optional stretch:** Ask a peer to try the improvement, improve error messages or add a meaningful check for an important failure case.

**Share:** The original friction, what changed and whether it helped. Discovering an existing feature may be the best result; tools are not the goal in themselves.

## 🚀 D · Experimental Projects

**Explore:** Something that sparks your curiosity, away from business requirements.

**Possible ideas:** A browser game, interactive data visualisation, generative art, chapter quiz, small developer utility or any other interesting experiment.

**Start independently:** Choose your own idea, technologies and approach. Reduce it to one visible or demonstrable behaviour, using familiar tools or a minimal example for a technology you want to explore. A plain page, existing project or optional app starter can all work.

**Suggested experiments:** Create one playable interaction; visualise a small dataset; generate a visual pattern; prototype a quiz question flow; or follow an idea of your own. Use local or synthetic assets if gathering data would slow you down.

**Optional stretch:** Add a playful interaction, improve accessibility or invite a peer to test the prototype.

**Share:** A demo, sketch or discovery and the most interesting thing you learned. Finishing a product is not expected.

## Choosing between overlapping interests

A centres on learning a browser capability; B on codebase health; C on a real workflow problem; D on an open-ended project. Overlap is welcome. Choose the framing that helps you start rather than seeking permission for a perfect category fit.
