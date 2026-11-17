# Remote / Canvas TV

A keyboard-first TV interaction study. React owns selection; Canvas 2D paints the entire 1280 × 720 composition. Generated landscapes and fictional titles require no network services. This does not use Lightning or implement a custom React renderer.

```sh
npm run dev --workspace @lab/showcase-canvas-tv -- --host 0.0.0.0
npm run check --workspace @lab/showcase-canvas-tv
npm test --workspace @lab/showcase-canvas-tv
```

Focus the screen, use arrow keys to browse, Enter to play an animated short and Escape to return. Tab leaves the screen normally. Fullscreen TV keeps the 16:9 screen and touch remote together; Escape also exits browser fullscreen, so Backspace can return from playback while staying fullscreen. On-screen remote buttons offer touch and semantic keyboard controls; selection is also announced as text. The mountain panorama uses parallax layers, drifting mist and a changing night sky. System reduced motion freezes the background and disables focus/scroll animation. Hidden tabs stop repainting. This models a directional remote with a keyboard; physical TV devices have not been tested.

`catalogue.ts` owns fictional content, `navigation.ts` owns selection and return behaviour, `paint.ts` draws the interface, `scenery.ts` draws the animated panorama and caches static posters, and `use-screen.ts` handles resolution, frame scheduling and cleanup. The gallery discovers the workspace automatically. The presentation embeds its HTML entry with `?embed=1` without importing its components. Embedded mode shows the screen, a compact touch D-pad with OK and Back, and accessible selection text; its keyboard events cannot advance the parent deck.

Selecting a title replaces the catalogue with a full-frame procedural mountain flight: camera movement, parallax and drifting lights. The 45-second scene fades out and loops. It is silent, generated locally and needs no external video assets. Back restores the catalogue selection. This fills the TV canvas without forcing the browser or presentation out of its current fullscreen mode. Reduced motion shows a still scene. `playback.ts` owns this view.
