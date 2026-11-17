# Remote / Canvas TV

A keyboard-first TV interaction study. React owns selection; Canvas 2D paints the entire 1280 × 720 composition. Generated landscapes and fictional titles require no network services. This does not use Lightning or implement a custom React renderer.

```sh
npm run dev --workspace @lab/showcase-canvas-tv -- --host 0.0.0.0
npm run check --workspace @lab/showcase-canvas-tv
npm test --workspace @lab/showcase-canvas-tv
```

Focus the screen, use arrow keys to browse, Enter for details and Escape to return. Tab leaves the screen normally. Fullscreen TV presents just the 16:9 screen; Escape also exits browser fullscreen, so Backspace can return from details while staying fullscreen. On-screen remote buttons offer touch and semantic keyboard controls; selection is also announced as text. Focus and shelf movement animate briefly unless reduced motion is enabled. This models a directional remote with a keyboard; physical TV devices have not been tested.

`catalogue.ts` owns fictional content, `navigation.ts` owns selection and return behaviour, `paint.ts` draws the view, and `use-screen.ts` handles resolution, short transitions and cleanup. The gallery discovers the workspace automatically. The presentation links to its HTML entry without importing its components.
