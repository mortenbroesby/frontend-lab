# Signal Garden

Switch between rings, clusters and woven strands. Send a ripple, then highlight a family to follow its connections. The particles use generated patterns, not a real dataset.

```sh
npm run dev --workspace @lab/demo-signal-garden
npm run check --workspace @lab/demo-signal-garden
```

Start in `model.ts`: change a formation target and observe how the particles rearrange. `engine.ts` handles forces and lifecycle; `paint.ts` draws each frame. Keep the pause control and reduced-motion behavior working as you experiment.

The demo is listed under Modern Web in the gallery and can also build and run independently:

```sh
npm run build --workspace @lab/demo-signal-garden
npm run preview --workspace @lab/demo-signal-garden -- --host 0.0.0.0 --port 4392 --strictPort
```
