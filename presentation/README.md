# Presentation

A 17-slide introduction to the chapter day: the four tracks, Browser Beat, alternative inputs and rendering through a TV example, then starting points for participants. Historical project details stay in presenter notes. [WORKING-DRAFT.md](WORKING-DRAFT.md) captures the running order, confirmed recollections and open questions.

```sh
npm run dev --workspace @lab/presentation -- --host 0.0.0.0
npm run build --workspace @lab/presentation
npm run preview --workspace @lab/presentation -- --host 0.0.0.0
```

The gallery build includes `/presentation/` (relative to its hosting base). Open it through the gallery command palette or the Konami code. It is deliberately absent from normal navigation.

## Present

The deck opens with edge-to-edge slides and no surrounding chrome. Use arrow keys or Space outside interactive controls. Show controls reveals navigation, presenter tools and Back to app. Choose Fullscreen to fill the display and hide controls again; Escape exits browser fullscreen. Browsers require a click to enter fullscreen. Slides keep their 16:9 proportions, with matching dark space on other screen shapes.

Presenter view keeps the current slide, next-slide preview, notes and an elapsed timer in one window. **Do not project presenter view:** notes are visible in that window. Connecting a phone remote switches the main screen to clean slides and hides the Presenter view option. Disconnecting leaves notes hidden; show controls and explicitly choose Presenter view to restore them. The timer starts when the presentation opens and continues across view changes; Reset timer restarts it. Reloading resets it.

## Phone remote

1. Open **Show controls → Presenter remote → Start pairing** on the audience screen.
2. Scan the QR code with your phone, or open the pairing link on another device.
3. Wait for **Connected**, then use the directional remote. Arrows navigate slides; Back goes to the previous slide; OK enters an interactive demo. In the TV, arrows and OK control its interface, and Back moves outward through playback, catalogue and slides. The Focus label shows where commands go. The phone shows a preview of the current slide, notes, the next title and the audience timer. Interactive slides use static previews: the phone does not run a second TV or synthesizer. Hide the laptop controls to return to clean slides; pairing stays active.

Use HTTPS and internet on both screens. Localhost works for desktop testing, but an ordinary LAN HTTP URL cannot pair a phone. This uses WebRTC and public signalling; networks that block peer connections may prevent pairing. Reconnect reloads the phone view using the same pairing link. Controls disable while disconnected, and missed presses are not queued. Keep both screens awake.

**Disconnect remote** ends the session. Starting again creates a new private link; anyone holding it can control that session. Reloading the audience window ends pairing. The presentation remote follows the active focus. The standalone TV also retains its own optional phone pairing.

## Author

Edit `slides.tsx`. Each entry has a stable, unique `id`, a `title`, a React `Content` component and optional `notes`. Array order is presentation order. The URL hash preserves the current slide on reload.

Use the layout components in `layouts.tsx`, or compose a slide directly. Slides use a 16:9 canvas; container-relative typography keeps the composition consistent. Keep text brief and test your projector size.

Interactive slide components receive `preview`. Render a quiet, disabled representation when it is true. The next-slide preview is also inert and hidden from assistive technology. Put complex custom interactions inside `data-presentation-interactive` to reserve their keyboard events. Clean up effects when slides unmount. The TV slide embeds the independent Canvas TV demo in an iframe (`?embed=1`), with no component imports between workspaces. Reaching the TV slide going forward (or opening its URL directly) automatically hands focus to the TV. Going backward lands on the slide without entering the TV; OK enters it. After returning to the slides, **Enter TV demo** lets you re-enter. **Back to slides** returns focus without advancing; Escape first hides playback controls, then closes playback, then returns to the deck. The TV touch remote follows the same Back sequence. **Continue presentation** advances when you are ready. The paired presenter phone controls the TV while it has focus; **Back** follows the TV’s playback and catalogue hierarchy before returning to slides. Returning stops playback and retains the catalogue selection. A brief 400 ms guard absorbs repeated Back taps at the handoff; the next deliberate Back moves to the preceding slide and notes. Keyboard Escape only exits the current experience; Backspace moves to the previous slide at deck level. Presenter previews use a static placeholder, not another live app. The combined gallery build supplies its URL automatically, including under a base path. For a standalone deck, set `VITE_GALLERY_URL` to the running gallery URL before starting or building.

The TV’s optional **Connect phone** QR code also works inside the slide. Use trusted HTTPS and internet on both screens. The phone controls the TV, not the deck; leaving the slide closes its connection. A standalone deck needs `VITE_GALLERY_URL` for demo embeds and the Back to app link.
