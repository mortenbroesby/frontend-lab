---
name: lab-debugging
description: Investigate a reproducible bug, failing check or unexpected demo behaviour before changing code. Use for failed builds, local checks and regressions.
---

# Debug a Lab failure

This repository runs checks locally. When a hosted build fails, identify the provider, commit and first failing command before reproducing it.

1. State expected versus observed behaviour and one checkable success condition. Capture the failing command or interaction, revision and relevant working-tree changes. Read the full first useful error; downstream failures may be consequences.
2. Reproduce with the smallest existing check. Trace the relevant caller, input and implementation; compare a working example and recent changes. For browser failures, inspect console/network evidence and the actual interaction with existing browser tools.
3. State one hypothesis and what evidence would disprove it. Test that hypothesis before editing several things. After two uninformative attempts, reassess the cause and missing evidence instead of layering speculative fixes.
4. Make the smallest correction. For nontrivial logic, first add a focused failing test using existing tools. Do not manufacture tests for copy or mechanical edits. Preserve accessibility, resource cleanup and standalone demo boundaries.
5. Rerun the failing check, then affected checks from AGENTS.md and the Fallow audit. Do not weaken checks or refresh baselines to make a regression disappear. Reuse completed evidence when its inputs remain unchanged; distinguish a running check from a passing one.
6. Report cause, correction, evidence and remaining uncertainty. A build is not browser verification; a push is not a successful remote check. Keep investigation notes in the task unless a lasting decision belongs in the repository.

This is a local workflow informed by [Superpowers systematic debugging](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md), not an installation of its framework or companion skills. Repository and user instructions govern scope and permissions.
