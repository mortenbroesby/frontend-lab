# Paired presenter remote

Goal: a phone controls the audience screen and displays its current notes, slide count, next title and elapsed time. Keyboard and phone navigation share the same host state.

## Implementation

- Pair explicitly from Presenter view, using a random 128-bit token in a QR/link fragment. Disconnect ends the session; another pairing creates a new token.
- Reuse installed Trystero and qrcode.react libraries, already used by Canvas TV. Keep presentation code independent of demo modules.
- Use WebRTC data channels with public signalling; no paid backend or new hosting service. HTTPS is required on phones. Some networks block peer connectivity; show this clearly rather than promising universal access. A managed relay remains a separate decision if real-device testing needs it.
- The audience window owns navigation and timer state. The phone receives snapshots, never runs embedded demos, and sends only validated arrows, OK and Back commands. Validate incoming payloads and accept one paired peer.
- Send periodic snapshots as a heartbeat. Disable controls when stale or disconnected; do not queue navigation while offline. Reconnect receives the latest host state. Suppress duplicate request IDs.
- Phone layout: status, current title/count, a directional remote and current focus label, notes, next title, elapsed time. Keep notes off the audience view. Pairing is capability-based: anyone with the link can control that session.

## Verification

Protocol tests cover malformed messages, session tokens and valid slide ranges. Verify two browser pages pair, phone and keyboard both advance, notes follow, bounds hold, disconnect disables controls, reconnect recovers, and embedded demo slides still work. Check a narrow phone viewport and standalone/combined builds. Report browser-local evidence separately from actual cross-network phone acceptance.

## Evidence (18 November 2026)

- Existing `npm run check` passed across all 32 workspace tasks; focused presentation checks passed after the final UI changes.
- Fallow change audit reports no introduced issues.
- Playwright paired two browser pages through the public signalling relays. Phone navigation and laptop keyboard navigation synchronised; notes stayed off the audience screen. Disconnect disabled navigation, phone reload reconnected, and a new pairing fragment joined without a manual reload.
- A 390px phone viewport has no horizontal overflow and 64px navigation targets. The clean audience view retains its remote connection.
- Rejoining the same room in place proved unreliable in the installed transport. The phone's Reconnect action deliberately reloads its remote view, retaining the session link. The host is not reloaded.
- Actual iPhone/cellular-to-projector acceptance remains a user-device check. Public signalling and WebRTC are not a guarantee on every corporate network.

## Focus routing

`@lab/demo-kit/focus` defines six commands and the keyboard mapping. The presentation routes input to its mounted demo first, then to slide navigation if unhandled. The TV owns its playback and catalogue state; origin-checked iframe messages carry input and the current focus label, not application state. Leaving the slide removes the input handler. The TV always receives focus on arrival in either direction. Back unwinds playback and catalogue, then goes directly to the previous slide and notes. There is no inactive TV or entry overlay. A 400 ms guard consumes trailing Back taps after leaving the TV. Continue presentation advances to the next slide. Keyboard Escape remains exit-only at slide level. No second pairing is needed for the presentation phone.

## Focus review

The supported path is slides → TV catalogue → TV playback. Browser Beat and arbitrary demos do not register a focus handler. Native form controls and dialogs retain their own keyboard behaviour; browser fullscreen shortcuts remain browser-owned.

A review reproduced and fixed two lifecycle failures: an iframe reload no longer loses the activation handshake, and Back escapes even when the initial TV load fails. Held Back/OK keys no longer repeat through TV levels. Registration cleanup only removes its own handler. Browser verification covers reload, blocked iframe loading, restored slide navigation and held-key behaviour, alongside the phone and keyboard journeys above. Cross-network phone reliability still depends on the WebRTC transport.
