# Skill validation

For discovery checks after changing a skill’s trigger, use a fresh client session with read-only tools. Do not grant edits, shell execution or remote writes just to test discovery. These are manual scenarios, not an added test framework.

## Probe

Ask without naming a skill:

> Read-only skill validation. For each scenario, load applicable project skills and report paths, concrete first steps and constraints: restyle cross-tab-messaging; add a standalone demo called Pointer Playground; fix a Fallow regression without changing baselines. Distinguish skills initially listed in your context from files found by searching. Do not perform the scenarios, edit, install or write remotely.

| Scenario | Expected evidence |
| --- | --- |
| Restyle a demo | Loads lab-ui; reuses individual @lab/ui exports and tokens; preserves standalone operation, accessibility and scoped styles; plans actual browser verification. |
| Add a demo | Loads develop-demo; uses the named generator and typed discovery; no manual registry or cross-demo imports. |
| Fix Fallow regression | Loads fallow and its installed instructions; investigates findings; no baseline refresh or weakened checks. |

Also ask how to investigate a failing local build and find the Button API. Expect lab-debugging for the build and lab-storybook for component discovery.

Record client version, source revision, discovered versus explicitly loaded skills, observations and limits. A correct proposed workflow is a discovery/planning smoke check, not proof that an agent executes it correctly. For an execution evaluation, use a disposable checkout, a concrete requested change and inspect its diff and actual checks; never inject regressions into main for validation.

## Demo execution check

After a generator or demo workflow change, use a fresh disposable worktree per client at the same revision. Install dependencies with the pinned npm, and confirm that the client’s own shell sees that version. Give each client this task:

> Create a standalone demo named Pointer Playground with one accessible interaction. Verify the standalone build and automatic gallery discovery. Work only in this worktree, leave the diff for review, and stop any preview you start.

Inspect the tool transcript for a successful generator command. Verify the changed paths, the demo’s standalone build, its title in the gallery registry bundle and its HTML in the gallery build. Record independent results for each client. Remove only the disposable worktrees after recording the evidence.

## Initial evidence

On source revision `8bd2746`, fresh Codex CLI `0.162.0-alpha.2` and Copilot CLI `1.0.112` sessions both reported the three expected skills in their initial catalog and read their project instructions. Both proposed workflows preserving UI reuse, generated standalone demos and Fallow baselines. Neither executed the proposed changes.

Copilot's search skipped the ignored installed Fallow instructions and reported them missing; Codex read them successfully. The Fallow wrapper now explicitly requires a direct read before declaring them absent. This illustrates why discovery and instruction-following need separate evidence.

Installed Storybook `10.6.7` returned 31 component entries and 59 stories through local tools. Component discovery works without an MCP server or dependency changes. Generated prop metadata is partial; source inspection remains necessary for complete types.

Follow-up probes against the new skills confirmed Codex catalog discovery for `lab-ci`, `lab-debugging` and `lab-storybook`, then successful instruction reads and the expected exact-SHA, authorisation and discover-before-lookup workflows. The first follow-up prohibited all shell commands and therefore prevented Codex from reading files; the corrected probe allowed local file reads only. Copilot loaded `lab-ci`, `lab-storybook` and `fallow`; its direct read of the installed Fallow instructions succeeded after the wording change.

The root Storybook wrapper also returned Button documentation using the discovered `actions-button` ID. The installed CLI returned the `actions-button--default` story. No agent performed a code-change scenario or repaired a live CI failure during these probes; those execution outcomes remain untested.

## Pointer Playground execution results

Tested at `117a042` in separate disposable worktrees with Codex CLI 0.162.1 and Copilot CLI 1.0.112. Both received the same named-demo task.

| Run | Observed result |
| --- | --- |
| Codex | Recovered from a login shell selecting the wrong npm, passed the title directly to the generator and linked the workspace. The standalone build passed. A separate browser check opened the generated gallery card and activated the target, increasing the counter to one. |
| Copilot, original skill | Loaded the skill. Its non-interactive shell policy rejected the piped prompt. It wrote the scaffold manually and passed its build checks. This missed the generator criterion. |
| Copilot, revised demo skill | With the same permissions and task, ran the documented named-generator command. Standalone typecheck and build passed. A separate browser check opened the discovered card, focused the pad and pressed Enter. The demo announced keyboard activation and centered the marker. |

Inspect lockfile changes after linking a workspace. The successful Copilot retry also produced optional dependency metadata beyond the new workspace links. The trial demos and lockfile changes stayed in their disposable worktrees.
