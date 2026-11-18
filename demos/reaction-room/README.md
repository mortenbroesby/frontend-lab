# Reaction Room

A shared reaction wall for up to 30 connected screens, including the projector. Create a generated room code, share its link or QR code, and tap one of six icons. Eight taps from three different connections within four seconds put an icon on fire; it cools down when the group stops.

## Run the whole demo

From the repository root, using Node 24:

```sh
npm run build --workspace @lab/demo-reaction-room
npm start --workspace @lab/demo-reaction-room
```

Open `http://<laptop-LAN-IP>:4395` on every device. The process serves the built app and WebSocket rooms together, bound to `0.0.0.0`. `PORT` and `HOST` override the defaults. Everyone needs access to that server; no internet or WebRTC signaling service is needed on the same LAN. A QR code opened from localhost only works on that computer: open the LAN address before sharing with phones.

For frontend editing, run the server and set `VITE_REACTION_SERVER_URL=http://localhost:4395` when starting the demo's existing Vite dev command. Use the LAN address instead when testing another device.

## Connections and hosting

The server keeps rooms in memory. It assigns sender IDs, validates six allowed icons, caps each room at 30 sockets, rate-limits senders, removes disconnected peers and broadcasts the authoritative participant count. Empty rooms disappear; restart loses all rooms. Codes are public labels, not authentication. Counts describe screens, not identifiable people.

The client batches at most two taps per 200 ms and limits taps to roughly ten per second. It shows local taps immediately, keeps four seconds of reaction history and at most 64 floating icons. Totals are per visit; late arrivals do not replay history. Reduced motion uses stationary icons. Disconnect disables sending; Retry reconnects without replaying missed taps.

Public hosting is **not configured**. Use one long-running Node process with WebSocket upgrades behind HTTPS. Static hosting alone cannot run this server. If the gallery is hosted separately, build it with `VITE_REACTION_SERVER_URL=https://your-room-server` and set the server's `ALLOWED_ORIGINS` to the gallery's exact origin (comma-separated for multiple origins). The client uses `/rooms/<code>` on that origin and upgrades HTTPS to WSS. Same-origin deployments need no environment setting. Multiple server instances would need shared rooms or sticky routing; that is outside this small workshop server.

## Why a server?

The previous Trystero/WebRTC version worked in a 12-browser check but fragmented at 30, including with its experimental scaling plugin. The chapter-wide version uses one WebSocket connection per screen. The TV demo remains a separate WebRTC example.

## Verification

```sh
npm test --workspace @lab/demo-reaction-room
npm run check --workspace @lab/demo-reaction-room
```

The server test connects 30 clients, verifies delivery to every other client, rejects a 31st, reopens a seat after departure, isolates rooms and rejects invalid payloads/origins. Browser verification connected 30 tabs and sent eight taps from each: all 30 received 240 reactions, all entered fire state, and particles stayed capped at 64. Create/join/leave, cooling, fullscreen and phone-width layout were also checked. These are laptop browser checks, not acceptance on 30 physical devices or the chapter's network.
