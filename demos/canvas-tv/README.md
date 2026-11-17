# Remote / Canvas TV

A keyboard-first TV interaction study. React owns selection; Canvas 2D paints the entire 1280 × 720 composition. Generated landscapes and fictional titles require no network services. This does not use Lightning or implement a custom React renderer.

```sh
npm run dev --workspace @lab/demo-canvas-tv -- --host 0.0.0.0
npm run check --workspace @lab/demo-canvas-tv
npm test --workspace @lab/demo-canvas-tv
```

Focus the screen, use arrow keys to browse, Enter to play an animated short; Escape hides the controls, then returns. Tab leaves the screen normally. Fullscreen TV keeps the 16:9 screen and touch remote together; Escape also exits browser fullscreen, so Backspace can return from playback while staying fullscreen. On-screen remote buttons offer touch and semantic keyboard controls; selection is also announced as text. The mountain panorama uses parallax layers, drifting mist and a changing night sky. System reduced motion freezes the background and disables focus/scroll animation. Hidden tabs stop repainting. This models a directional remote with a keyboard; physical TV devices have not been tested.

`playback-machine.ts` uses the lightweight `xstate/fsm` entry point (pinned XState 6 beta) for browsing, visible controls and unobstructed playback. `navigation.ts` combines those modes with selection and subtitle data; it does not start an actor runtime. The [state-machine guide](../../gallery/src/content/tracks/code-quality/state-machines.mdx) explains the model.

`catalogue.ts` owns fictional content, `navigation.ts` owns selection and return behaviour, `paint.ts` draws the interface, `scenery.ts` draws the animated panorama and caches static posters, and `use-screen.ts` handles resolution, frame scheduling and cleanup. The gallery discovers the workspace automatically. The presentation embeds its HTML entry with `?embed=1` without importing its components. Embedded mode shows the screen, a compact touch D-pad with OK and Back, and accessible selection text; its keyboard events cannot advance the parent deck.

Selecting a title replaces the catalogue with a full-frame procedural mountain flight: camera movement, parallax and drifting lights. The 45-second scene fades out and loops. It is silent, generated locally and needs no external video assets. Back hides playback controls first; a second Back restores the catalogue selection. This fills the TV canvas without forcing the browser or presentation out of its current fullscreen mode. Reduced motion shows a still scene. `playback.ts` owns this view.

## Optional phone remote

Choose **Connect phone**, then scan the QR code on a phone. Keep both screens open: the TV owns selection and playback; the phone sends directional commands and displays the current title. Keyboard and touch controls remain usable. **Disconnect phone** closes the room; connecting again generates a fresh link.

Pairing requires trusted HTTPS (or localhost for same-computer experiments), internet and WebRTC. Plain HTTP over a LAN will not pair. Trystero uses public Nostr signaling; controls travel over WebRTC. One phone can join; treat the random pairing link as permission to control this TV. No TURN relay is configured, so restrictive networks may prevent connection. Reconnect or scan a fresh code if a mobile browser suspends the page. No network connection starts until pairing is enabled.

`use-phone.ts` owns connection cleanup and synchronization; `remote-protocol.ts` validates received controls and display snapshots. No cross-demo imports or custom backend.

During playback, a control bar slides up with **Off**, **English** and **Dansk** demo subtitles. Left/right moves focus; OK applies the option. Captions are illustrative text for the silent generated scene, not a real subtitle track. The phone shows the active and focused options. Up or Back slides the overlay away while captions stay visible. Down or OK brings it back; Back with the overlay hidden returns to the catalogue. Reduced motion shows the controls immediately and keeps the scene still.
