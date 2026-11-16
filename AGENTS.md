# Front-End Lab: agent context

## Purpose

Help participants get up and running independently with four tracks for Front-End Chapter Day, Friday, 20 November 2026. The repository is private under `mortenbroesby/frontend-chapter-day`.

The latest user direction is a participant-focused repository. Keep navigation simple: choose a track, start exploring, share a discovery. Support solo or group work, own repositories and preferred technologies. Learning matters more than production-ready outcomes; this is not primarily an AI workshop.

## Source of truth

- `README.md`: participant entry point and shared quick start.
- `tracks/a-modern-web-capabilities.md`: Track A — visual/browser APIs, computing and communication.
- `tracks/b-code-quality-maintainability.md`: Track B — dependency health, complexity, architecture and analysis.
- `tracks/c-developer-experience-tooling.md`: Track C — practical improvements to real workflow friction.
- `tracks/d-experimental-projects.md`: Track D — open-ended projects and technologies.
- `tracks/findings.md`: optional notes and show-and-tell prompts.
- `playground/README.md`: optional app setup, source map and troubleshooting.
- `playground/VERIFICATION.md`: technical evidence and known limits.

There is no fifth track. Do not add deliberately broken applications or require the organiser to facilitate every challenge. Fallow is an optional investigation candidate, not installed or validated here.

## Implementation conventions

- Keep one small optional Vite/React/TypeScript app with plain CSS. Existing examples cover SVG, a D3 force-directed constellation, Workers and local BroadcastChannel messages; `src/YourLab.tsx` is the participant's starting point.
- Participants can experience, rebuild, remix or combine examples. Do not turn these into mandatory exercises or a complex shared application.
- Prefer native APIs and existing code. Avoid monorepo infrastructure, unnecessary dependencies and new abstractions.
- Baseline: Node 24.x, npm, exact dependency versions and lockfile. Run `npm ci` and `npm run check` in `playground`; UI/browser changes also use `npm run test:browser` with the documented optional browser setup.
- Preserve error handling, accessibility and cleanup. Keep commands and links accurate after moves.
- Inspect Git status, preserve unrelated work, and commit/push scoped completed changes. Keep verification claims distinct from independent participant acceptance.

## Scope boundaries

Do not recreate organiser planning folders or duplicate track descriptions. Earlier agenda, announcement and whiteboard planning is recoverable from commit `3ffc09a` and earlier Git history. Hosted deployment, Teams posting, invitations and Confluence publication are not part of the participant kit.

Remaining validation: independent participant setup, repository access and browsers/platforms beyond the recorded local checks. Do not claim those have passed without evidence.
