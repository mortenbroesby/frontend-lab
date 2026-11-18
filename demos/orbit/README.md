# Orbit

From the repository root:

```sh
npm install
npm run dev --workspace @lab/demo-orbit
```

Install once after generation to link the new workspace. Open the URL printed by Vite.
Edit demos/orbit/index.tsx and save; the browser updates automatically. Change "An idea, taking shape" in index.tsx to your own heading and save.

The gallery discovers demo.config.ts automatically; no registration needed.
With npm run dev at the root, open the gallery URL followed by #/demo/orbit.

Check this demo: npm run check --workspace @lab/demo-orbit.
For types only: npm run typecheck --workspace @lab/demo-orbit.
The build goes into demos/orbit/dist/. Add tests when you have logic worth testing.
