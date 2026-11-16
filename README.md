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

1. **[Choose a track](#tracks)** based on the question you want to explore. Its guide gives you a first result and a success check.
2. **Set up only what you need.** For the shared gallery, follow the commands below. Code Quality & Maintainability can use an existing repository; Developer Experience & Tooling’s Node script needs no dependency install.
3. **[Create your branch](CONTRIBUTING.md)** before editing, follow your track’s bootstrap, then share one discovery.

For the gallery you need **Node.js 24.x**, npm and access to this private repository.
The workspace pins npm 11.6.2; `nvm use` selects Node 24 if you use nvm.

Copy this repository’s SSH URL from **Code → SSH** (including after the internal move), then replace the placeholder:

```sh
git clone <SSH-URL-FROM-THIS-REPOSITORY> frontend-chapter-day
cd frontend-chapter-day
npm ci
npm run dev
```

Open the address printed by Vite and keep the terminal running (Ctrl+C stops it).
Follow your chosen track’s guide; reference demos are optional destinations.
All commands above run from the repository root.

Already cloned it? Start with `npm ci`. For access, environment or browser
issues, see [setup and troubleshooting](playground/README.md).

<a id="tracks"></a>
## 🧭 Choose a Track

| Track | Explore | Starting point |
| --- | --- | --- |
| [🌐 Modern Web Capabilities](tracks/modern-web/README.md) | Browser APIs, visuals, computation and communication | D3 constellation, SVG, Workers and tab messaging |
| [🔍 Code Quality & Maintainability](tracks/code-quality/README.md) | Dependencies, complexity, architecture and test confidence | Investigate this app or an existing React codebase |
| [🛠️ Developer Experience & Tooling](tracks/developer-experience/README.md) | Faster feedback and less everyday workflow friction | A small Node script and a worked command inventory |
| [🚀 Experimental Projects](tracks/experimental-projects/README.md) | Games, visual stories, art, quizzes and your own ideas | Generative postcard or a fresh React demo |

Each track has a short **bootstrap guide** and separate **worked examples**.
Follow your curiosity; there is no required sequence. Code Quality & Maintainability can use an
existing codebase, and Developer Experience & Tooling's script starter runs with Node alone.

<a id="create-a-demo"></a>
## 🛠️ Create a Demo

From the repository root:

```sh
npm run demo:new
```

**Give your demo a name first.** The generator asks for an ID, track, author
and description, then creates `Demo.tsx`, `demo.config.ts` and `README.md` in
`playground/src/demos/<id>/`. The host discovers `demo.config.ts` automatically;
the folder name supplies the demo ID. Open the printed route and edit `Demo.tsx`.

The [demo guide](playground/src/demos/template/README.md) covers the full workflow,
a non-interactive command and the manual alternative. Investigations and tools
can be shared as notes or scripts without creating a gallery demo.

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

The workspace is prepared for an internal GitHub Enterprise Cloud repository. Follow the [migration guide](docs/internal-migration.md) to configure team access and source links. Participants develop locally. A temporary [hosted gallery](https://frontend-chapter-day.vercel.app) is available on Vercel; see [hosting and removal](docs/hosting.md).

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch, checks and pull-request workflow.

## 🧱 Project Structure

```text
frontend-chapter-day/
├── playground/              # Vite + React + TypeScript app
│   └── src/
│       ├── app/             # Shell, track pages and navigation
│       ├── demo-contract.ts # Typed demo metadata and loader contract
│       ├── demos/           # Participant folders with demo.config.ts + Demo.tsx
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

The [app guide](playground/README.md#useful-commands) covers extra commands and browser setup. Run these from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the lab with fast refresh |
| `npm run demo:new` | Create a named React demo with discoverable metadata |
| `npm run check` | Run generator tests, app checks and the production build |
| `npm run build` | Build the app through Turbo |
| `npm run preview` | Serve the built app locally |
| `npm run test:browser` | Verify UI/browser changes (requires browser setup) |

Codex/Copilot CLI setup and the shared Git hook are explained in the [integration guide](tracks/code-quality/fallow.md#set-up-agents-and-commit-checks).

Browser tests require the [documented browser setup](playground/README.md).
See [verification evidence and limits](playground/VERIFICATION.md) for what
has been checked; independent participant setup and other operating systems
still need validation.

<a id="documentation"></a>
## 📚 Documentation

- [App setup, architecture and troubleshooting](playground/README.md)
- [Create and contribute a demo](playground/src/demos/template/README.md)
- [Modern Web Capabilities](tracks/modern-web/README.md)
- [Code Quality & Maintainability](tracks/code-quality/README.md) and [Fallow walkthrough](tracks/code-quality/fallow.md)
- [Developer Experience & Tooling](tracks/developer-experience/README.md)
- [Experimental Projects](tracks/experimental-projects/README.md)
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
