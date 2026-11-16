# The Front-End Lab

A self-directed React workshop for 20 November 2026: four tracks, small experiments and shared discoveries. Optimise for getting participants started independently.

## Working principles

- Keep one Vite/React/TypeScript app in `playground/`, managed by npm workspaces and Turborepo. No package per demo or unnecessary infrastructure.
- Keep bootstraps separate from finished examples. Demos own their state, scoped styles and cleanup; adding one should not require editing the app shell.
- Use `npm run demo:new`. Require a name first; preserve ID validation, overwrite protection and typed folder discovery.
- Prefer existing code and browser APIs. Preserve accessibility, error handling and resource cleanup.
- Keep this repository participant-focused. Prepare for an internal GitHub Enterprise Cloud repository. Keep source links configurable; use the Front-End Lab theme without requiring Sapphire. Hosting is deferred.

## Delivery

- Use Node 24 and the root npm lockfile. Run `npm ci` and `npm run check` from the root; UI/browser changes also require `npm run test:browser`.
- Preserve unrelated work. Commit and push completed scoped changes; report verification and remaining limits accurately.
- Keep documentation concise and follow the existing README style. Link to canonical guides instead of duplicating them here.

## References

- [README](README.md): tracks, quick start and contribution workflow.
- [App guide](playground/README.md): architecture, commands and troubleshooting.
- [Demo guide](playground/src/demos/template/README.md): generator and registration contract.
- [Verification](playground/VERIFICATION.md): evidence and known limits.

## Fallow

Codex and Copilot CLI share `.agents/skills/fallow`. Use its installed-version instructions for analysis. Run `npm run analyze:changes` before commits and pushes; resolve introduced findings. The official Git hook audits staged changes, and CI audits PRs. See [the Fallow guide](tracks/code-quality/fallow.md) for setup. Keep one shared skill and no per-agent hook scripts.
