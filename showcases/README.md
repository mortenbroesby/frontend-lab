# Showcases

Larger, polished interactive pieces that demonstrate what the web can do. Keep small learning examples in `demos/`; showcases have their own gallery collection and independent npm workspaces.

Each `showcases/<id>/` contains `showcase.config.ts` (the shared `DemoDefinition` contract), `index.html`, its React entry, package scripts and optional `preview.svg`. The gallery discovers metadata and HTML automatically, without importing the application. Use `@lab/showcase-<id>` as the package name and the existing `gallery/vite.demo.config.ts` for standalone development and builds.

The demo generator still creates small demos. There is no separate showcase generator.

Introduce each showcase in the app with five to ten short sentences explaining what it does and why it exists. Keep this visible before the interaction, use plain language and avoid repeating it in technical notes.

## Signal Garden

After the root install:

```sh
npm run dev --workspace @lab/showcase-signal-garden
npm run check --workspace @lab/showcase-signal-garden
```

Or use the gallery with `npm run dev`, then choose Showcases. To preview the built standalone app on your network:

```sh
npm run build --workspace @lab/showcase-signal-garden
npm run preview --workspace @lab/showcase-signal-garden -- --host 0.0.0.0 --port 4392 --strictPort
```

Open the printed network URL on the same LAN. Standalone builds need no gallery; optionally set `VITE_GALLERY_URL` at build time to enable return navigation. Gallery builds include the return link automatically.

`model.ts` generates the artwork and formation targets, `engine.ts` owns the D3 simulation and cleanup, and `paint.ts` draws Canvas frames. React owns the controls. Generated families and connections aren't a real dataset. Reduced motion starts paused; Play is an explicit opt-in. No server, network API or animation library is required.

## Remote / Canvas TV

Run `npm run dev --workspace @lab/showcase-canvas-tv -- --host 0.0.0.0`, or open it from the gallery. A 16:9 Canvas interface explores directional focus, row navigation and returning from title details. See [Canvas TV](canvas-tv/README.md) for its small implementation and keyboard controls.
