# Presentation

A 17-slide introduction to the chapter day: the four tracks, Browser Beat, Orbit, Canvas TV, then a closing invitation and questions. Historical project details stay in presenter notes. [WORKING-DRAFT.md](WORKING-DRAFT.md) captures the running order, confirmed recollections and open questions.

```sh
npm run dev --workspace @lab/presentation -- --host 0.0.0.0
npm run build --workspace @lab/presentation
npm run preview --workspace @lab/presentation -- --host 0.0.0.0
```

The gallery build includes `/presentation/` (relative to its hosting base). Open it through the gallery command palette or the Konami code. It is deliberately absent from normal navigation.

## Present

The deck opens with edge-to-edge slides and no surrounding chrome. Use arrow keys or Space outside interactive controls. On touch screens, swipe left on a slide to advance or right to go back. Vertical scrolling and pinch zoom remain available. Embedded demos keep their own touch controls; swipes inside the TV or synthesizer do not change slides. Show controls reveals navigation, presenter tools and Back to app. Choose Fullscreen to fill the display and hide controls again; Escape exits browser fullscreen. Browsers require a click to enter fullscreen. Slides keep their 16:9 proportions, with matching dark space on other screen shapes.

Presenter view keeps the current slide, next-slide preview, notes and an elapsed timer in one window. **Do not project presenter view:** notes are visible in that window. Connecting a phone remote switches the main screen to clean slides. Presenter view remains available to manage the connection, but its notes stay hidden while the remote is connected. Switching views does not end pairing. The timer starts when the presentation opens and continues across view changes; Reset timer restarts it. Reloading resets it.

## Phone remote

1. Open **Show controls → Presenter view → Presenter remote → Start pairing** on the audience screen.
2. Scan the QR code with your phone, or open the pairing link on another device.
3. Wait for **Connected**, then use the directional remote. Arrows navigate slides; Back goes to the previous slide; The TV takes focus automatically when its slide opens. In the TV, arrows and OK control its interface, and Back moves outward through playback, catalogue and slides. The Focus label shows where commands go. The phone shows a preview of the current slide, notes, the next title and the audience timer. Interactive slides use static previews: the phone does not run a second TV or synthesizer. Hide the laptop controls to return to clean slides; pairing stays active.

Use HTTPS and internet on both screens. Localhost works for desktop testing, but an ordinary LAN HTTP URL cannot pair a phone. This uses WebRTC and public signalling; networks that block peer connections may prevent pairing. Reconnect reloads the phone view using the same pairing link. Controls disable while disconnected, and missed presses are not queued. Keep both screens awake.

**Disconnect remote** ends the session. Starting again creates a new private link; anyone holding it can control that session. Reloading the audience window ends pairing. The presentation remote follows the active focus. The standalone TV also retains its own optional phone pairing.

## Author

Edit `slides.tsx`. Each entry has a stable, unique `id`, a `title`, a React `Content` component and optional `notes`. Array order is presentation order. The URL hash preserves the current slide on reload.

Use the layout components in `layouts.tsx`, or compose a slide directly. Slides use a 16:9 canvas; container-relative typography keeps the composition consistent. Keep text brief and test your projector size.

Interactive slide components receive `preview`. Render a quiet, disabled representation when it is true. The next-slide preview is also inert and hidden from assistive technology. Put complex custom interactions inside `data-presentation-interactive` to reserve their keyboard events. Clean up effects when slides unmount. The TV slide embeds the independent Canvas TV demo in an iframe (`?embed=1`), with no component imports between workspaces. Reaching the TV slide always enters the TV, including when moving backward. There is no entry overlay. Back unwinds playback controls, playback and the catalogue, then moves directly to the previous slide and its notes. **Next slide** on the presenter remote or **Continue presentation** below the TV moves forward immediately, even during playback. A brief 400 ms guard after leaving the TV absorbs repeated Back taps. Keyboard Escape follows the TV’s Back hierarchy but does not rewind ordinary slides; Backspace does. Presenter previews use a static placeholder, not another live app. The combined gallery build supplies its URL automatically, including under a base path. For a standalone deck, set `VITE_GALLERY_URL` to the running gallery URL before starting or building.

The TV’s optional **Connect phone** QR code also works inside the slide. Use trusted HTTPS and internet on both screens. The phone controls the TV, not the deck; leaving the slide closes its connection. A standalone deck needs `VITE_GALLERY_URL` for demo embeds and the Back to app link.

Orbit and Browser Beat use the same independent iframe bridge for remote walkthroughs. **Next part** advances one named step; **Back** reverses a step, then returns to the previous slide. The final step offers **Next slide**. **Play demo** advances the sequence with five-second pauses; **Stop demo** cancels it. A completed sequence never advances the deck. Manual interaction takes over and cancels automation. You can always use the separate **Skip demo** button to leave immediately.

Browser Beat sweeps the actual tone, echo and pitch sliders, then stops the sound. Browsers may require one **Play** tap on the audience screen before remote audio works; a blocked start shows that instruction on the remote. Orbit scrolls through the object story and changes its finish, respecting reduced motion. Its live slide uses a responsive viewport and fills the available height in clean presentation mode; the tour ends with six presets and a continuous colour-blending slider. Browser Beat retains its fixed widescreen viewport. Leaving a slide destroys its iframe and resources. Remote previews remain static.

Demo steps stay in their own workspaces. `@lab/demo-kit/use-walkthrough` provides cancellation and a source/origin-checked message contract; the presentation only receives step labels and status. Standalone demos do not activate this bridge. Remote commands carry the current slide index so delayed commands cannot act on another slide.

### Demo readiness

TV, Orbit and Browser Beat report app readiness over the existing origin-checked iframe bridge. Until the demo responds, its directional inputs stay in the demo instead of advancing the slides. After eight seconds without a response, the presentation and remote offer **Retry demo**; retry creates a fresh iframe. **Next slide** on the remote and the existing Continue presentation link remain deliberate ways to skip. A late response can recover without reloading. Loading checks do not unlock audio or change browser permissions.
