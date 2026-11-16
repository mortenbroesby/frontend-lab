---
name: fallow
description: Use Fallow to investigate unused code, duplication, complexity and architecture, or audit changed JavaScript/TypeScript before sharing.
---

# Fallow

Read `node_modules/fallow/skills/fallow/SKILL.md` from the repository root for the official, installed-version instructions. Use `npm ci` if it is missing.

Run the pinned CLI via `npm run analyze -- <command>`. Check current flags with `--help`. Validate findings before edits; preview automatic fixes first. Before committing or pushing, run `npm run analyze:changes` and resolve introduced findings. The shared Git pre-commit hook audits staged changes; PRs also run an audit in CI.

Setup and worked examples: `playground/src/content/tracks/code-quality/fallow.md`. Keep agent configuration limited to Codex and Copilot CLI, with this shared skill and AGENTS.md. Do not regenerate per-agent hook scripts or duplicate task maps.
