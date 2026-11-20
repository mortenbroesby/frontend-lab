# Merge Bouncer

## Playfield conventions

The Phaser playfield projects sprites through a three-lane sorting hall. Keep touch hit areas and the review rail aligned with the floor projection in `hall.ts`.

- Represent incoming pull requests as shambling office creatures. A creature can carry a crooked file folder or drag a stack of printouts. Clean and risky PRs both get personalities. Players should decide their fate from review clues.
- Put a compact label above each creature. Keep its PR number, title, change size and build or test result legible on a phone. Keep labels upright and clear of neighboring lanes as creatures move.
- Frame the three lanes from slightly farther back. Use a shallow 2.5D perspective within the 4:3 playfield: arrivals appear smaller at the far end and grow as they approach. Give the knight a larger foreground silhouette and leave the gate visible around the stamp.
- Give creatures distinct, predictable approach speeds. Let their stride signal their pace. Derive their position, arrival time and review window from the same movement rules. A tested PR still returns to its announced lane with a readable verdict.
- Preserve the GitHub review loop: merge, test or bounce. Check overlapping slow and fast arrivals, the upgraded gate, reduced motion and touch play before tuning the difficulty.
