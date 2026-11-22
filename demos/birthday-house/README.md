# The Birthday House

A full-screen birthday adventure in three connected rooms. A dedicated cottage entrance screen leads into polished 2D rooms with restrained animated layers. The birthday table, photographic darkroom and attic share the original Birthday Portrait’s blue-hour light, timber, flowers and amber lamps. Room art has separate wide and portrait compositions. All three rooms use clean lossless PNG artwork. The original game and its port 4498 remain independent.

## Run and personalise

Use the repository’s Node 24 and npm 11.21.2. From the root:

```sh
npm install
npm run dev --workspace @lab/demo-birthday-house
npm run check --workspace @lab/demo-birthday-house
npm run test --workspace @lab/demo-birthday-house
```

Replace `birthday-photo.png` and edit `birthday.ts` for the alt text and personal message. The bundled portrait of Kasper was supplied by the user and edited with softly blurred background people, Danish birthday bunting and gold star decorations. Both portrait and landscape photographs fit without cropping. Rebuild to share changes. The gallery discovers `demo.config.ts` automatically.

For a built LAN preview:

```sh
npm run preview --workspace @lab/demo-birthday-house -- --host 0.0.0.0 --port 4499 --strictPort
```

A public tunnel needs its exact hostname allowed through `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` when starting the preview. Use a separate tunnel from the original game.

## Explore

Touch the buns, cake and coffee directly to perform the breakfast ritual; tap other objects to inspect them. Both upright phones and wide screens show the complete room composition. Tab moves between objects and brings them into view; Enter opens them. The notebook records only clues you choose to keep. Show glimmers makes interactive objects easier to find. A little nudge gives progressively clearer hints on request.

There is no timer, penalty, jump scare or audio requirement. Living light adds gentle camera movement, real flickering lights, drifting mist and dust, rippling developing water, and a foreground layer. Animations stay enabled, including when the system prefers reduced motion; there is no motion toggle. Fullscreen uses the browser feature where available; the game otherwise fills the page. Refreshing starts a fresh game. Start again asks before resetting your discoveries.

The birthday custom of paper Dannebrog flags in buns and on cakes is described by [Denmark’s official site](https://denmark.dk/people-and-culture/dannebrog-800-years). The images also include rectangular Danish flag garlands. The puzzles are invented for this game.

<details>
<summary>Journey and verification steps (spoilers)</summary>

1. Find the invitation beside the flowers. Its riddle describes buns → cake → coffee. Touch each object directly in the scene. Lights wake in the cabinet, unlocking the darkroom. A wrong choice preserves the lights you have already earned and gently names the next step.
2. Inspect the darkroom camera. Its maker’s mark is VII; focus the lens at 7 and recover the glass plate. Developing baths cannot work without it.
3. Find the wall recipe. Moon → rain → star corresponds to the three baths. The engine animates the plate between trays, then reveals two horizontal and three vertical stars. Wrong choices preserve completed baths and suggest the next one.
4. Revisit breakfast and return. The plate and discovered notes remain in the notebook. The staircase glows and shows “Til loftet — åbent” once the plate is developed, even with glimmers hidden. Hints in this room point to the staircase. Take the attic stairs.
5. Insert the plate into the magic lantern. Set the horizontal wheel to II and the vertical wheel to III. A real spotlight and translucent light volume move across the shutters. Release the light; the engine turns the shutters on their hinges to reveal the photograph.
6. Open the birthday message, close it, revisit another room, return, and reopen it. Replay clears doors, discoveries, plate, lights, dials and shutters.

State tests cover gating, discovery, wrong answers, plate retention, alignment, reset, cinematic ordering and sound-cue selection. Browser verification covers the complete journey, camera slider keyboard access, focus inside native dialogs, backtracking, replay and desktop/phone layouts. Browser audio probes check gesture-based startup, silent mute, hidden-page suspension, resumption and unavailable-audio fallback. Offline waveform and live lifecycle checks cover finite unclipped samples, bounded voice scheduling, cancellation on replay/unmute and disposal. Restarting during the finale is checked separately. A phone-sized desktop browser is emulation, not real-device iPhone Safari testing; waveform checks are not a human listening review.

</details>

The game is in Danish, including its clues, hints, accessible labels, entrance and final greeting.

## Rendering

The modeled 3D room has been removed at the user's request. Babylon.js 9.36.0 presents clean, lossless 2D artwork in all three rooms without relighting or a duplicate foreground crop. Gentle candle glows, coffee steam, dust and cabinet lights provide subtle motion. The darkroom and attic use newly refined compositions without duplicated foreground layers. Their developing-water shader, traveling plate, gently breathing projector beam and hinged photo reveal remain. The breakfast door swings on a real hinge after the cabinet puzzle, revealing a glimpse of the darkroom. Cabinet lights charge softly, the camera glints when focused, brass dial needles turn, and a few golden motes surround the final photograph. All rooms use framed cameras rather than free walking.

A little illustrated husnisse appears in each room, celebrates discoveries and plays with a brass button when tapped or activated with the keyboard. This optional encounter never gates a puzzle.

Clouds, window lights, rain and a tiny lantern-bearing passerby bring the village to life. Foreground ivy, curtain folds and soft moving shadows add restrained depth. The final developing bath lifts a constellation from the water; the attic finale dims the room, gathers stars and sends them toward the opening photograph over a 6.5-second sequence. The photo action appears after that sequence.

An original procedural Web Audio soundscape starts with the Start spillet gesture. Soft chords, sparse melody and filtered weather evolve with each room and discovery; paper, brass, water, doors and the nisse have quiet interaction sounds. A compact speaker button mutes or resumes sound. Hidden pages suspend audio and rendering; replay resets musical progress. The game remains playable when audio is unavailable or blocked, with a retry control for blocked playback. No external audio assets or network audio requests are needed.

Object taps create brief warm ripples; discoveries sparkle and completed puzzles receive a brighter glow. Dialogs and the final photograph arrive gently. Wrong answers and repeated discoveries do not celebrate progress.

The separate entrance loads first; Start Game loads the renderer on demand. The toolbar uses compact icons with accessible labels, and object feedback is brief. Durable art and interaction direction is recorded in this demo's `AGENTS.md`.

The exact Babylon release (12 November 2026) meets the repository’s seven-day release-age policy. Focused imports avoid unused engine systems. The renderer uses up to two physical pixels per CSS pixel (fixing the previous undersampling on dense phone screens). Portrait illustrations are 941 × 1672; wide illustrations are 1672 × 941. These are native generated dimensions, not 4K assets. The game fits each composition without enlarging a narrow crop. Only the current room’s meshes and lights are enabled; alternate orientations load on demand. Animation is capped around 30 fps and hidden pages stop drawing. WebGL is required.

The final Fallow review has no dead-code findings, duplication, or cyclomatic/cognitive limit violations. It retains advisory CRAP scores for UI and rendering functions because browser exercise is not imported as line coverage. The complete browser journey, wrong answers, keyboard access, touch, orientation changes, replay, animated frames were checked separately; real-device iPhone Safari acceptance remains unverified.

## iPhone display behavior

The layout uses dynamic viewport height and safe-area insets. The fullscreen control checks browser capability and handles rejected requests. Where unsupported, a clearly labeled App view button replaces the fullscreen icon and explains Share → Add to Home Screen → Open as Web App (if offered). The manifest requests standalone display and includes an app icon; there is no offline service worker. Opening a temporary tunnel from the Home Screen still requires that tunnel to remain online. App view is not a promise of hardware fullscreen on every iPhone.

References: [WebKit's open iPhone fullscreen issue](https://bugs.webkit.org/show_bug.cgi?id=206854), [Chrome's iPhone Home Screen instructions](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DiOS&hl=en), and [Apple's web-app instructions](https://support.apple.com/guide/iphone/turn-a-website-into-an-app-iphea86e5236/ios). Real-device iPhone acceptance is still required.
