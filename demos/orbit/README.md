# Orbit

A fictional speaker launch told through native scrolling, a sticky stage and layered CSS artwork. Motion maps scroll progress to entry, rotation, a vertical flip and a downward exit.

From the repository root, after `npm ci`:

```sh
npm run dev --workspace @lab/demo-orbit
npm run check --workspace @lab/demo-orbit
```

Scroll forward or backward, jump through Explore, and choose a finish. The assembled product enters from below, spins, flips vertically, then exits through the bottom before the footer. Native scrolling stays continuous; vertical overscroll bounce is disabled. Still view and the system reduced-motion preference keep the product visible without animation. Colour choices reset on reload.

`index.tsx` owns the choreography and controls; `orbit.css` draws the speaker and adapts the composition for phones. Try changing a progress range in `Speaker` and observe how it lines up with the text.

The gallery discovers the metadata automatically. Build output is `demos/orbit/dist/`; it can be hosted independently. `VITE_GALLERY_URL` optionally enables return links in a standalone build.

Browser checks covered desktop and phone-sized layouts, chapter navigation, finish selection and reduced motion. Physical-phone performance remains unverified.
