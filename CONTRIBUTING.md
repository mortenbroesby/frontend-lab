# Bring an experiment to the lab

Work on a branch from current `main`. Repository access is managed by the chapter's GitHub team; see the [migration guide](docs/internal-migration.md) for maintainer setup.

## Build and share

- Follow [local setup](README.md#start-here), then choose a track. Use `npm run demo:new` for a gallery demo, or contribute a script or findings note.
- Keep each demo's component, `demo.config.ts`, styles and notes in its own folder. Use a unique folder ID; no central registration is needed.
- Run `npm run check` and `npm run analyze:changes`. UI/browser changes also need `npm run test:browser` with the [browser setup](playground/README.md#browser-checks).
- Push your branch and open a pull request describing what to try and what you learned. Merged demos deploy to the [hosted lab](https://frontend-chapter-day.vercel.app); pull `main` to update your local gallery.

Install the local commit check once per clone with `npm run fallow:hooks`; check it with `npm run fallow:status`. If a hook already exists, follow the [Fallow guide](tracks/code-quality/fallow.md#set-up-agents-and-commit-checks) rather than replacing it. That guide also covers Codex and Copilot CLI setup.

Keep example data synthetic and respect the source project's permissions. Do not copy private source, credentials or participant data into this repository. Clean up timers, listeners and Workers when a demo unmounts; keep shared-shell changes useful to every track.

[Demo contract and lifecycle](playground/src/demos/template/README.md) · [Findings template](tracks/findings.md)
