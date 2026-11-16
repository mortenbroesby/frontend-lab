# Choose your own journey

This is an optional exploration kit, not a course to complete. Try a working example, build towards it from a blank component, borrow one piece, or bring your own project. Solo work and groups are equally welcome.

## Start in the way that suits you

| I want to… | Start here |
| --- | --- |
| Play with something immediately | Run the [playground](playground/README.md), then remix the SVG, compare a Worker or exchange signals between tabs |
| Build towards an example myself | Read a [journey](#journeys), then work in `playground/src/YourLab.tsx`; use the finished examples only when you want a hint |
| Assemble my own experiment | Combine one **interest**, one **capability** and one **question** below; there is no required order |
| Improve a real project | Bring your repository to the quality or tooling journey; the playground is an optional small fallback |
| Use another technology | Keep your existing setup; use the questions, references and findings template without installing this kit |

## Assemble a route

1. **Pick an interest:** visual play, responsive interfaces, communication, codebase health, workflow friction, or an idea of your own.
2. **Pick one small first result:** a drawing, a message, a result without a frozen UI, a validated finding, a faster feedback loop.
3. **Choose your depth:** experience the example → rebuild a small version → change a rule → combine ideas. Stop or branch whenever you learn something interesting.
4. **Leave evidence:** a demo, a before/after observation, source link or screenshot. Use [FINDINGS.md](FINDINGS.md).

Example combinations, not assignments:

- Generative SVG + Worker → move a larger pattern calculation off the main thread.
- SVG + local signals → let a second tab control a palette; discuss what changes across laptops.
- Your idea + code-quality investigation → map the boundaries before and after adding a feature.
- A real repetitive task + test watch mode → make one improvement and ask someone to try it.

## Journeys

- [A · Explore a browser capability](journeys/browser.md): creative visuals, background work and local communication, with wider API directions.
- [B · Investigate code quality](journeys/quality.md): use this real, small project or your own; findings are not automatically defects.
- [C · Improve a developer workflow](journeys/tooling.md): a working feedback loop and a real problem to improve.
- [D · Make an experimental project](journeys/project.md): shape your own idea, with examples as optional destinations.

The working examples are deliberately small. They do not cover every browser API, provide a backend or simulate a production architecture. Track titles are areas of interest, not restrictions on combining ideas.

## What is provided

One independent Vite + React + TypeScript app, plain CSS, three working examples, a separate `YourLab.tsx` starting point, a lockfile, small logic tests and optional browser checks. No account, cloud resource, API key, external font or backend is needed to run it locally. Internet is required for the initial package installation; browser examples then run locally.

See [verification](VERIFICATION.md) for tested behaviour and remaining limitations. Participants can add discoveries and setup tips to the whiteboard when its link is available; no whiteboard is required to start.
