# The Front-End Lab

A self-directed React gallery: four tracks, small experiments and shared discoveries. Optimise for getting participants started independently.

## Scope and simplicity

- This is a workshop demo repository, not a production application or a future-proof platform. Optimise for a clear idea participants can run, change and understand today.
- Preserve the core: standalone npm demo packages, a metadata-driven gallery, one generator and shared tooling. Add infrastructure only when the current demo needs it.
- No legacy support or backwards compatibility. When changing a contract, update its current callers and delete the old path; do not add aliases, adapters, migration layers or dual modes to preserve obsolete behaviour.
- Prefer deletion, direct code and existing browser APIs. Avoid speculative abstractions, configuration options, framework layers and production hardening without a concrete demo requirement.
- Keep basic accessibility, safe input handling and resource cleanup. Simplicity is not a reason to expose secrets or leave broken interactions.

## Working principles

- Keep the gallery in `gallery/` and independently runnable demo workspaces in `demos/<id>/`, managed by npm workspaces and Turborepo. Every demo is standalone; the gallery only reads metadata and links to apps. Share the toolchain; each demo owns its entry page and build output.
- Keep bootstraps separate from finished examples. Demos own their state, scoped styles and cleanup; adding one should not require editing the app shell.
- Use `npm run demo:new`. Require a name first; preserve ID validation, overwrite protection and typed folder discovery.
- Prefer existing code and browser APIs. Preserve accessibility, error handling and resource cleanup.
- Keep this repository participant-focused. Prepare for an internal GitHub Enterprise Cloud repository. Use the Front-End Lab theme without requiring Sapphire. Keep temporary hosting out of participant instructions and links; the app must work locally or on any host. Deployment settings belong in docs/hosting.md.

## Delivery

- Use Node 24 and the root npm lockfile. Install only when dependencies need it.
- Verification should be bounded and proportional. Use a focused existing test, type check or build to answer a concrete question; do not add extensive suites, coverage targets, exhaustive matrices or repeated checks for routine demo changes. Documentation and mechanical edits usually need no new tests.
- Add a small test only when it proves an important point or protects nontrivial demo logic. `npm run check` is the available combined logic/type/build check, not a requirement to rerun every check for every edit.
- There are no browser tests or browser-test infrastructure for now. Do not reintroduce them unless explicitly requested; a later browser-testing demo should be scoped as its own demo.
- Report what was checked and what remains untested without turning demo delivery into production acceptance.
- Preserve unrelated work. Commit and push completed scoped changes; report verification and remaining limits accurately.
- Keep documentation concise, participant-focused and free of event dates or schedules. Follow the existing README style. Author participant pages in `gallery/src/content/*.mdx` and track subfolders. Embed starters beside instructions; keep finished examples separate. MDX is trusted app code, never remote or user-supplied content. The README is a local entry point, not a directory of guide files or hosted URLs.

## References

- [README](README.md): tracks, quick start and contribution workflow.
- [App guide](gallery/README.md): architecture, commands and troubleshooting.
- [Demo guide](gallery/src/content/create-demo.mdx): generator and registration contract.
- [Verification](gallery/VERIFICATION.md): evidence and known limits.

## Fallow

Codex and Copilot CLI share `.agents/skills/fallow`. Use its installed-version instructions for analysis. Run `npm run analyze:changes` before commits and pushes; resolve introduced findings. The official Git hook audits staged changes, and CI audits PRs. See [the Fallow guide](gallery/src/content/tracks/code-quality/fallow.mdx) for setup. Use the CLI directly; keep one shared skill, no repository MCP server entries and no per-agent hook scripts.
