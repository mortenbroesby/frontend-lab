---
name: fallow
description: Use Fallow to investigate unused code, duplication, complexity and architecture, or audit changed JavaScript/TypeScript before committing.
---

# Fallow

Read `node_modules/fallow/skills/fallow/SKILL.md` directly; search tools often skip ignored `node_modules`. A missing search result does not mean the file is absent. If a direct read confirms it is missing, install with `npm ci` only when the task permits dependency installation; otherwise report the limitation.

Use `npm run analyze -- <command>`; check flags with `--help`. Validate findings and preview fixes before editing. Run `npm run analyze:changes` before commits/pushes; resolve introduced findings. The Git hook audits staged changes; CI audits PRs and main pushes.

Repository setup: `gallery/docs/fallow.md`. Participant investigation: `gallery/src/content/tracks/code-quality/fallow.mdx`. Use this shared skill and AGENTS.md for Codex and Copilot CLI. No per-agent hooks or duplicate task maps.

Repository settings: `.fallowrc.json`. Run `npm run analyze:baseline` to compare the whole repo with the committed snapshot. See `.baselines/README.md` before refreshing it.
