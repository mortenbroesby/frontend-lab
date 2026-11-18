# Reaction Room

Create a room, share its code or QR link, and tap together. The creator’s browser hosts the room and forwards reactions to guests over WebRTC. Six icons pulse in place, gain momentum and warm up with rapid taps. No account, custom room server or environment variables are needed.

## Run

Open the demo from the HTTPS gallery. For two windows on this computer:

```sh
npm run dev --workspace @lab/demo-reaction-room
```

Use HTTPS for phones; plain LAN HTTP is not supported. Both host and guests need internet for PeerJS’s public signalling service. Once connected, reaction messages travel through the host’s WebRTC connections. No database or history is stored.

## How it works

- **Create:** a generated code registers a namespaced PeerJS ID. Only this tab remembers its host role in session storage; invite links contain the room code, not that role.
- **Join:** a guest connects to that ID. Guests connect only to the creator, never to every other guest.
- **React:** the host validates and forwards batches to other guests. Local taps animate immediately and are not echoed back to their sender.
- **Leave:** the host updates the screen count. Closing the host ends the live session; guests can retry after the host returns. There is no host migration or replay of missed reactions.

`connect-room.ts` owns PeerJS lifecycle and errors. `host-room.ts` owns routing, the 30-screen ceiling and per-guest rate limits. `use-reaction-room.ts` batches taps and keeps four seconds of local animation history. The protocol accepts only the six supported icons, at most two per batch. UI rendering remains independent of the transport.

## Experiment limits

Keep the host page open, awake and preferably on a laptop. Phone backgrounding can suspend the host. Public signalling availability, network restrictions and host capacity affect joining and latency; some networks require a TURN relay. No custom TURN service is configured. A 30-screen ceiling is a bound, not a guarantee for every device or network. Split into smaller rooms if needed.

Room codes are public labels, not authentication. A duplicated host tab cannot claim an ID already in use; leave and join it as a guest. Refreshing the host disconnects guests; retry once it is ready again. Do not use the demo for sensitive data.

[PeerJS documentation](https://peerjs.com/docs/) explains signalling and connection limitations.

## Verification

```sh
npm test --workspace @lab/demo-reaction-room
npm run check --workspace @lab/demo-reaction-room
```

Unit tests cover routing without sender echoes, room capacity, seat release, payload validation, rate limits and animation. Browser verification connected one host and 29 guests through public PeerJS signalling. Every screen received all 180 reactions from six taps per screen. Host departure disabled guests; retry after a host refresh restored the connection. These laptop-tab checks are not physical-device/network acceptance.
