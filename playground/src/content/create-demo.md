# Add your experiment to the lab

Create your branch using [CONTRIBUTING.md](#/guide/contributing) before editing. From the repository root, after `npm ci`:

```sh
npm run demo:new
```

Give your demo a name first (required, with no default). Confirm or edit the suggested folder/URL ID, then choose the track, author and description. The name is used in the gallery, starter and findings README. The Turborepo generator creates `playground/src/demos/<id>/Demo.tsx` plus typed `demo.config.ts` metadata and a findings README, and prints the demo route. Existing folders and IDs are rejected without overwriting them.

For a fully specified invocation:

```sh
npm run demo:new -- --args "Chapter Quiz" chapter-quiz experimental-projects "Your team" "Test your browser knowledge"
```

Run `npm run dev`, open the printed address followed by `#/demo/chapter-quiz`, and edit your generated `Demo.tsx`. The template contains a small React interaction, not a finished exercise. Choose your own experiment.

The generator is defined in `turbo/generators/config.js`; `create-demo.mjs` handles validation and file creation. No package or dependency is added per demo.

## Manual alternative

From `playground`, copy this directory to `src/demos/your-idea` and edit the copied component. The shared template stays available to everyone.

Add `demo.config.ts` inside your copied folder:

```ts
import type { DemoDefinition } from '../../demo-contract';

export default {
  track: 'experimental-projects',
  title: 'Your experiment',
  description: 'What can someone try or learn?',
  author: 'Your name or group',
  load: () => import('./Demo'),
} satisfies DemoDefinition;
```

`Demo.tsx` must default-export a React component with no required props. Keep the `satisfies DemoDefinition` check: it catches invalid tracks, missing metadata and incompatible component exports during `npm run check`. The folder supplies the URL ID; do not add a separate ID field. Use lowercase kebab-case, at most 60 characters; template and system names are reserved.

Vite discovers `src/demos/*/demo.config.ts`. No registry or app-shell edit is needed. Metadata loads immediately; keep it free of side effects and use a dynamic import for the component. The host validates metadata at startup and reports the offending path if invalid. Definitions appear in folder-ID order. Open `#/demo/your-idea`; if a new folder is not visible, reload the page. Production builds must be rebuilt to include added demos.

The template itself has no `demo.config.ts`, so it is not listed. Existing reference definitions use the same contract and lazy-load their implementations from `src/examples/`.

Keep code, assets and optional `Demo.module.css` beside the component. Keep state inside the demo. Clean up timers, listeners, Workers and subscriptions when leaving. Only the selected demo runs; the app handles navigation, loading and React render-error feedback. This is not a sandbox: an infinite loop still blocks the page, and async/event errors need handling inside your demo.

Try your demo, navigate away and back, and check the browser console. Run `npm run check`; add a meaningful test if you introduce nontrivial logic. For UI/browser changes, also run the browser journeys using the [browser setup](#/guide/setup).

## Share it through Git

Follow [CONTRIBUTING.md](#/guide/contributing) for checks, staging, pushing and the pull request. Include the track, what to try and what you learned. Keep dependency additions small and explain them.

Different demo folders do not edit a shared registration file; choose a unique folder ID.

For work in another repository, share a permitted findings note or a gallery component with an appropriate link or walkthrough. Do not copy source, credentials or private data outside its permitted audience. Unfinished experiments and useful negative results are welcome.
