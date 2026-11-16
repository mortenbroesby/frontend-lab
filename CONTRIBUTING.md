# Bring an experiment to the lab

Use the shared internal repository. Everyone participating should have **Write** access through the chapter's GitHub team; maintainers configure that during migration. No personal fork is required.

1. Clone using **Code → SSH** in the repository you are contributing to. Use Node 24 and run `npm ci` from its root.
2. Run `npm run fallow:status`, then `npm run fallow:hooks` if the local Git hook is absent. Agent users can follow the [official Fallow setup](tracks/b/fallow.md#set-up-agents-and-commit-checks).
3. Start from current `main`: `git switch main`, `git pull --ff-only`, then `git switch -c demo/your-idea`.
4. Run `npm run demo:new`, give your demo a name and choose a unique ID. Run `npm run dev` and follow the printed address.
5. Keep code, scoped styles and notes in your demo directory. Share useful discoveries even if the experiment is unfinished.
6. Run `npm run check`. For browser behavior changes, also run `npm run test:browser` with the [browser setup](playground/README.md). Commit your scoped files and push your branch with `git push -u origin HEAD`.
7. Open a pull request describing what to try and what you learned. Once merged, the enabled Pages workflow publishes the shared gallery; local users pull `main`.

The registry is shared. If two demos conflict in `playground/src/demo-registry.ts`, retain both entries with unique IDs, preserve the generator marker, and rerun checks. Do not overwrite someone else's demo to resolve a conflict.

Keep example data synthetic. Internal repository access does not authorize copying another project's source, credentials or participant data. Shared shell changes should remain useful to all four tracks. The shell uses the Front-End Lab theme; Sapphire is not required for this workshop.

The static site displays the merged collection. It has no upload endpoint or live synchronization: Git and pull requests are how contributions arrive.
