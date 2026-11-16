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

A shared React playground for front-end engineers. Take apart a working example,
follow a track or bring your own idea. Go solo or team up; useful discoveries
and unfinished experiments are welcome.

<a id="tracks"></a>
## 🧭 Choose a Track

| Track | Explore |
| --- | --- |
| 🌐 Modern Web Capabilities | Browser APIs, interactive visuals, Workers and communication |
| 🔍 Code Quality & Maintainability | Dependencies, complexity, architecture and test confidence |
| 🛠️ Developer Experience & Tooling | Feedback loops, development friction and workflow automation |
| 🚀 Experimental Projects | Games, generative art, visualisations or your own experiment |

Each track has starting points, worked examples and optional challenges.
Use this playground or an existing project where it fits.

<a id="start-here"></a>
## 🚀 Run Locally

Clone this repository and run these commands from its root. Requires **Node 24**
and npm (the workspace pins npm 11.6.2).

```sh
npm ci
npm run dev
```

Open the address printed in your terminal. Choose a track in the app for
getting started, experiments and worked examples.

<a id="create-a-demo"></a>
## 🛠️ Create a Demo

```sh
npm run demo:new
```

Name your demo and choose a track. Modern Web starts with a circle; other tracks
start with an idea card. All demos live in `demos/<your-id>/`; edit `index.tsx`.
The generator prints your local route.
It appears in the gallery automatically. **Create a demo** in the app explains
the typed contract and manual setup.

## 🤝 Share Your Work

Open a pull request with something to try and a short note about what you learned.
Code, tools and investigations all belong here. Try your change and use a focused
check when needed.
Open **Share your work** in the app for contribution instructions.

---

<p align="center">
  Made by <a href="https://github.com/mortenbroesby">Morten Broesby-Olsen</a> · Built with React, TypeScript, Vite, Turborepo and D3
</p>
