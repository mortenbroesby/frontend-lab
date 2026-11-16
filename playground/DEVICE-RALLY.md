# Device rally

Open the same room on two computers and send giant emoji cheers. This finished Modern Web Capabilities example uses **Trystero 0.27 and WebRTC data channels**. Trystero handles room discovery and connection negotiation; there is no custom relay server, host election or backend command.

## Try it together

On each participant’s computer, with Node 24, run from the repository root:

```sh
npm ci
npm run dev
```

Open the printed localhost URL and choose **Device rally** in the gallery, or append `/#/demo/device-rally`. Everyone automatically joins `friday-lab`. Wait for the other-device count to rise, then tap 🚀, ✨ or 💜. The other screens react immediately. The buttons stay disabled until a peer actually connects.

For a separate group, select **Leave room**, enter the same short room code on each device, then **Join room**. Joining refreshes the page to create a fresh peer session and puts the code in the URL so you can share it. Codes accept lowercase letters, digits and hyphens, up to 24 characters. This example caps room membership at 12 and uses an ephemeral browser-session identity. Its counter counts cheers seen during this visit, not a globally synchronized score. Late joiners start at zero; missed cheers are not replayed.

## Network requirements

- Internet access is required for discovery through Trystero’s default public Nostr signaling relays. Same room means same peers even if each computer serves the app from its own localhost port. This is not offline LAN discovery.
- Cheers use peer-to-peer WebRTC once connected. Participants can be on different networks; they do not have to share Wi-Fi. Public signaling availability and direct peer connectivity are separate requirements.
- Trystero needs Web Crypto: use **localhost or trusted HTTPS**. Plain `http://192.168.…` on a phone is not a secure context and the demo explains this. A phone cannot use your laptop’s localhost URL. Phone access needs a trusted HTTPS URL for the gallery; hosting and local certificate setup are outside this example.
- Corporate firewalls, VPNs, guest Wi-Fi isolation and some NAT configurations can prevent peers from connecting. Trystero has default STUN support; this demo does **not** configure a TURN fallback. Test the actual workshop network beforehand. If it blocks connections, use an approved alternative network. Do not paste TURN secrets into browser source.
- No special development-server mode is needed. A static build also works when served on localhost or trusted HTTPS, provided the network permits signaling and WebRTC.

Room codes are grouping labels, not passwords. Anyone using this app and room can join. Signaling uses third-party public relays; peers exchange connection information and may learn each other’s IP addresses. Use playful signals only. There are no camera/microphone permissions, accounts or saved cheer history. If immediate rejoining stalls, refresh both pages and join the same room again. Leaving or navigating away closes the room; Trystero manages connection discovery and teardown. No device becomes an authoritative server.

## Build an independent experiment

Keep `src/demos/device-rally/Demo.tsx` as the finished reference. Use `npm run demo:new` to create your own demo under **Modern Web Capabilities**. Try a local interaction first, then use Trystero’s small API:

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

Use your own app ID so incompatible experiments do not share messages. Validate received values, handle `room.onError`, and wait for previous teardown before joining the same room again. The finished React example handles these lifecycle details, including Strict Mode.

Read [Trystero’s getting-started guide](https://trystero.dev/docs/getting-started/) and [connection troubleshooting](https://trystero.dev/docs/connections/) for the library API and TURN options.

## Verification

- `npm run check`: generator/unit tests, TypeScript and production build.
- `npm run test:browser`: normal gallery journeys plus deterministic unsupported-browser and unreachable-signaling checks.
- `npm run test:devices`: explicit live smoke test. Three independent browser contexts use real public signaling and WebRTC. Checks two-way cheers, room isolation, leaving and rejoining. Requires Chrome/Playwright browser installation and internet access; public relay availability can affect the result.

The live test verifies separate software clients on one computer. It does not prove physical phone, cross-network NAT traversal or corporate Wi-Fi compatibility. Those require an on-site check.

Verified on 16 November 2026 with Node 24.13.0 and Chrome: 20 generator/unit tests, 13 regular browser tests, the live peer smoke test and the Fallow new-findings audit passed. Immediate same-page rejoining failed in the initial implementation; joining now creates a fresh page session, and the live rejoin assertion passes.
