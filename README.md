# The Front-End Lab

**Front-End Chapter Day · Friday, 20 November 2026**

Choose a track, start small, then follow your curiosity. Each track has a **bootstrap** you can build on and **separate worked examples** you can experience, inspect or remix. Go solo or team up; bring a React project or use the shared lab.

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

Run `npm run demo:new` from the repository root. The Turborepo generator asks for an ID, track, title, author and description, creates your React demo, and registers it in the gallery automatically. Follow the [demo guide](playground/src/demos/template/README.md).

Contribute on your own Git branch and open a pull request. After merge, everyone pulls the latest version to see your demo. A contribution can be an interactive experiment, a tool walkthrough or evidence from a code-quality investigation. This chapter day uses React; existing React repositories remain welcome.

## Workspace layout

This is an npm-workspaces Turborepo with one app workspace, `playground/`. Root scripts run tasks through Turbo; the root `package-lock.json` is the only install lockfile. Demos remain React components inside the app, not separate packages.

- `npm ci` — install from the repository root.
- `npm run dev` — start the lab.
- `npm run demo:new` — generate and register a demo.
- `npm run check` — generator tests, app checks and build.
- `npm run test:browser` — optional browser verification.

No remote cache or external hosting is configured. `prototypes.danske.net` is out of scope for now.
