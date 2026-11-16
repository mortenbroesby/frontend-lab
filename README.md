# The Front-End Lab

**Front-End Chapter Day · Friday, 20 November 2026**

Pick a track, go solo or team up, and explore something interesting. Try an example, build towards it, combine ideas or bring your own project. No polished deliverable required.

## Choose a track

| Track | What you can explore | First step |
| --- | --- | --- |
| [🌐 A · Modern Web Capabilities](tracks/a-modern-web-capabilities.md) | Browser APIs, visuals, background computation and communication | Try a browser example or choose one API |
| [🔍 B · Code Quality & Maintainability](tracks/b-code-quality-maintainability.md) | Dependencies, complexity, architecture and automated analysis | Pick a question about your codebase or this playground |
| [🛠️ C · Developer Experience & Tooling](tracks/c-developer-experience-tooling.md) | Faster feedback and less friction in everyday development | Choose one recurring annoyance or try the test feedback loop |
| [🚀 D · Experimental Projects](tracks/d-experimental-projects.md) | Games, visualisations, generative art, quizzes or your own idea | Build one visible behaviour using your preferred tools |

Each guide has a starting point, optional directions and something you could share. You can switch tracks or mix them.

## Get up and running

**Using your own project?** Follow its normal setup and go straight to your track guide. Your preferred technologies are welcome.

**Want a ready-made starting point?** The optional playground uses **Node.js 24.x and npm**. Clone this private repository using your usual authenticated GitHub method, then run from its root:

```sh
cd playground
npm ci
npm run dev
```

Open the local address printed in the terminal. Try the interactive D3 constellation, SVG composition, Worker experiment or messages between two browser tabs. Edit `src/YourLab.tsx` to start your own experiment.

[Playground setup and troubleshooting](playground/README.md) includes clone instructions, the source map and available commands. Initial installation needs internet; the examples run locally without a backend or API keys. Node 24 is required only for this playground, not for everyone's own projects.

## Make it your own

Choose **an interest + a capability + a question**, then try the smallest useful experiment. For example:

- SVG + Worker: can a larger pattern stay responsive?
- SVG + local messages: can a second tab control a palette?
- Your project + dependency analysis: what is actually used?
- A repetitive task + a faster feedback loop: what would make it easier?

Keep a demo, observation or useful failed attempt. The optional [findings template](tracks/findings.md) helps you record what you learned.
