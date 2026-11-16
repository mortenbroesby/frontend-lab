# Add your experiment to the lab

Create your branch using [CONTRIBUTING.md](../../../../CONTRIBUTING.md) before editing. From the repository root, after `npm ci`:

```sh
npm run demo:new
```

Give your demo a name first (required, with no default). Confirm or edit the suggested folder/URL ID, then choose the track, author, description and gallery presentation (standalone by default). The name is used in the gallery, starter and findings README. The Turborepo generator creates `playground/src/demos/<id>/Demo.tsx` plus typed `demo.config.ts` metadata, `index.html`, `main.tsx`, a workspace `package.json` and a findings README, and prints the demo route. Existing folders and IDs are rejected without overwriting them.

For a fully specified invocation:

```sh
npm run demo:new -- --args "Chapter Quiz" chapter-quiz experimental-projects "Your team" "Test your browser knowledge" standalone
```

Run `npm run dev`, open the printed address followed by `#/demo/chapter-quiz`, and edit your generated `Demo.tsx`. The template contains a small React interaction, not a finished exercise. Choose your own experiment.

The generator is defined in `turbo/generators/config.js`; `create-demo.mjs` handles validation and file creation. Each demo is an npm workspace sharing the repository toolchain. Run `npm install` after generation to update workspace links and the lockfile.

## Manual alternative

Prefer the generator: it creates the entry page and runnable workspace as well as the component. When authoring metadata manually, use the same contract:

Add `demo.config.ts` inside your copied folder:

```ts
import type { DemoDefinition } from '@lab/demo-kit/types';

export default {
  presentation: 'standalone',
  track: 'experimental-projects',
  title: 'Your experiment',
  description: 'What can someone try or learn?',
  author: 'Your name or group',
  load: () => import('./Demo'),
} satisfies DemoDefinition;
```

The generated React starter default-exports a component with no required props. Inline presentation requires a React `load` function; standalone presentation does not. Keep the `satisfies DemoDefinition` check: it catches invalid tracks, missing metadata and incompatible component exports during `npm run check`. The folder supplies the URL ID; do not add a separate ID field. Use lowercase kebab-case, at most 60 characters; template and system names are reserved.

Vite discovers `src/demos/*/demo.config.ts`. No registry or app-shell edit is needed. Metadata loads immediately; keep it free of side effects and use a dynamic import for the component. The host validates metadata at startup and reports the offending path if invalid. Definitions appear in folder-ID order. Open `#/demo/your-idea`; if a new folder is not visible, reload the page. Production builds must be rebuilt to include added demos.

The template itself has no `demo.config.ts`, so it is not listed. Existing reference definitions use the same contract and keep their implementations in their own demo folders. They also have independent app entries and builds.

Keep code, assets and optional `Demo.module.css` beside the component. Keep state inside the demo. Clean up timers, listeners, Workers and subscriptions when leaving. Only the selected demo runs; the app handles navigation, loading and React render-error feedback. This is not a sandbox: an infinite loop still blocks the page, and async/event errors need handling inside your demo.

Try your demo, navigate away and back, and check the browser console. Run `npm run check`; add a meaningful test if you introduce nontrivial logic. For UI/browser changes, also run the browser journeys using the [browser setup](../../../README.md#browser-checks).

## Share it through Git

Follow [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for checks, staging, pushing and the pull request. Include the track, what to try and what you learned. Keep dependency additions small and explain them.

Different demo folders do not edit a shared registration file; choose a unique folder ID.

For work in another repository, share a permitted findings note or link from your demo. Do not copy source, credentials or private data outside its permitted audience. Unfinished experiments and useful negative results are welcome.

## Run and deploy independently

Every demo can run on its own, including demos displayed inline in the gallery:

```sh
npm run dev --workspace @lab/demo-chapter-quiz
npm run build --workspace @lab/demo-chapter-quiz
npm run preview --workspace @lab/demo-chapter-quiz
```

Run these from the repository root after installation. Each app owns its `index.html` and `main.tsx`, uses the shared Vite config, and builds into its own `dist/`. Deploy that folder alone to a static host; its relative asset URLs work at a domain root or under a subpath. The source workspace still uses the repository's shared toolchain and starter styles; the generated build has no gallery runtime dependency.

The root gallery build also includes every demo's entry page, so **Open standalone demo** works on the shared site. Root `npm run dev` starts only the gallery server; root `npm run build` builds the gallery and individual apps.

`presentation: 'standalone'` opens the app from its gallery detail page. Choose `inline` to additionally render the React component inside the gallery. This choice never removes independent dev/build support.

For a non-React experiment, replace `main.tsx` and its HTML script reference with your own entry and remove `load` from the standalone metadata. Keep `demo.config.ts` free of side effects. Add any framework dependencies to that demo's package, and configure any required compiler plugins in both the demo and gallery Vite builds. The gallery reads only metadata and links to the entry page; it does not import a standalone app's runtime.
