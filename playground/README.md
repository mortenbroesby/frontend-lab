# The Front-End Lab playground

An optional local starting point for [choosing a track](../README.md). Examples are reference destinations, not steps you have to complete.

## First run

Use **Node.js 24.x with npm** and a current browser. The baseline was chosen to keep one supported runtime for Vite and Node's built-in TypeScript test runner. The exact tested environment is recorded in [verification](VERIFICATION.md). If you use nvm, `nvm use` reads `.nvmrc`; otherwise use your usual Node installation method. Keep your own project's runtime if you are not using this playground.

From the repository root:

```sh
cd playground
npm ci
npm run dev
```

Open the local address printed by Vite (usually `http://127.0.0.1:5173`). Keep the terminal running. Stop with Ctrl+C. The server listens on loopback; no LAN exposure is needed.

To obtain the private repository first, use your preferred authenticated GitHub clone method. For SSH access:

```sh
git clone git@github.com:mortenbroesby/frontend-chapter-day.git
cd frontend-chapter-day
```

In the page, try **Remix composition**, **Run in Worker** or **Open second lab tab**. For your own idea, edit `src/YourLab.tsx` and save. Vite updates the page. Inputs are ephemeral; refresh resets them, so save code and record findings you want to keep.

## Where to work

| File | Purpose / first useful change |
| --- | --- |
| `src/YourLab.tsx` | Your independent experiment; replace the small input/colour example |
| `src/examples/ArtStudio.tsx` | SVG composition, controls and export; change a visual rule |
| `src/examples/art.ts` | Repeatable point generation; change the distribution |
| `src/examples/Workers.tsx` | Responsive interaction, Worker lifecycle and cancellation |
| `src/examples/compute.worker.ts` | Off-main-thread entry point; delegates to a pure function |
| `src/examples/compute.ts` | Bounded computation shared by Worker and main-thread comparison |
| `src/examples/Signals.tsx` | Local, same-origin tab messages and lifecycle cleanup |
| `src/main.tsx` | Page and example sections; remove examples from here if you want a smaller page |
| `src/styles.css` | Plain CSS, responsive layout, focus styles and reduced-motion handling |
| `tests/` | Small logic checks and optional browser journeys |

To start blank, replace the body of `YourLab` with your first component. You need not modify the gallery, tests or other examples. To borrow a piece, import the pure point generator or copy an interaction into your component. Keep each experiment easy to understand rather than introducing a shared framework.

## Useful commands

Run these from `playground`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development with fast refresh |
| `npm run typecheck` | TypeScript check without producing files |
| `npm test` | Node tests for deterministic art and bounded computation |
| `npm run test:watch` | Repeat those tests when source changes; stop with Ctrl+C |
| `npm run build` | Type check and production bundle |
| `npm run preview` | Serve an already built bundle locally |
| `npm run check` | Type check, logic tests and production bundle |
| `npm ls --depth=0` | Inspect direct installed dependencies for a quality investigation |

Browser checks are optional for participants. Maintainers can run:

```sh
npx playwright install chromium
npm run test:browser
```

The browser download takes extra space and bandwidth. Alternatively use an existing Chrome installation by setting `PLAYWRIGHT_CHANNEL=chrome` in your shell, then run `npm run test:browser`. The tests build and serve the production bundle themselves on port 4173; stop any other server on that port first. Do not install a browser just to try the workshop examples.

## Troubleshooting

- **Cannot clone / repository not found:** this is a private repository. Check the signed-in account and ask the organiser for access; no token should go into a command or source file.
- **Node/npm not found or engine warning:** check `node --version` and `npm --version`; activate Node 24 in your terminal and retry.
- **Port already used:** open the URL Vite actually prints, or stop your own previous process. Use that exact same origin in both signal tabs.
- **No signal arrives:** both tabs must be open at the same scheme, host and port, in the same browser profile/context. The sending tab does not receive its own message; closed tabs do not replay messages. This is not cross-computer communication.
- **Worker finishes too quickly to observe:** choose a larger workload or inspect DevTools. Timing depends on hardware. The main-thread comparison deliberately pauses interaction briefly; start with the small workload.
- **Install failure:** retain the error, check runtime and network/proxy access, and ask a peer. Pair or use your own existing project rather than spending the day reinstalling tools.

The examples use browser-native SVG, Worker and BroadcastChannel APIs. No WebSocket server, WebRTC signalling server or WebAssembly toolchain is included. Those remain optional directions for participants to explore.
