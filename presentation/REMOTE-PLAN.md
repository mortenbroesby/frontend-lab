# Paired presenter remote

Goal: a phone controls the audience screen and displays its current notes, slide count, next title and elapsed time. Keyboard and phone navigation share the same host state.

## Implementation

- Pair explicitly from presentation controls, using a random 128-bit token in a QR/link fragment. Disconnect ends the session; another pairing creates a new token.
- Reuse installed Trystero and qrcode.react libraries, already used by Canvas TV. Keep presentation code independent of demo modules.
- Use WebRTC data channels with public signalling; no paid backend or new hosting service. HTTPS is required on phones. Some networks block peer connectivity; show this clearly rather than promising universal access. A managed relay remains a separate decision if real-device testing needs it.
- The audience window owns navigation and timer state. The phone receives snapshots, never runs embedded demos, and sends only previous/next requests. Validate incoming payloads and accept one paired peer.
- Send periodic snapshots as a heartbeat. Disable controls when stale or disconnected; do not queue navigation while offline. Reconnect receives the latest host state. Suppress duplicate request IDs.
- Phone layout: status, current title/count, large Previous/Next controls, notes, next title, elapsed time. Keep notes off the audience view. Pairing is capability-based: anyone with the link can control that session.

## Verification

Protocol tests cover malformed messages, session tokens and valid slide ranges. Verify two browser pages pair, phone and keyboard both advance, notes follow, bounds hold, disconnect disables controls, reconnect recovers, and embedded demo slides still work. Check a narrow phone viewport and standalone/combined builds. Report browser-local evidence separately from actual cross-network phone acceptance.

## Evidence (18 November 2026)

- Existing `npm run check` passed across all 32 workspace tasks; focused presentation checks passed after the final UI changes.
- Fallow change audit reports no introduced issues.
- Playwright paired two browser pages through the public signalling relays. Phone navigation and laptop keyboard navigation synchronised; notes stayed off the audience screen. Disconnect disabled navigation, phone reload reconnected, and a new pairing fragment joined without a manual reload.
- A 390px phone viewport has no horizontal overflow and 64px navigation targets. The clean audience view retains its remote connection.
- Rejoining the same room in place proved unreliable in the installed transport. The phone's Reconnect action deliberately reloads its remote view, retaining the session link. The host is not reloaded.
- Actual iPhone/cellular-to-projector acceptance remains a user-device check. Public signalling and WebRTC are not a guarantee on every corporate network.
