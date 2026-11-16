# Developer Experience & Tooling

For you if repeated setup, unclear commands or slow feedback gets in the way of working on React projects.

**You need:** Your existing project tools, or Node 24 and an editor for the standalone script route. That route needs no npm install or app server.

## Get a first result

[Start with real friction](bootstrap.md). Name a task you repeat, try the existing command or feature first, then make one small improvement only if needed.

**Success check:** Repeat the original task and show what became clearer or simpler. For a script change, its output matches your intended observation and its test passes.

## Explore further

Choose a problem you actually encounter; each route can stop after one useful discovery:

| Starting point | Try one small improvement | Optional stretch |
| --- | --- | --- |
| Test feedback | From `playground/` after the root install, run `npm run test:watch`. Change relevant code or a test, observe the result, then restore any deliberate failure. Compare this loop with your usual full check. | Find the smallest meaningful test selection in your own project and document when the full suite is still needed. |
| Build performance | From the repository root after installation, run `npm run build` twice. Read Turbo’s cache/task output; distinguish a build from a cache hit. | Change a relevant source file, rebuild and explain invalidation. Record conditions before claiming a speedup. |
| Local development friction | Use the app’s [troubleshooting guide](../../playground/README.md#troubleshooting) to investigate one actual setup problem: runtime, access, port or confusing error. Write the shortest reproducible fix. | Have a peer follow the fix without coaching and revise the unclear step. |
| Workflow automation | Start with `npm run` to discover project commands. If you still need a specific observation, adapt the [read-only script starter](bootstrap.md) and its test. | Handle one real edge case, or replace a script with a native feature that already solves the task. |

Use your own project’s equivalent commands where appropriate. Stop the watch process with Ctrl+C; keep deliberate failures out of your contribution. A useful command or clearer instruction can be the whole result.

The [command inventory example](examples.md) is a completed reference, independent of the starter. Compare it with `npm run` before deciding another script is worthwhile.

## Show what you discovered

Demonstrate the original friction and your improved workflow. State what you observed and one limit; do not claim time saved without measuring it.

Capture a few [findings](../findings.md), then use the [contribution guide](../../CONTRIBUTING.md) to share code or notes. You may build towards a reference or pursue your own idea.

[Choose another track](../../README.md#tracks)
