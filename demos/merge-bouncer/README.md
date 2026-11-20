# Merge Bouncer

Move between three lanes with the arrows or touch buttons. When a pull request enters the striped review zone, merge (J), test (K) or bounce (L). Testing schedules a same-lane return with a definitive verdict. A missed bad change counts as a regression. Extend the 60-second release once with E.

From the repository root, run `npm run dev --workspace @lab/demo-merge-bouncer`. Edit the handcrafted arrivals in `rules.ts` to change the difficulty. Phaser draws the board in `board.ts`; the round rules also run independently with `npm test --workspace @lab/demo-merge-bouncer`.
