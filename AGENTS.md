# The Frontend Lab

Help participants choose one of four tracks and build small experiments independently. Prefer existing browser APIs, dependencies and shared components. Update callers and remove obsolete paths when contracts change.

## Where to work

| Task | Start here | Verify the change |
| --- | --- | --- |
| Create or change a standalone demo | [Demo workflow](.agents/skills/develop-demo/SKILL.md) | Run the workspace’s `check` and any demo tests. For new demos, verify gallery discovery. |
| Edit a track or guide | [Gallery authoring](gallery/README.md#author-a-track-page) | Run `npm run build --workspace frontend-lab-gallery` and open the affected route. |
| Change a shared control | [UI workflow](.agents/skills/lab-ui/SKILL.md) and [UI guide](shared/ui/README.md) | Verify its Storybook example, keyboard interaction and the consuming screen. |
| Diagnose a failing check | [Debugging workflow](.agents/skills/lab-debugging/SKILL.md) | Reproduce the failure and rerun the same check after the fix. |
| Change workspace imports or tasks | [Architecture decision](gallery/docs/decisions/elegant-frontend-architecture.md) and [Turbo workflow](.agents/skills/turborepo/SKILL.md) | Run `npm run check:architecture` and the affected workspace tasks. |

Codex and Copilot CLI share the [skill catalog](.agents/skills/README.md). Update affected skills when commands or contracts change.

## Ownership

- Each `demos/<id>/` workspace owns its implementation, tests and standalone entry. Use the named generator and typed metadata for automatic discovery.
- The gallery owns navigation, participant MDX and discovery. Link to demo HTML. Keep demo internals private to their workspace.
- The presentation owns its standalone slide deck and presenter state. Preserve its direct URL, command palette and Konami entry points. Keep it independent of demo internals and out of ordinary navigation.
- Put reusable UI in `shared/ui` and shared demo infrastructure in `@lab/demo-kit`. Use individual UI exports, the Lab theme and existing Storybook examples. Keep both packages independent of app logic. Preserve accessibility, scoped styling and reduced motion.
- Write concise, undated participant guides with a motivating question, a concrete first action and relevant references. Keep essential choices visible. Keep full implementations in demos and compile only trusted repository MDX. Record architectural decisions in `gallery/docs/decisions/`.

## Installation and delivery

- Follow the [dependency policy](gallery/docs/dependency-policy.md). Use Node 24, the npm version pinned in `package.json`, npm workspaces and the root lockfile.
- Keep Node/npm version changes in their own commit, separate from feature work. Keep exact npm versions in `package.json`; preserve the order of `.npmrc` policy settings and append new settings at the end. Change hosting configuration and notes only when hosting changes.
- Run focused checks while editing. Root `npm run check` covers formatting, lint, architecture, tests, types and builds. Add tests for meaningful behaviour. Add browser-test infrastructure only when requested.
- Run `npm run analyze:changes` before committing and pushing. Resolve introduced findings and preserve the [Fallow baselines](.baselines/README.md). See the [Fallow workflow](.agents/skills/fallow/SKILL.md).
- Work directly on `main`: fetch and integrate remote changes before editing and check again before pushing. Other sessions may be changing the same files; inspect overlapping changes, preserve their behaviour and rerun affected checks after integration. Commit and push scoped work. Open PRs only when requested. Report checks and remaining limits; tests are not production acceptance.
