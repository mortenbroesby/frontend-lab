# Merge Bouncer

A three-lane arcade game about reviewing pull requests. You’re the office knight at the brass gate. A clerk brings you a four-line button fix. The next courier claims to have fixed a typo in 912 lines. Which one do you let into `main`?

## Run the demo

From the repository root, use Node 24 and the npm version pinned in [package.json](../../package.json). On a fresh checkout, run `npm ci` once. Then start the game:

```sh
npm run dev --workspace @lab/demo-merge-bouncer
```

Open the address Vite prints and choose **Start game**. To play on a phone on the same Wi-Fi, append `-- --host 0.0.0.0` to the command and open Vite’s **Network** address on the phone.

## Your first shift

1. Stay in the middle lane for the first courier. Read the PR label, wait for the courier to reach the brass gate, then **Merge** the button fix.
2. Watch the other lanes. Purple interns run faster than clerks. **Bounce** a risky change or **Test** one you’re unsure about. A tested PR returns in the same lane with a verdict.
3. Merge five clean PRs within the 45-second release window to summon the **Merge Troll**. It carries a shielded, 9,999-line PR down the center lane. **Test** it at the gate, then **Bounce** it on its return to win.

Merging a bad PR or letting one slip past costs a strike. Three strikes end the shift. The troll gets its own 18-second clock, and letting it through ends the game immediately.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | A/D or ←/→ to switch lanes. W/S or ↑/↓ to step forward or back. | Tap a lane. |
| Merge / Test / Bounce | Space / N / M | Tap the matching action. |
| Scout another lane | Q | Tap the duck. |
| Extend the clock once | E | Tap **+10 sec**. |

**Pause → Help** keeps the clock stopped while you check the controls. **Settings** remembers sound and reduced-motion preferences in this browser. **Fullscreen** is available on supported devices.

## Scoring and upgrades

A clean merge or a correctly bounced bug earns one story point and builds a score multiplier up to 5×. Testing preserves the chain. Bouncing a bug also banks a duck scout that can reveal an approaching PR in another lane.

Open **Upgrades** to pause the shift and spend two story points. The **Fold-out gate** lets you review earlier. The **Spring-loaded stamp** shortens the wait between reviews. Each lasts for the current shift.

## Change the game

For a first experiment, mark the opening courier as a runner in the `release` list and replay the shift. Watch how much sooner you need to react.

| To change… | Start here |
| --- | --- |
| Arrivals, verdicts, scoring or the boss encounter | [rules.ts](./rules.ts) |
| How creatures move and scale across the hall | [board.ts](./board.ts) and [hall.ts](./hall.ts) |
| Keyboard, touch or the in-game HUD | [index.tsx](./index.tsx) |

Phaser draws the hall. React handles input and menus. The round rules run independently of both, so you can check timing and win conditions without opening a browser:

```sh
npm test --workspace @lab/demo-merge-bouncer
npm run check --workspace @lab/demo-merge-bouncer
```

The repository and pull requests inside the game are fictional. The [GitHub mark](https://github.githubassets.com/favicons/favicon-dark.svg) is bundled locally.
