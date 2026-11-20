# Merge Bouncer

Guard the release gate as an office knight. Merge five clean pull requests, then stop the Merge Troll.

## Run

From the repository root, use Node 24 and the pinned npm version. Run `npm ci` once on a fresh checkout, then start the demo:

```sh
npm run dev --workspace @lab/demo-merge-bouncer
```

Open the printed URL and choose **Start game**. To play on a phone over Wi-Fi, add `-- --host 0.0.0.0` to the command and open the printed **Network** URL on your phone.

## Play

Stay in the middle lane. When the first courier reaches the brass gate, press **Space** to merge the button fix. For each new arrival, read the label and choose:

| At the gate | Key |
| --- | --- |
| **Merge** a clean change | Space |
| **Test** an uncertain change. It returns in the same lane with a verdict. | N |
| **Bounce** a bug | M |

Move with **WASD** or the **arrow keys**. On a touchscreen, tap a lane and then an action. Choose **Pause → Help** for a reminder.

Three strikes end the shift. After five clean merges, the troll arrives in the middle lane. **Test it, then bounce it when it returns** to win.

## Try a change

Set `runner: true` on the first courier in the `release` list and replay. How much sooner does it reach the gate? [Edit the round rules](./rules.ts).

Run the rule tests from the repository root:

```sh
npm test --workspace @lab/demo-merge-bouncer
```
