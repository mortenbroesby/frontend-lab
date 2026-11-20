# Merge Bouncer

The game fills the browser viewport. Choose **Fullscreen** to hide browser chrome on supported devices.

Choose **Start game** from the title screen. Navigate with the arrow keys and Enter, or tap a choice. **How to play** lists the controls. **Settings** remembers sound and reduced motion on this browser. During a shift, choose **Pause → Settings** to adjust either, then resume.

Clerks shamble down the hall with envelopes. Interns in purple sprint with folders. Read the PR label above each courier to judge the change.

Use A/D to change lanes and W/S to step forward or back at the gate. Arrow keys also move the knight. On touchscreens, tap a lane and an action. When a pull request enters the brass gate, merge (Space), test (N) or bounce (M). Testing schedules a same-lane return with a definitive verdict. A missed bad change counts as a regression. Extend the 45-second release once with E.

Bounce a bad PR to bank one duck scout. Press Q or tap the duck beside the knight to reveal the verdict of the nearest approaching PR in another lane. If there is no target yet, the duck waits and you keep the scout.

Clean merges and correctly bounced bugs earn 100 points times your chain, up to 5×. Testing keeps the chain. Wrong calls and missed PRs break it. Five clean merges still win the shift.

From the repository root, run `npm run dev --workspace @lab/demo-merge-bouncer`. Edit the handcrafted arrivals in `rules.ts` to change the difficulty. Phaser draws the board in `board.ts`; the round rules also run independently with `npm test --workspace @lab/demo-merge-bouncer`.

Open **Upgrades** during a round to pause at the upgrade desk. A clean merge or a correctly bounced bug earns one story point. Two points buy one piece of gear for the current shift. Spending leaves your arcade score intact.

The in-game GitHub repository and numbered pull requests are fictional. The [GitHub mark](https://github.githubassets.com/favicons/favicon-dark.svg) is bundled locally.
