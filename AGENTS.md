# Front-End Lab: agent context

## Purpose

Help participants get up and running independently with four tracks for Front-End Chapter Day, Friday, 20 November 2026. The repository is private under `mortenbroesby/frontend-chapter-day`.

The latest user direction is a participant-focused repository. Keep navigation simple: choose a track, start exploring, share a discovery. Support solo or group work, existing React repositories. Learning matters more than production-ready outcomes; this is not primarily an AI workshop.

## Source of truth

- `README.md`: participant entry point and shared quick start.
- `tracks/a/README.md`: Track A — visual/browser APIs, computing and communication.
- `tracks/b/README.md`: Track B — dependency health, complexity, architecture and analysis.
- `tracks/c/README.md`: Track C — practical improvements to real workflow friction.
- `tracks/d/README.md`: Track D — open-ended React experiments.
- `tracks/findings.md`: optional notes and show-and-tell prompts.
- `playground/README.md`: optional app setup, source map and troubleshooting.
- `playground/VERIFICATION.md`: technical evidence and known limits.

There is no fifth track. Do not add deliberately broken applications or require the organiser to facilitate every challenge. Fallow is an optional investigation candidate, not installed or validated here.

Each track directory has a `README.md` entry, `bootstrap.md` and separate `examples.md`. C also has independent starter/example scripts and tests. Keep starting code separate from finished solutions. B uses the actual app as a fallback and a documented evidence-based investigation.

## Implementation conventions

- Keep one optional Vite/React/TypeScript SPA with plain CSS. `src/app/App.tsx` owns hash navigation; `src/demo-registry.ts` registers lazy demo components. Each demo owns its local state and cleanup. New demos live under `src/demos/<name>/`; run `npm run demo:new` from the root to generate from `src/demos/template/` and register one entry. No app-shell edit should be required.
- The four track pages lead to reference demos and a separate bootstrap. B/C may contribute findings and tool walkthroughs. Shared contributions use branches and pull requests; others pull after merge. No realtime backend or deployment is implied.
- Keep demo CSS scoped, keep identifiers unique, and preserve loading, render-error feedback and navigation. React boundaries are not sandboxes for blocking code or async errors.
- Participants can experience, rebuild, remix or combine examples. Do not turn these into mandatory exercises or a complex shared application.
- Prefer native APIs and existing code. The user explicitly chose Turborepo with npm workspaces and its generators. Keep the existing `playground/` as the first app workspace; do not create a package per demo or add unnecessary infrastructure.
- Baseline: Node 24.x, npm, exact dependency versions and lockfile. Use the root lockfile; run `npm ci` and `npm run check` from the repository root; UI/browser changes also use `npm run test:browser` with the documented optional browser setup.
- Preserve error handling, accessibility and cleanup. Keep commands and links accurate after moves.
- Inspect Git status, preserve unrelated work, and commit/push scoped completed changes. Keep verification claims distinct from independent participant acceptance.

## Scope boundaries

Do not recreate organiser planning folders or duplicate track descriptions. Earlier agenda, announcement and whiteboard planning is recoverable from commit `3ffc09a` and earlier Git history. Hosted deployment, Teams posting, invitations and Confluence publication are not part of the participant kit.

Remaining validation: independent participant setup, repository access and browsers/platforms beyond the recorded local checks. Do not claim those have passed without evidence.

Confirmed scope: React for this chapter day. Ignore prototypes.danske.net for now. Root generator config lives in `turbo/generators/config.js`; its file-writing logic has Node tests. Preserve the registry insertion marker and validation against duplicate IDs, invalid paths and existing folders.

The generator asks for a required demo name first (registry field `title`), with no default. It suggests an editable folder ID, then asks for track, author and description. Keep positional CLI examples aligned with that order. Names appear in the gallery, generated starter and README.

README style follows the owner’s Astrograph and Everyday Assistants repositories: centered introduction and concise navigation, factual badges where useful, emoji section headings, early quick start, deeper-doc links and the author/footer treatment. Keep claims grounded; do not add a license or CI badge without actual repository support.
