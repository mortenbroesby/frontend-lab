# Skill validation

Run after changing a skill's trigger, workflow or referenced contract. Use a fresh client session in this repository with read-only tools. Do not grant edits, shell execution or remote writes just to test discovery. These are manual scenarios, not an added test framework.

## Probe

Ask without naming a skill:

> Read-only skill validation. For each scenario, load applicable project skills and report paths, concrete first steps and constraints: restyle cross-tab-messaging; add a standalone demo called Pointer Playground; fix a Fallow regression without changing baselines. Distinguish skills initially listed in your context from files found by searching. Do not perform the scenarios, edit, install or write remotely.

| Scenario | Expected evidence |
| --- | --- |
| Restyle a demo | Loads lab-ui; reuses individual @lab/ui exports and tokens; preserves standalone operation, accessibility and scoped styles; plans actual browser verification. |
| Add a demo | Loads develop-demo; uses the named generator and typed discovery; no manual registry or cross-demo imports. |
| Fix Fallow regression | Loads fallow and its installed instructions; investigates findings; no baseline refresh or weakened checks. |

For the new skills, also ask how to investigate a failing main-branch Actions run and how to find the Button component API. Expect lab-ci plus lab-debugging for the former, and lab-storybook with discovered IDs for the latter.

Record client version, source revision, discovered versus explicitly loaded skills, observations and limits. A correct proposed workflow is a discovery/planning smoke check, not proof that an agent executes it correctly. For an execution evaluation, use a disposable checkout, a concrete requested change and inspect its diff and actual checks; never inject regressions into main for validation.

## Initial evidence

On source revision `8bd2746`, fresh Codex CLI `0.162.0-alpha.2` and Copilot CLI `1.0.112` sessions both reported the three expected skills in their initial catalog and read their project instructions. Both proposed workflows preserving UI reuse, generated standalone demos and Fallow baselines. Neither executed the proposed changes.

Copilot's search skipped the ignored installed Fallow instructions and reported them missing; Codex read them successfully. The Fallow wrapper now explicitly requires a direct read before declaring them absent. This illustrates why discovery and instruction-following need separate evidence.

Installed Storybook `10.6.7` returned 31 component entries and 59 stories through local tools. Component discovery works without an MCP server or dependency changes. Generated prop metadata is partial; source inspection remains necessary for complete types.

Follow-up probes against the new skills confirmed Codex catalog discovery for `lab-ci`, `lab-debugging` and `lab-storybook`, then successful instruction reads and the expected exact-SHA, authorisation and discover-before-lookup workflows. The first follow-up prohibited all shell commands and therefore prevented Codex from reading files; the corrected probe allowed local file reads only. Copilot loaded `lab-ci`, `lab-storybook` and `fallow`; its direct read of the installed Fallow instructions succeeded after the wording change.

The root Storybook wrapper also returned Button documentation using the discovered `actions-button` ID. The installed CLI returned the `actions-button--default` story. No agent performed a code-change scenario or repaired a live CI failure during these probes; those execution outcomes remain untested.
