# Front-End Chapter Day: persistent context

## Outcome and source of truth

Prepare **The Front-End Lab**, Friday, 20 November 2026, for front-end engineers across squads following the Spotify chapter model. The user's refined planning brief supersedes the initial 16 November five-track proposal. The title and four tracks below are agreed, not provisional.

The original reference conversation was named “Front-End Chapter Day 2026 | Planning & Bootstrap”. A related chat was accessible as “Front End Chapter Day Ideas”, but older content and screenshots were unavailable during setup. Do not claim to have reproduced the previous boards. The latest user brief is the source of truth.

## Confirmed direction

- Private personal GitHub repository: `mortenbroesby/frontend-chapter-day`.
- Hands-on exploration, experimentation, collaboration and learning; not presentation-heavy or primarily focused on AI.
- Participants choose a track and work independently or in groups. Cross-squad collaboration is encouraged, not mandatory.
- Fast entry, minimal preparation, freedom to follow curiosity; production-ready deliverables are not expected.
- A: **Modern Web Capabilities** — visual/interactive APIs, computing/performance, real-time communication and other Web APIs.
- B: **Code Quality & Maintainability** — technical debt discovery (tools such as Fallow), dependency health, complexity, architecture and automation, using existing or suitable sample projects.
- C: **Developer Experience & Tooling** — start with real recurring workflow friction and explore a practical improvement.
- D: **Experimental Projects** — open-ended ideas and participants' choice of technology.
- Tracks must be self-directed; the organiser must not need to facilitate every technical challenge.

## Schedule: Danish local time

Before 09:00: agenda and tracks available to colleagues in India. 09:00: welcome/introduction/track walkthrough. Morning: coffee break, optional technical presentation and hands-on experimentation. 11:30: lunch. 13:00: India show & tell, open to anyone else ready. 14:30–15:00: Denmark show & tell and wrap-up. Keep unspecified timings flexible; do not invent slots or presentation durations.

## Superseded ideas

The earlier five-track proposal and undecided fifth track are retired. Performance Detective and Bug Hunt were removed because deliberately problematic applications would require substantial preparation. Beyond React was removed. Creative Browser and Advanced Web APIs were merged into Modern Web Capabilities; browser computing also belongs there. Do not restore removed tracks or build prepared broken applications. Architecture remains an exploration area within B, not a separate track decision.

## Technical preferences and conventions

- The latest user request authorises a long-running goal to build a polished optional bootstrap, working examples and assemble-your-own journeys. This supersedes the earlier documentation-only limit; it does not authorise four elaborate prescribed exercises.
- The optional kit now lives in `exercises/playground`: Vite + React + TypeScript, plain CSS, SVG art, Worker and local BroadcastChannel examples, plus `YourLab.tsx`. Participants may still use their own repositories, tools and technologies. `exercises/README.md` maps all four self-directed journeys.
- Prefer native platform capabilities, small independent experiments and minimal dependencies. Avoid complex shared apps, monorepo infrastructure, abstractions and mandatory specialist toolchains.
- Baseline: Node 24.x, npm and exact dependency versions with a lockfile. Run `npm ci` and `npm run check` in `exercises/playground`. Browser journeys use `npm run test:browser`; see its README for optional browser setup. Keep evidence and known limits in `exercises/VERIFICATION.md`.
- Keep docs concise and in English. Use relative links and explicit placeholders for unavailable destinations.
- `planning/tracks.md` owns track detail; `planning/agenda.md` timing; `planning/preparation.md` readiness; `planning/whiteboard.md` board construction. Synchronise their summaries when decisions change.
- Record actual decisions here; suggested experiments and optional tools are not requirements. Fallow is an investigation candidate, not a validated or mandatory dependency.
- Inspect Git status, preserve unrelated work, and commit/push completed scoped changes. No infrastructure or artificial tests for documentation alone.
- Teams posting, invitations, hosted deployment and Confluence publication remain separate from building this local kit; do not infer publication authorisation.

## Open gaps and priorities

1. Ensure India colleagues can independently access the agenda, track starting points and collaboration space before 09:00 Friday.
2. Confirm venue/meeting links, participant access/contribution approach, board destination/edit permissions and help contact.
3. Have a participant try the kit independently on their own machine. Keep the optional kit small; evaluate new examples by learning value and setup cost.
4. B can inspect this actual playground as its fallback; C can try its watch/check feedback loop. No planted defects or mandatory analysis tool. The user prefers a balanced mix of browser APIs, creative visuals and practical tooling.
5. Decide whether to include a technical presentation, and identify speaker/topic if so; attendance and demo volume inform flexible facilitation.
6. Construct the native editable board later when destination and publishing scope are supplied. Track titles and agenda anchors do not need reconfirmation.
