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
  <a href="https://frontend-chapter-day.vercel.app"><strong>Open the Lab →</strong></a>
  <span> | </span>
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
| [🌐 Modern Web Capabilities](https://frontend-chapter-day.vercel.app/#/track/modern-web) | Browser APIs, interactive visuals, Workers and communication |
| [🔍 Code Quality & Maintainability](https://frontend-chapter-day.vercel.app/#/track/code-quality) | Dependencies, complexity, architecture and test confidence |
| [🛠️ Developer Experience & Tooling](https://frontend-chapter-day.vercel.app/#/track/developer-experience) | Feedback loops, development friction and workflow automation |
| [🚀 Experimental Projects](https://frontend-chapter-day.vercel.app/#/track/experimental-projects) | Games, generative art, visualisations or your own experiment |

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

<a id="create-a-demo"></a>
## 🛠️ Create a Demo

```sh
npm run demo:new
```

Name your demo, choose a track, then edit `playground/src/demos/<id>/Demo.tsx`.
It appears in the gallery automatically. See the [demo guide](https://frontend-chapter-day.vercel.app/#/create)
for the typed contract and manual setup.

## 🤝 Share Your Work

Open a pull request with something to try and a short note about what you learned.
Code, tools and investigations all belong here. Run `npm run check` before sharing;
the [contribution guide](https://frontend-chapter-day.vercel.app/#/guide/contributing) covers the remaining checks.

<a id="documentation"></a>
## 📚 Reference

- [Track guides](#tracks) and [findings template](https://frontend-chapter-day.vercel.app/#/guide/findings)
- [Contributing](https://frontend-chapter-day.vercel.app/#/guide/contributing)
- [Setup and troubleshooting](https://frontend-chapter-day.vercel.app/#/guide/setup)
- [App architecture](playground/README.md)

---

<p align="center">
  Made by <a href="https://github.com/mortenbroesby">Morten Broesby-Olsen</a> · Built with React, TypeScript, Vite, Turborepo and D3
</p>
