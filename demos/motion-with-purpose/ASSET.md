# Save seal

`save-seal.json` is original vector animation data created for the Frontend Lab. It was hand-authored in Lottie JSON, not exported from After Effects or downloaded from a marketplace. It contains only shape layers: a settling disc, a drawn check and an expanding ring. No images, fonts, expressions or remote references.

- Canvas: 128 × 128; 60 frames/second; 90 frames (1.5 seconds).
- Layers: `Draw the check`, `Settle the seal`, `An expanding ring`.
- Final frame: a readable check on a disc. Reduced motion uses this frame.
- Playback: `lottie-web`, SVG renderer, no loop. React owns save state.

## Reuse

This asset is dedicated to the public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). You may copy, edit and redistribute it without attribution. This dedication covers `save-seal.json` only, not third-party libraries.

Download it from the demo or copy it into another project. Load it with `lottie.loadAnimation({ container, renderer: 'svg', animationData, loop: false, autoplay: false })`. Keep a separate copy of animation data for each player and destroy players during cleanup. See `SaveSeal.tsx` and the guide for the complete lifecycle.

For richer illustrations, author in a supported design tool and export Lottie. Check the actual player's feature support and the asset's license; a vector asset can still contain raster images or depend on fonts. Ordinary SVG files do not contain a Lottie timeline.
