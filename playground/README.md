# The Front-End Lab playground

An optional local starting point for [choosing a track](../README.md). Examples are reference destinations, not steps you have to complete.

## First run

Follow the root [Start Here](../README.md#start-here) instructions for cloning, Node 24, installation and startup. Keep your own project’s runtime if you are not using this playground. The [verification record](VERIFICATION.md) distinguishes observed checks from untested environments.

The home page opens four track pages and a shared demo gallery. Try the D3 constellation, SVG postcard, Worker comparison or local tab messaging; B and C include investigation/tool walkthroughs. **Create a demo** opens a separate minimal template. Inputs are ephemeral; save code and record findings you want to keep.

## Architecture and where to work

| File | Responsibility |
| --- | --- |
| `src/app/App.tsx` | Shared navigation, track pages and gallery |
| `src/app/tracks.ts` | Four tracks and suggested starting points |
| `src/demo-contract.ts` | Shared `DemoDefinition` type |
| `src/demos/<your-idea>/demo.config.ts` | Demo metadata and component loader, discovered by the host |
| `src/demos/template/` | Copyable bootstrap, separate from completed examples |
| `src/demos/<your-idea>/` | Your component, assets and scoped styles |
| `src/examples/` | Reference implementations and helpers; their discovery configs live in demo folders |
| `src/starters/BrowserStarter.tsx` | Optional one-circle browser starting point on Modern Web Capabilities |
| `src/app/DemoBoundary.tsx` | Render-error fallback around the active demo |
| `src/styles.css` | Shared shell, responsive layout and accessibility styles |
| `tests/` | Logic checks and browser journeys |

[Create and contribute a demo](src/demos/template/README.md). Run `npm run demo:new` from the repository root; Turborepo creates `Demo.tsx`, `demo.config.ts` and `README.md` in your demo folder. The host discovers `demo.config.ts` automatically and uses the folder name as the ID; no central registry or app-shell edit is needed. Use local component state, optional CSS modules and effect cleanup. The gallery orders demos alphabetically by folder ID. Metadata is discovered up front; components load only when opened and unmount when leaving. The render boundary protects navigation from React render failures; it cannot isolate blocking code or catch arbitrary async errors.

`demo.config.ts` default-exports an object satisfying `DemoDefinition` from `../../demo-contract`, with `title`, `track`, `description`, `author` and `load`. The loader imports a module whose default export is your React component. Use the generator and [technical demo guide](src/demos/template/README.md) for the exact file shape.

Hash routes such as `#/track/modern-web`, `#/demo/constellation` and `#/create` keep deep links in one app without server rewrite rules. Sharing is Git-backed: merge a contribution, then pull it locally. There is no live cross-computer sync.

## Useful commands

Run `npm ci`, `npm run demo:new`, `npm run dev` and `npm run check` from the repository root. Turbo coordinates the workspace tasks. The following app-specific commands also work from `playground` after the root install:

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development with fast refresh |
| `npm run typecheck` | TypeScript check without producing files |
| `npm test` | Node tests for art, computation and Developer Experience & Tooling scripts |
| `npm run test:watch` | Repeat those tests when source changes; stop with Ctrl+C |
| `npm run build` | Type check and production bundle |
| `npm run preview` | Serve an already built bundle locally |
| `npm run check` | Type check, logic tests and production bundle |
| `npm ls --depth=0` | Inspect direct installed dependencies for a quality investigation |

## Browser checks

Trying examples does not require browser automation. For contributions that change UI/browser behaviour, run these from `playground/` after the root install:

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

The production build has one HTML entry and lazy demo chunks. Code Quality & Maintainability can use an existing codebase, and Developer Experience & Tooling's independent Node scripts under `tracks/developer-experience/` run without starting the app.

## Internal repository and theme

See the [migration guide](../docs/internal-migration.md) for GitHub Enterprise Cloud repository access and team contributions. Participants run the app locally; shared hosting is deferred.

`src/theme.css` owns the shell palette. Demo visuals stay independent; Sapphire is not required. Set optional `VITE_SOURCE_URL` in `playground/.env.local` using `.env.example` to link guides to your source repository. Without it, the app shows editor paths.
