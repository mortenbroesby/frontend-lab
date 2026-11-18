<h1 align="center">🧪 The Frontend Lab</h1>

<p align="center">
  Explore, experiment and build something interesting.
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

Try Signal Garden in Modern Web to explore a D3-powered particle world. Every demo has its own runnable workspace.

<a id="start-here"></a>
## 🚀 Run Locally

Clone the repo. With **Node 24** and npm 11.6.2, run from its root:

```sh
npm ci
npm run dev
```

Open the printed address and choose a track.

Moving this repository internally? See the [migration checklist](gallery/docs/internal-migration.md).

Windows works with native PowerShell or Command Prompt; WSL is not required. If PowerShell blocks `npm.ps1`, use `npm.cmd` instead of `npm` in these commands. See [Windows setup and compatibility](gallery/docs/windows.md).

<a id="create-a-demo"></a>
## 🛠️ Create a Demo

```sh
npm run demo:new
```

Give it a name; the generator creates an idea-card starter and its folder ID. Edit `demos/<your-id>/index.tsx`. The generator prints the route and the
gallery discovers your demo automatically. See **Create a demo** in the app.

---

<p align="center">
  Built with React, TypeScript, Vite, Turborepo and D3
</p>
