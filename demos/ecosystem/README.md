# Little world

A toy pond built with React and SVG. Plant food, change sensing distance and speed, or pause to inspect it. Keyboard controls and reduced-motion startup are included.

From the repository root:

```sh
npm run dev --workspace @lab/demo-ecosystem -- --host 0.0.0.0
npm test --workspace @lab/demo-ecosystem
```

`world.ts` owns movement and feeding; `index.tsx` owns controls and drawing. Change one behaviour to make your own habitat. This completed example is independent of the generated starter. Creatures do not reproduce or starve; refresh resets the world.
