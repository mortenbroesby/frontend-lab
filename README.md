<h1 align="center">🧪 The Front-End Lab</h1>

<p align="center">
  Explore, experiment and build something interesting.
</p>

<p align="center">
  <img alt="Node 24.x" src="https://img.shields.io/badge/node-24.x-6366f1">
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178c6">
  <img alt="Turborepo" src="https://img.shields.io/badge/Turborepo-0f172a">
</p>

<p align="center">
  <a href="#start-here">Run locally</a>
  <span> | </span>
  <a href="#create-a-demo">Create a demo</a>
</p>

---

A shared space for front-end experimentation. Explore demos, follow guides,
and build your own ideas—solo or together. Unfinished work is welcome.

<a id="tracks"></a>
## 🧭 Choose a Track

| Track | Explore |
| --- | --- |
| 🌐 Modern Web Capabilities | Browser APIs, interactive visuals, Workers and communication |
| 🔍 Code Quality & Maintainability | Dependencies, complexity, architecture and test confidence |
| 🛠️ Developer Experience & Tooling | Feedback loops, development friction and workflow automation |
| 🚀 Experimental Projects | Games, generative art, visualisations or your own experiment |

Each track has ideas, demos and a starting point. Use this repo or your own project.

**Showcases** are larger interactive pieces, separate from the small demos. Open Showcases in the app to explore Signal Garden, a D3-powered particle world.

<a id="start-here"></a>
## 🚀 Run Locally

Clone the repo. With **Node 24** and npm 11.6.2, run from its root:

```sh
npm ci
npm run dev
```

Open the printed address and choose a track.

Windows works with native PowerShell or Command Prompt; WSL is not required. If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm` in these commands. See [Windows setup and compatibility](gallery/docs/windows.md).

<a id="create-a-demo"></a>
## 🛠️ Create a Demo

```sh
npm run demo:new
```

Name it and choose a track: Modern Web starts with a circle; others with an idea
card. Edit `demos/<your-id>/index.tsx`. The generator prints the route and the
gallery discovers your demo automatically. See **Create a demo** in the app.

---

<p align="center">
  Made by <a href="https://github.com/mortenbroesby">Morten Broesby-Olsen</a> · Built with React, TypeScript, Vite, Turborepo and D3
</p>
