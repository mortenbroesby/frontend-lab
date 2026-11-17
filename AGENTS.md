# The Frontend Lab

Four tracks and standalone demos. Help participants get started independently.

## Scope

- Build focused experiments people can run, change and understand. Avoid production hardening, speculative features and future-proofing.
- Preserve standalone npm packages, metadata-driven discovery, one generator and shared tooling. Add infrastructure only for a current need.
- No backwards compatibility: update callers and delete obsolete paths. No aliases, adapters or dual modes for legacy behaviour.
- Prefer deletion, direct code, existing dependencies and browser APIs. Preserve accessibility, input safety, error handling and resource cleanup; never expose secrets.

## Agent skills

Use the shared [skill index](.agents/skills/README.md) for demo development, Lab UI, UI review, debugging, CI, Turborepo and Fallow. Load only the skill relevant to the task; keep one copy for Codex and Copilot. Update affected skill references when commands, paths or contracts change.

## Architecture

Follow [our EFA interpretation](gallery/docs/decisions/elegant-frontend-architecture.md); keep small demos flat.

- `gallery/src/app/` owns routing and composition. The gallery reads demo metadata and HTML URLs, never demo components.
- `presentation/` owns the standalone slide deck and presenter state. The combined Vite build includes its HTML entry; the gallery only links to it through the command palette and Konami code. Keep it out of ordinary navigation and independent of demo implementations.
- Each `demos/<id>/` npm workspace owns its entry, build output, UI, state, scoped styles, effects, helpers and focused tests. No imports from other demos or gallery internals. Adding a demo must not require shell edits.
- Reusable shadcn components and tokens live in `shared/ui` (`@lab/ui`). Use individual exports for ordinary controls; keep UI independent of app logic. Keep native controls only for a concrete demo-specific interaction (such as the worker tap pad or colour picker). Both Vite configs run Tailwind without Preflight. Follow the [UI guide](shared/ui/README.md); demonstrate new components in `demos/ui-library` and preserve keyboard, focus, labels and reduced-motion behavior.
- Import shared kit code through `@lab/demo-kit` exports. The kit cannot import apps or contain demo-specific state or service calls.
- Keep pure calculations separate from React/effects when useful, with tests beside them. Extract shared utilities only for multiple real consumers; no empty workspaces or speculative abstractions.
- Entry files assemble dependencies; root scripts coordinate workspaces. Gallery tests must not own demo logic.
- Run `npm run check:architecture` for import or ownership changes. Dependency-cruiser also runs in `npm run check`. Fix misplaced code rather than weakening rules.


## Development

- Name demo folders for the experiment, using descriptive kebab-case (for example `cross-tab-messaging`). Match the package name to `@lab/demo-<folder-id>`.
- Use `npm run demo:new` and the [develop-demo skill](.agents/skills/develop-demo/SKILL.md). Require a name; preserve ID validation, overwrite protection and typed discovery. Keep starters separate from finished examples.
- Use Node 24, npm workspaces, Turborepo and the root lockfile. Install only when dependencies change.
- Each demo extends `tsconfig.base.json` and owns `typecheck`, `build` and `check` scripts; tests are optional. Preserve Turbo's kit type dependencies and the gallery/dependency-map cross-workspace inputs.
- Run `npm run format` and `npm run lint` (React hooks, focused correctness and type-aware Promise rules). Generated code must pass too.

## Verification and delivery

- Use bounded checks that answer a concrete question: an existing test, type check or build. Add a small test only for an important point or nontrivial logic. No extensive suites, coverage targets, exhaustive matrices or redundant checks. Documentation and mechanical edits rarely need tests.
- `npm run check` combines format, hooks, architecture, logic, type and build checks; it need not run for every edit.
- No browser tests or infrastructure unless explicitly requested. A future browser-testing demo belongs in its own package.
- Work directly on `main`: fetch and integrate remote changes before editing and check again before pushing. Other sessions may be changing the same files; inspect overlapping changes, preserve their behaviour and rerun affected checks after integration. Commit and push scoped work. Open PRs only when requested. Report checks and remaining limits; tests are not production acceptance.

## Documentation

- Track landing pages explain the activity, offer concrete things to work on and show how to begin. Keep essential choices visible, pair each option with a first action and relevant guide/demo, and keep all-content browsing secondary. Adapt the grouping to the track rather than forcing generic intent categories. All four tracks use this activity-led approach.

- Guides teach investigation rather than prescribe a finished implementation. Offer a motivating question, concepts, relevant documentation or demo source, and ways to evaluate choices. Keep exact setup commands and small explanatory snippets where useful; put complete implementations in demos. Worked examples are optional references, and participants may choose their own idea and outcome.

- Write concise, participant-focused copy without event dates or schedules. Prefer concrete actions and useful examples. Avoid sales language, compulsory presentations, reflection prompts and instructions to report what participants learned. Say each thing once; do not repeat setup or onboarding on every page. Prefer a short explanation and a useful reference over a second walkthrough. Remove sentences that repeat the heading, restate the previous paragraph or narrate what the guide will explain. Link canonical guidance. Keep the README a local starting point, not a guide directory.
- Participant MDX lives in `gallery/src/content/` and track subfolders. Generator templates live in `turbo/generators/templates/`. Treat MDX as trusted app code, never remote or user-supplied content.
- Keep meaningful choices and tradeoffs in `gallery/docs/decisions/`.
- Use the Frontend Lab theme; do not require Sapphire. Support local or hosted use and internal GitHub Enterprise Cloud migration. Keep temporary hosting out of participant copy; use [hosting notes](gallery/docs/hosting.md).

## References

- [README](README.md): tracks and quick start.
- [Gallery guide](gallery/README.md): architecture, commands and troubleshooting.
- [Demo guide](gallery/src/content/create-demo.mdx): participant workflow.
- [Verification](gallery/docs/VERIFICATION.md): evidence and limits.

## Fallow

Codex and Copilot CLI share `.agents/skills/fallow`; follow its installed-version instructions. Config: `.fallowrc.json`. Snapshot and refresh instructions: [.baselines](.baselines/README.md). Run `npm run analyze:changes` before commits and pushes; resolve introduced findings. Do not refresh baselines to hide new findings. The official Git hook audits staged changes. GitHub Actions workflows are intentionally absent; run checks locally before pushing. See the [Fallow contributor notes](gallery/docs/fallow.md).

Use the CLI. Keep one shared Fallow skill, no repo MCP entries, per-agent hooks or duplicate task maps.
