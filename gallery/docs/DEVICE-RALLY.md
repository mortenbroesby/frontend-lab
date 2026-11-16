# Device rally

> **Experimental demo.** Untested on physical phones and the workshop network. Restrictive networks may block discovery or connections.

Open the same room on two computers and send giant emoji cheers. This Modern Web example uses **Trystero 0.27 and WebRTC data channels**. Trystero handles discovery and connection negotiation. No custom relay, host election or backend command is needed.

## Try it together

On each participant’s computer, with Node 24, run from the repository root:

```sh
npm ci
npm run dev
```

Open the printed localhost URL and choose **Device rally** in the gallery, or open `/demos/device-rally/index.html`. Everyone joins `friday-lab` automatically. Once another device connects, tap 🚀, ✨ or 💜 to animate its screen. Buttons stay disabled until connected.

For a separate group, **Leave room**, enter the same code on each device, then **Join room**. Joining reloads the page for a fresh peer session and adds the code to the shareable URL. Codes allow up to 24 lowercase letters, digits or hyphens. Rooms allow 12 members with ephemeral browser-session identities. Counters track cheers seen this visit, not a synchronized score. Late joiners start at zero; missed cheers are not replayed.

## Network requirements

- Discovery requires internet access to Trystero’s default public Nostr signaling relays. Matching rooms connect even across separate localhost ports. This is not offline LAN discovery.
- Cheers travel over peer-to-peer WebRTC. Peers can use different networks; public signaling and direct connectivity are separate requirements.
- Web Crypto requires **localhost or trusted HTTPS**. Phones cannot use your laptop’s localhost or plain `http://192.168.…`; the demo explains the secure-context requirement. Phone access needs trusted HTTPS; hosting and certificate setup are outside this example.
- Firewalls, VPNs, guest Wi-Fi isolation and some NAT configurations can block peers. Trystero supplies STUN; this demo has **no TURN fallback**. Test the workshop network; use an approved alternative if blocked. Never put TURN secrets in browser source.
- No special dev-server mode is needed. Static builds work on localhost or trusted HTTPS if signaling and WebRTC are allowed.

Room codes group peers; they are not passwords. Anyone using this app and room can join. Public third-party relays exchange connection information; peers may learn each other’s IP addresses. Use playful signals only. No camera/microphone permissions or accounts are needed; cheer history is not saved. If rejoining stalls, refresh both pages and rejoin. Leaving or navigating away closes the room. Trystero handles discovery and teardown; no device becomes an authoritative server.

## Build an independent experiment

Keep `../../demos/device-rally/index.tsx` as the finished reference. Use `npm run demo:new` under **Modern Web Capabilities**. Start with a local interaction, then try Trystero:

```ts
import { joinRoom } from 'trystero';

const room = joinRoom({ appId: 'your-team/your-experiment', identity: 'none' }, 'your-room');
const cheer = room.makeAction<string>('cheer');
cheer.onMessage(value => console.log(value));
await room.ready;
await cheer.send('🚀');
// When the component unmounts:
await room.leave();
```

Use a unique app ID to isolate incompatible experiments. Validate messages, handle `room.onError`, and await teardown before rejoining. The React example handles this lifecycle, including Strict Mode.

Read [Trystero’s getting-started guide](https://trystero.dev/docs/getting-started/) and [connection troubleshooting](https://trystero.dev/docs/connections/) for the library API and TURN options.

## Try the interaction

Open the same room in two browsers, send a cheer in each direction, then leave and rejoin. Use a different room code to try isolation. This is a manual demo check, not a production acceptance checklist.

Removed browser tests checked separate clients on one computer. They did not establish physical-phone, cross-network NAT or workshop-network compatibility.

## Independent app

Device Rally also runs without the gallery:

```sh
npm run dev --workspace @lab/demo-device-rally
npm run build --workspace @lab/demo-device-rally
npm run preview --workspace @lab/demo-device-rally
```

Deploy `demos/device-rally/dist/` for this app alone. The gallery lists this app and opens its standalone page.
