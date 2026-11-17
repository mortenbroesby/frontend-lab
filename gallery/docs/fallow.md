# Fallow in this repository

Contributor reference. For a first investigation, use the app’s Code Quality → Guides → Investigate with Fallow.

## Configuration

The following choices describe this Lab repository, not defaults to copy into your own project.

- `.fallowrc.json` declares workspace patterns and the existing thresholds. Built-in discovery adds package exports, Vite, tests, generators and Workers. Recheck it when entries move.
- Root scripts scan the current workspace outside Turbo’s cache. New error-level findings and worsening existing enforceable complexity findings fail the audit, commit hook and CI. Unchanged inherited findings remain allowed; estimated-coverage-only findings, test complexity and CSS suggestions stay advisory.
- `.baselines/` records reviewed findings. Run `npm run analyze:baseline` to compare the whole repo; `npx fallow health` shows current metrics and advisories. Read the baseline README before refreshing.
- No Fallow boundary rules or rule packs. `npm run check:architecture` separately enforces dependency-cruiser rules; a clean Fallow result says nothing about that policy.
- `.fallow/` holds ignored generated data. Never commit caches or machine-specific reports.

If discovery misses an entry, inspect it before adding a narrow `entry` pattern in `.fallowrc.json`. Do not mark every file as an entry or ignore directories to clear findings. Understand changes before applying automatic fixes.

Keep sensitive source and reports within the repository's permitted audience.

## Agents and commit checks

After `npm ci`, check `npm run fallow:status`. Install missing hooks once per clone with `npm run fallow:hooks`; the official installer refuses to overwrite hooks. Your terminal and Git client need Node/npm.

**Codex and Copilot CLI** share root `AGENTS.md` and `.agents/skills/fallow`, which links the pinned dependency’s official instructions. Do not duplicate the task map or add per-agent hooks.

Agents use the same CLI: `npm run analyze` and `npm run analyze:changes`. No MCP server needed.

The **pre-commit hook** runs `fallow audit --staged` against HEAD for agent and manual commits. It blocks new findings; existing findings stay visible without blocking unrelated changes. Inspect failures with `npm run analyze:changes -- --staged`. Agents must run `npm run analyze:changes` before pushing; **no automatic pre-push or per-agent hook exists**. CI compares PRs with their base SHA and main pushes with the previous remote SHA.

Hooks are local, not branch protection. Without Fallow, the hook warns and skips; verify enforcement with the status command. When updating, retain the CLI/shared skill. Avoid `fallow agent install`, which regenerates a larger harness-specific integration.

References: [official Git hooks](https://fallow.tools/docs/cli/hooks/), [Copilot shared skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills).

