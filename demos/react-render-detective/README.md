# React Render Detective

```sh
npm run dev --workspace @lab/demo-react-render-detective
npm run check --workspace @lab/demo-react-render-detective
```

Compare three identical tile collections: plain children, memoized children receiving new objects, and memoized children receiving stable objects. Type in a collection note or click **Update parent**, then inspect the tile commit counts and React Scan overlay. Click a tile’s Like button to see that local state still updates through memo. **Reset experiment** remounts all panels.

- `experiment.tsx` owns each parent’s state and prop construction.
- `tile.tsx` contains the ordinary and memoized tile and a commit observer that does not schedule extra renders.
- `main.tsx` initializes [React Scan](https://github.com/aidenybai/react-scan) before dynamically loading React DOM through `start.tsx`. Scanning is deliberately enabled in this standalone teaching app’s static build; it is not enabled in the gallery or other demos.

Counts measure committed tile observations, not render attempts or timing. Development Strict Mode may observe the initial mount twice. Compare count changes, not initial totals. These cheap tiles demonstrate propagation, not a performance problem; fewer renders do not prove faster interactions. Scan itself adds overhead. Use its toolbar to pause or inspect outlines.

Try removing the object spread, then removing `memo`. Keep the example small; no artificial CPU workload is needed.
