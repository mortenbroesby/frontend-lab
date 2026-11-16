# B bootstrap · One question, evidence first

**You need:** an accessible codebase, editor and its usual tools. Use your own repository or the working `playground/` as a small fallback. Do not upload private source to an external service without permission.

## Start with the fallback

From the repository root:

```sh
cd playground
npm ci
npm ls --depth=0
npm explain d3-force
npm run check
```

This uses Node 24.x and npm. Expect a dependency list, an explanation of why D3 is installed, and passing checks. None of these outputs proves that a dependency is unused or that a codebase has no problems.

## Make your investigation

Copy these prompts into your own notes:

- **Question:** What do I want to understand? Pick one dependency, boundary, duplication or behaviour.
- **Evidence:** Which files, output or observed behaviour support the claim?
- **Alternative explanation:** Could tooling, dynamic loading or intentional design explain it?
- **Decision:** Leave it alone, investigate further or try one small change on your own branch.
- **Check:** What would demonstrate the change helped without breaking behaviour?

First action: follow `d3-force` from `package.json` to `src/examples/Constellation.tsx`, or follow `Workers.tsx` → `compute.worker.ts` → `compute.ts`. Write one observation before opening the [worked example](examples.md).

**Use your own repository:** replace these commands with its documented setup/checks. No need to copy the playground into it. If you choose automated analysis, record the tool/version/configuration and validate a few findings manually; an outdated dependency is not automatically harmful.

[Back to Track B](README.md)
