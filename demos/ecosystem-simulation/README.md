# Little world

A React/SVG pond. Plant food, adjust sensing and speed, or pause. Supports keyboard controls and reduced motion.

From the repository root:

```sh
npm run dev --workspace @lab/demo-ecosystem-simulation -- --host 0.0.0.0
npm test --workspace @lab/demo-ecosystem-simulation
```

`world.ts` handles movement and feeding; `index.tsx` handles controls and drawing. Change a rule to make your own habitat. This finished demo is separate from the starter. Creatures never reproduce or starve; refresh resets the world.
