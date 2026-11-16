# D worked example · A generative postcard

**Experience:** In the running playground, open `/#/demo/art`. Change the dot count, remix the composition, then save an SVG. The same seed produces the same arrangement; the exported file can be opened in a browser independently.

**How it works:** [art.ts](../../playground/src/examples/art.ts) produces repeatable points from a seed. [ArtStudio.tsx](../../playground/src/examples/ArtStudio.tsx) draws them with SVG, adds controls and serialises the picture for download. This is a completed reference, separate from your [creative starter](bootstrap.md).

## Build towards it, or branch

1. Draw one shape in your starter.
2. Generate a few shapes from a rule you choose.
3. Add one control that changes the result.
4. If useful, add reproducibility or saving; neither is necessary for a first discovery.

Try a spiral, a title, data-driven sizes or a tiny game. Borrow the generator when you want to focus on interaction instead of rebuilding every piece.

For another direction, explore the [D3 idea atlas](../a/examples.md#d3-build-an-atlas-of-ideas) or use local signals to control a palette from a second tab. Local tabs are not multi-device networking.

**What has been checked:** repeatability and bounds in logic tests; remixing, SVG download and exported circle count in browser tests. Those checks do not decide whether your visual idea is interesting. Show a result and one thing you learned; an unfinished prototype counts.

[Your creative bootstrap](bootstrap.md) · [Track D](README.md)
