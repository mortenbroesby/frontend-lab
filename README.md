<h1 align="center">🧪 The Front-End Lab</h1>

<p align="center">
  Four tracks. Different challenges. One day to experiment, learn and build.
</p>

<p align="center">
  <strong>Front-End Chapter Day · Friday, 20 November 2026</strong>
</p>

<p align="center">
  <img alt="Node 24.x" src="https://img.shields.io/badge/node-24.x-6366f1">
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178c6">
  <img alt="Turborepo" src="https://img.shields.io/badge/Turborepo-0f172a">
</p>

<p align="center">
  <a href="#start-here">Start here</a>
  <span> | </span>
  <a href="#tracks">Choose a track</a>
  <span> | </span>
  <a href="#create-a-demo">Create a demo</a>
  <span> | </span>
  <a href="#documentation">Documentation</a>
</p>

---

## 🔬 Follow Your What If

The Front-End Lab brings front-end engineers from different squads together
for a day of hands-on exploration. Pick a track, team up or go solo, and
build something that sparks your curiosity.

Explore a working example, rebuild one small part, change a rule or follow
your own idea. This chapter day focuses on **React**. A useful discovery or
an unfinished experiment is a worthwhile outcome.

<a id="start-here"></a>
## 🚀 Start Here

You need **Node.js 24.x**, npm and access to this private repository.
The workspace pins npm 11.6.2; `nvm use` selects Node 24 if you use nvm.

Copy this repository’s SSH URL from **Code → SSH** (including after the internal move), then replace the placeholder:

```sh
git clone <SSH-URL-FROM-THIS-REPOSITORY> frontend-chapter-day
cd frontend-chapter-day
npm ci
npm run dev
```

Open the address printed by Vite. Choose a track, try a reference demo, then
use **Create a demo** when you are ready to build. All commands above run
from the repository root.

Already cloned it? Start with `npm ci`. For access, environment or browser
issues, see [setup and troubleshooting](playground/README.md).

<a id="tracks"></a>
## 🧭 Choose a Track

| Track | Explore | Starting point |
| --- | --- | --- |
| [🌐 A · Modern Web Capabilities](tracks/a/README.md) | Browser APIs, visuals, computation and communication | D3 constellation, SVG, Workers and tab messaging |
| [🔍 B · Code Quality & Maintainability](tracks/b/README.md) | Dependencies, complexity, architecture and test confidence | Investigate this app or an existing React codebase |
| [🛠️ C · Developer Experience & Tooling](tracks/c/README.md) | Faster feedback and less everyday workflow friction | A small Node script and a worked command inventory |
| [🚀 D · Experimental Projects](tracks/d/README.md) | Games, visual stories, art, quizzes and your own ideas | Generative postcard or a fresh React demo |

Each track has a short **bootstrap guide** and separate **worked examples**.
Follow your curiosity; there is no required sequence. Track B can use an
existing codebase, and Track C's script starter runs with Node alone.

<a id="create-a-demo"></a>
## 🛠️ Create a Demo

From the repository root:

```sh
npm run demo:new
```

**Give your demo a name first.** There is no default name, and blank names
are rejected. The generator suggests an editable folder/URL ID, then asks
for your track, author or group, and a short description.

It creates your React component and findings README under
`playground/src/demos/<id>/`, and adds the demo to the shared gallery.
The demo name appears in the gallery, the starter and its README.

For example, with all answers supplied:

```sh
npm run demo:new -- --args "Chapter Quiz" chapter-quiz d "Your team" "Test your browser knowledge"
```

Open `#/demo/chapter-quiz` at your local server address and edit the generated
`Demo.tsx`. Vite updates the page as you work. Existing demo IDs and folders
are protected from overwrites. See the [demo guide](playground/src/demos/template/README.md)
for the full workflow and manual alternative.

## ✨ What You Get

- 🧭 **Four self-directed tracks** — short guides and room to choose your own challenge.
- 🎨 **Working references** — D3, SVG, Workers, local messages and practical investigations.
- 🧩 **Independent React demos** — local state and a shared gallery, with demos loaded when opened.
- ⚡ **A quick bootstrap** — one command creates and registers your named experiment.
- 🤝 **A shared collection** — contribute through Git so everyone can explore the results.

## 🤝 Share What You Discover

Work on your own branch, make a small experiment, and open a pull request.
Include what someone can try and what you learned. After merge, others pull
the latest version to see your contribution in the gallery.

A contribution can be interactive, a tool walkthrough or evidence from a
code-quality investigation. Use the [findings template](tracks/findings.md)
to capture your question, what you tried and one surprise.

**Show & tell:** 13:00 for India, with anyone ready welcome to present;
14:30–15:00 for Denmark and wrap-up. All times are Danish local time.

## 🏢 Internal Chapter Workspace

The app is prepared for an internal GitHub Enterprise Cloud repository and GitHub Pages. Follow the [migration guide](docs/internal-migration.md) to configure team access, source links and private Pages hosting. Deployment is disabled until `PAGES_ENABLED` is set to `true` in the destination repository.

Everyone contributes on a branch in the shared repository; see [CONTRIBUTING.md](CONTRIBUTING.md) for the complete journey.

## 🧱 Project Structure

```text
frontend-chapter-day/
├── playground/              # Vite + React + TypeScript app
│   └── src/
│       ├── app/             # Shell, track pages and navigation
│       ├── demo-registry.ts # Gallery entries and lazy imports
│       ├── demos/           # Shared template and participant demos
│       └── examples/        # Working reference experiments
├── tracks/                  # Bootstrap guides, examples and findings
├── turbo/generators/        # Demo generator and its tests
├── turbo.json               # Workspace tasks and local caching
└── package-lock.json        # One root npm lockfile
```

Turborepo coordinates one app workspace, `playground/`. Demos stay small
React components inside that app. The shell handles navigation, loading and
render-error feedback; each demo owns its behaviour and cleanup.

## 🧪 Development and Verification

Run these from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the lab with fast refresh |
| `npm run demo:new` | Create and register a named React demo |
| `npm run fallow:setup` | Install/update official agent skills, MCP and agent hooks |
| `npm run fallow:hooks` | Install the local Git pre-commit hook once per clone |
| `npm run fallow:status` | Inspect agent and Git hook installation |
| `npm run analyze` | Explore code health with Fallow ([walkthrough](tracks/b/fallow.md)) |
| `npm run check` | Run generator tests, app checks and the production build |
| `npm run build` | Build the app through Turbo |
| `npm run preview` | Serve the built app locally |
| `npm run test:browser` | Run the optional browser journeys |

Fallow agent trust and per-clone hook setup are explained in the [integration guide](tracks/b/fallow.md#set-up-agents-and-commit-checks).

Browser tests require the [documented browser setup](playground/README.md).
See [verification evidence and limits](playground/VERIFICATION.md) for what
has been checked; independent participant setup and other operating systems
still need validation.

<a id="documentation"></a>
## 📚 Documentation

- [App setup, architecture and troubleshooting](playground/README.md)
- [Create and contribute a demo](playground/src/demos/template/README.md)
- [Modern Web Capabilities](tracks/a/README.md)
- [Code Quality & Maintainability](tracks/b/README.md) and [Fallow walkthrough](tracks/b/fallow.md)
- [Developer Experience & Tooling](tracks/c/README.md)
- [Experimental Projects](tracks/d/README.md)
- [Findings and show-and-tell prompts](tracks/findings.md)
- [Technical verification](playground/VERIFICATION.md)

## 🙏 Acknowledgements

- React, TypeScript, Vite and Turborepo for the shared lab foundation.
- D3 and the browser platform for experiments worth taking apart.
- Everyone in the chapter who brings a question, shares a discovery or helps a colleague get started.

---

## 👤 Author

**Morten Broesby-Olsen** (mortenbroesby)

- GitHub: [@mortenbroesby](https://github.com/mortenbroesby)
- LinkedIn: [mortenbroesby](https://www.linkedin.com/in/morten-broesby-olsen/)

---

<p align="center">
  Made with ☕ and ⚡️ by Morten Broesby-Olsen
</p>
