# Orbit

A fictional speaker launch told through native scrolling, a sticky stage and a procedural Three.js model. Motion maps scroll progress to entry, rotation, a vertical flip and a downward exit.

From the repository root, after `npm ci`:

```sh
npm run dev --workspace @lab/demo-orbit
npm run check --workspace @lab/demo-orbit
```

Scroll forward or backward, jump through Explore, and choose a finish. The assembled product enters from below, spins, flips vertically, then exits through the bottom before the footer. Entry and exit each span about a quarter of the scroll story. Position and rotation follow separate heavy, damped springs, so a quick swipe accelerates the object and it keeps moving briefly after scrolling stops; releasing a drag lets the object coast briefly. Native scrolling stays continuous; vertical overscroll bounce is disabled. Still view and the system reduced-motion preference keep the product visible without animation. The finish chooser has its own stationary 3D preview, so colour changes remain visible after the scroll object exits. Colour choices reset on reload.

`index.tsx` owns the choreography and controls; `speaker-model.ts` builds the speaker and `speaker-scene.ts` lights and animates it; `orbit.css` adapts the composition for phones. Drag horizontally to inspect it, or focus the object and use arrow keys. Try changing a progress range in `speaker-scene.ts` and observe how it lines up with the text.

The gallery discovers the metadata automatically. Build output is `demos/orbit/dist/`; it can be hosted independently. `VITE_GALLERY_URL` optionally enables return links in a standalone build.

Browser checks covered desktop and phone-sized layouts, chapter navigation, finish selection and reduced motion. Physical-phone performance remains unverified.
