# C · Improve a developer workflow

Start with something that repeatedly costs you attention. The result can be an existing feature you discovered, a simpler command or a tiny script. A new tool is not a requirement.

## A ready-to-experience feedback loop

In the [playground](../playground/README.md), after setup:

```sh
npm run test:watch
```

Open `src/examples/art.ts` and `tests/art.test.ts`. Make a deliberate, local change to a range or rule, observe the feedback, then restore it or update the behaviour and its meaningful test together. Stop watch mode with Ctrl+C.

Compare that with a one-off `npm test` and the broader `npm run check`. Ask which feedback you need while exploring and which is useful before sharing. The kit already provides these commands; you do not need to build a task runner.

## Take it towards your own workflow

1. Name one recurring task and reproduce the friction in a project you can access.
2. Check existing scripts, editor features and tool documentation.
3. Choose one improvement: a focused test command, clearer error, shorter setup step, repeatable local report or automation of a repetitive task.
4. Compare before and after. Ask a peer to try it without explaining every step.

**Optional build destination:** Add a small local script that solves your selected task and a clear usage example. Keep it read-only initially if it inspects files; if it modifies files, try it on a disposable copy before using it on real work. Add a test for the meaningful failure case, not every line of glue.

## Mix with another journey

Use a finding from [code quality](quality.md) to identify a useful check. Or create a tiny UI for a workflow in [Experimental Projects](project.md). Avoid inventing a workflow problem just to justify a utility.

Share the original friction, your change, evidence that it helped and any limits. Use [findings](../FINDINGS.md). “The existing tool already does this” is a good outcome.
