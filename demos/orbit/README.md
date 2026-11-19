# Orbit

A fictional speaker launch told through native scrolling, a sticky stage and a procedural Three.js model. Motion maps scroll progress to vertical movement, changing pitch and yaw, and a downward exit.

From the repository root, after `npm ci`:

```sh
npm run dev --workspace @lab/demo-orbit
npm run check --workspace @lab/demo-orbit
```

Scroll forward or backward: the speaker tilts up at Detail, rotates to a tilted back view at A different angle, then settles upright before leaving the stage. It moves gradually down the viewport as the story progresses. The scroll-driven object doesn't accept drag or keyboard rotation; native scrolling owns this part.

The finish chooser has a separate stationary preview. Drag it sideways, use arrow keys to turn and tilt, or press Home to reset. Colour changes remain visible here. A slow spotlight sweeps while visible; reduced motion stops that sweep and keeps the story object still. Six colour presets and a continuous gradient slider blend the shell colour; arrow keys adjust the slider and Home/End reach its endpoints. Colour choices reset on reload.

Position and rotation follow damped springs. `scroll-pose.ts` defines the chapter angles, tested for distinct views, continuity and the final pose. `speaker-scene.ts` applies that pose plus manual offsets; `speaker-model.ts` builds the geometry. `index.tsx` owns the story and controls, and `orbit.css` adapts it for phones.

The gallery discovers the metadata automatically. Build output is `demos/orbit/dist/`; it can be hosted independently. `VITE_GALLERY_URL` optionally enables return links in a standalone build.

Browser checks covered desktop and phone-sized layouts, finish selection and reduced motion. Physical-phone performance remains unverified.

## Presentation mode

The deck opens Orbit with `?embed=1&presentation=1` in a responsive iframe. In clean presentation mode, this slide uses the full available screen height, including on a portrait phone; the deck footer remains available to continue. The speaker is visible immediately. This removes the page navigation, footer, replay link and rotation hints/reset buttons. The first three chapters each span 140% of the viewport, with a compact chapter navigator and more room to scroll through each pose. The final colour studio is at least one viewport tall. Scrolling drives the story pose; drag and keyboard rotation are available at the finish. Reduced motion and colour choices remain available. The deck supplies the Continue presentation link; the ordinary demo retains its Back to the Lab navigation.
