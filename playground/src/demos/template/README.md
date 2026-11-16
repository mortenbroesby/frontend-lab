# Add your experiment to the lab

From the repository root, after `npm ci`:

```sh
npm run demo:new
```

Give your demo a name first (required, with no default). Confirm or edit the suggested folder/URL ID, then choose the track, author and description. The name is used in the gallery, starter and findings README. The Turborepo generator creates `playground/src/demos/<id>/Demo.tsx` and a findings README, adds a lazy entry to the registry, and prints the demo route. Existing folders and IDs are rejected without overwriting them.

For a fully specified invocation:

```sh
npm run demo:new -- --args "Chapter Quiz" chapter-quiz d "Your team" "Test your browser knowledge"
```

Run `npm run dev`, open the printed address followed by `/#/demo/chapter-quiz`, and edit your generated `Demo.tsx`. The template contains a small React interaction, not a finished exercise. Choose your own experiment.

The generator is defined in `turbo/generators/config.js`; `create-demo.mjs` handles validation and file creation. No package or dependency is added per demo.

## Manual alternative

From `playground`, copy this directory to `src/demos/your-idea` and edit the copied component. The shared template stays available to everyone.

Add one entry to the array in `src/demo-registry.ts`:

```tsx
{
  id: 'your-idea',
  track: 'd', // a, b, c or d
  title: 'Your experiment',
  description: 'What can someone try or learn?',
  author: 'Your name or group',
  Component: lazy(() => import('./demos/your-idea/Demo')),
},
```

`lazy` is already imported. Use a unique URL-safe lowercase ID and an existing track. The gallery and track page pick it up automatically; open `/#/demo/your-idea` at the local server address. No app-shell edit is required.

Keep code, assets and optional `Demo.module.css` beside the component. Keep state inside the demo. Clean up timers, listeners, Workers and subscriptions when leaving. Only the selected demo runs; the app handles navigation, loading and React render-error feedback. This is not a sandbox: an infinite loop still blocks the page, and async/event errors need handling inside your demo.

Try your demo, navigate away and back, and check the browser console. Run `npm run check`; add a meaningful test if you introduce nontrivial logic. The existing browser journeys can be run with the optional setup in the [playground README](../../../README.md).

## Share it through Git

From the repository root, substituting your own unique branch name:

```sh
git switch -c demo/your-idea
```

Make your changes, inspect `git diff`, then stage only your demo, its registry entry and any relevant tests. Commit, push your branch and open a pull request against `main`. Include the track, what to try and what you learned. Keep dependency additions small and explain them. Registry conflicts are resolved by keeping both participants' entries with unique IDs.

After merge, other participants update their clean `main` checkout with `git pull --ff-only`. Save or commit ongoing work before switching branches. Changes appear after pulling and reloading the local app; there is no live cross-computer sync or hosted deployment.

For work in another repository, your gallery component can describe findings, show a before/after comparison, or link to a demo viewers can access. Do not copy company code, credentials or private data into this personal repository. Unfinished experiments and useful negative results are welcome.
