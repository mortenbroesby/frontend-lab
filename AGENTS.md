# The Front-End Lab

A self-directed React workshop for 20 November 2026: four tracks, small experiments and shared discoveries. Optimise for getting participants started independently.

## Working principles

- Keep one Vite/React/TypeScript app in `playground/`, managed by npm workspaces and Turborepo. No package per demo or unnecessary infrastructure.
- Keep bootstraps separate from finished examples. Demos own their state, scoped styles and cleanup; adding one should not require editing the app shell.
- Use `npm run demo:new`. Require a name first; preserve ID validation, overwrite protection and registry registration.
- Prefer existing code and browser APIs. Preserve accessibility, error handling and resource cleanup.
- Keep this repository participant-focused. Prepare for internal GitHub Enterprise Cloud and opt-in GitHub Pages hosting. Keep destination links configurable; use the Front-End Lab theme without requiring Sapphire.

## Delivery

- Use Node 24 and the root npm lockfile. Run `npm ci` and `npm run check` from the root; UI/browser changes also require `npm run test:browser`.
- Preserve unrelated work. Commit and push completed scoped changes; report verification and remaining limits accurately.
- Keep documentation concise and follow the existing README style. Link to canonical guides instead of duplicating them here.

## References

- [README](README.md): tracks, quick start and contribution workflow.
- [App guide](playground/README.md): architecture, commands and troubleshooting.
- [Demo guide](playground/src/demos/template/README.md): generator and registration contract.
- [Verification](playground/VERIFICATION.md): evidence and known limits.

---

<!-- fallow:setup-hooks:start -->
## Fallow checks

Use fallow for code-quality, cleanup, and setup tasks in this repository. Fallow checks the changed code before each `git commit` and `git push`. In Claude Code and Codex, a PreToolUse hook from `fallow agent install` runs this check and blocks the command when the verdict is `fail`. Other agents run the check themselves: `fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before you try again. A JSON runtime error such as `{ "error": true, ... }` does not block.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `[audit] gate = "all"` in `fallow.toml` to gate every finding in changed files.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to... | Run |
|---|---|
| delete an "unused" export or file | `fallow dead-code --trace <file>:<export>` |
| prove a TypeScript symbol's exact consumers before refactoring | `fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>` |
| find how one module reaches another | `fallow trace --path <from> <to>` (Reports `reachable: false` instead of failing when no import path exists; type-only hops are reported, not skipped.) |
| delete an "unused" dependency | `fallow dead-code --trace-dependency <name>` |
| migrate a dependency | `fallow trace --dependency <name> --sites` (Counts each imported name, follows one hop through project wrappers, and counts each use that it cannot resolve.) |
| commit or open a PR | `fallow audit --base <ref>` |
| read a diff before approving it | `fallow review --base <ref> --brief` (orientation, never gates: deterministic and always exit 0, unlike the audit row) |
| prioritize refactoring | `fallow health --hotspots --targets` |
| ask who owns code | `fallow health --ownership` |
| check untested-but-reachable code | `fallow health --coverage-gaps` |
| improve or check the tests of a change | `fallow mutation --plan --base <ref>` (The plan runs no code. Without `--plan`, the command runs the project tests against each mutant, so ask the user first.) |
| consolidate duplication | `fallow dupes --trace dup:<fingerprint>` |
| find feature flags | `fallow flags` |
| check which architecture rules apply to a file before changing it | `fallow guard <files>` |
| check import cycles, boundaries and policy rules after changing code | `fallow architecture` |
| surface security candidates | `fallow security` |
| understand a finding | `fallow explain <issue-type>` |
| scope a monorepo | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command) |
<!-- fallow:setup-hooks:end -->
