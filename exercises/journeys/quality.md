# B · Investigate code quality

Use a repository you know or this kit's small real [playground](../playground/README.md). No planted defects or prepared broken app are needed. There may be no worthwhile change to make; an evidence-backed finding is still useful.

## Pick one question

- Which direct dependencies exist, and why?
- Where do UI, browser communication and pure computation meet?
- What changes if I add another experiment?
- Which behaviour is tested, and what important uncertainty remains?
- Would automated debt discovery save effort or mostly produce noise here?

## First investigation: the dependency story

From `exercises/playground`, after `npm ci`:

```sh
npm ls --depth=0
npm explain react
```

Read `package.json`, follow an import to its use, and distinguish runtime packages from development tools. `npm ls` reports the installed graph; it does **not** prove whether a dependency is unused or vulnerable. Outdated is not synonymous with harmful. Removing a package is optional: first explain what would break and how you would check it.

## Another route: map a boundary

Trace `Workers.tsx` → `compute.worker.ts` → `compute.ts`. Compare that with the main-thread path. Sketch the boundary, consider cancellation/error handling, and ask whether a future experiment could stay independent. Verify assumptions in code rather than applying an architecture pattern by default.

## Optional automated analysis

Fallow is an investigation candidate from the workshop brief; first verify which tool/project is intended and consult its current official documentation. It is not installed or validated by this kit. [Knip's getting-started guide](https://knip.dev/overview/getting-started) is another optional reference for investigating unused files, exports and dependencies. Neither is mandatory.

If you choose a tool, note its version/configuration, understand whether it runs locally or uploads source, and validate a small sample of findings against actual use. Do not upload private code without permission. Use your own branch for any experimental configuration or fixes; keep the initial evidence.

## What could you share?

A dependency explanation, a boundary diagram, one validated finding or a comparison of useful findings versus false positives. Record uncertainty and a practical next step in [findings](../FINDINGS.md). Avoid turning “improve quality” into an open-ended rewrite.
