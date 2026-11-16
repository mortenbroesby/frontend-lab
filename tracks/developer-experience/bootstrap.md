# Developer Experience & Tooling bootstrap · A script, an observation, a test

**You need:** Node 24.x and an editor. No npm install, dependencies or running browser app.

First name a recurring annoyance in your actual workflow and what would improve it. Try an existing feature before writing code: for unclear project commands, `npm run` already lists scripts. If that solves the problem, record the command and show a peer; you have a first result.

If a small script would help, create a [contribution branch](../../CONTRIBUTING.md), then try this independent starter from the repository root:

```sh
node tracks/developer-experience/bootstrap/inspect.mjs playground/package.json
node --test tracks/developer-experience/bootstrap/inspect.test.mjs
```

Expect `Project: front-end-lab-playground` and two passing tests. [inspect.mjs](bootstrap/inspect.mjs) only reads the named file and identifies the project. It does not contain the finished command-inventory solution.

**Your first change:** decide one useful observation about a project you work on, then change `describeProject` and its test. You can pass another package.json path (quote paths containing spaces). It never runs commands from that file.

**Success check:** run the script on a real manifest and compare its output with the field you intended to report. Its updated test should pass, including the existing invalid-input case. Explain how that observation helps the original task.

For continuous feedback:

```sh
node --test --watch tracks/developer-experience/bootstrap/inspect.test.mjs
```

Stop with Ctrl+C. Keep this starter on your own branch or copy its two files into your project. The [finished example](examples.md) is independent, so editing your starter will not break it.

**Before growing it:** state the friction, check whether existing tools already solve it, and decide what would demonstrate improvement. Prefer read-only output before considering file changes.

[Back to Developer Experience & Tooling](README.md)
