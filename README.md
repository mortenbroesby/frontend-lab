# The Front-End Lab

**Front-End Chapter Day · Friday, 20 November 2026**

Choose a track, start small, then follow your curiosity. Each track has a **bootstrap** you can build on and **separate worked examples** you can experience, inspect or remix. Go solo or team up; your own repository and technologies are welcome.

## Choose a track

| Track | Bootstrap | Worked example |
| --- | --- | --- |
| [🌐 A · Modern Web Capabilities](tracks/a/README.md) | One browser interaction in a minimal app | Interactive D3 idea constellation; additional browser examples |
| [🔍 B · Code Quality & Maintainability](tracks/b/README.md) | A repeatable investigation in your repo or our sample | Evidence, a confidence gap, a false-positive concern and a small test improvement |
| [🛠️ C · Developer Experience & Tooling](tracks/c/README.md) | A small Node script and test | A read-only command inventory, its tests and trade-offs |
| [🚀 D · Experimental Projects](tracks/d/README.md) | A clean creative page with one visible interaction | A generative postcard with controls and SVG export |

## Get started

**Shared lab app (all tracks):** with Node.js 24.x and npm, from this repository root:

```sh
cd playground
npm ci
npm run dev
```

Open the printed address. Choose a track, experience its reference demos, then choose **Create a demo** for a minimal bootstrap. All tracks share one app and toolchain; the template contains no finished solution. [Setup and troubleshooting](playground/README.md).

**B:** open the [investigation bootstrap](tracks/b/bootstrap.md). Bring a codebase or inspect the actual playground as a small fallback; no specially broken app is needed.

**C:** open the [script bootstrap](tracks/c/bootstrap.md). It runs with Node 24.x, without installing packages or starting an app server.

## Choose your next step

Experience an example → rebuild one small part → change a rule → combine ideas. Or skip the examples and follow your own question. There is no required sequence or production-ready outcome.

Keep a demo, observation or useful failed attempt. The optional [findings template](tracks/findings.md) helps you record what you learned.

## Add your work to the shared gallery

Copy `playground/src/demos/template` into your own demo folder and add one entry to `playground/src/demo-registry.ts`. The app discovers your entry in the gallery and its track page. Follow the [copy-and-register guide](playground/src/demos/template/README.md).

Contribute on your own Git branch and open a pull request. After merge, everyone pulls the latest version to see your demo. A contribution can be an interactive experiment, a tool walkthrough or evidence from a code-quality investigation. Your own technologies and repositories remain welcome.
