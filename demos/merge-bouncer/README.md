# Merge Bouncer

Move between three lanes with the arrows or touch buttons. When a pull request enters the striped review zone, merge (J), test (K) or bounce (L). Testing schedules a same-lane return with a definitive verdict. A missed bad change counts as a regression. Extend the 45-second release once with E.

Bounce a bad PR to bank one duck scout. Press D or tap **Send duck scout** to reveal the verdict of the nearest approaching PR in another lane. If there is no target yet, the duck waits and you keep the scout.

Clean merges and correctly bounced bugs earn 100 points times your chain, up to 5×. Testing keeps the chain. Wrong calls and missed PRs break it. Five clean merges still win the shift.

From the repository root, run `npm run dev --workspace @lab/demo-merge-bouncer`. Edit the handcrafted arrivals in `rules.ts` to change the difficulty. Phaser draws the board in `board.ts`; the round rules also run independently with `npm test --workspace @lab/demo-merge-bouncer`.
