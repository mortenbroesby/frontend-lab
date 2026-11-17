# Motion with purpose

An interactive collection of six original SVG prints. Filter by subject, mix up their order, and open a print in a larger detail view. Switch motion off to compare the same interactions, or slow transitions to see how they work.

From the repository root:

```sh
npm run dev --workspace @lab/demo-motion-with-purpose -- --host 0.0.0.0
npm run check --workspace @lab/demo-motion-with-purpose
```

`posters.tsx` owns the artwork and collection; `index.tsx` uses Motion layout, shared-element and entrance/exit animations. The shared Radix dialog provides focus management, Escape and a close control. System reduced motion disables movement. No remote assets or services are required.

Replace the prints with your own subject, or change one transition at a time. The in-app guide offers starting points for each technique. Closing a print returns focus to its card; filtering and ordering remain usable without animation.
