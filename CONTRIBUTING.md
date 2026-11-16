# Bring an experiment to the lab

Use the shared internal repository. Everyone participating should have **Write** access through the chapter's GitHub team; maintainers configure that during migration. No personal fork is required.

1. Follow [Start Here](README.md#start-here) for access and setup. For a standalone Track C script, Node 24 is enough to experiment; install root dependencies before the repository checks and commit gate.
2. Save or commit any ongoing work before switching branches. Start from current `main`: `git switch main`, `git pull --ff-only`, then `git switch -c demo/your-idea`.
3. After the root install, run `npm run fallow:status`, then `npm run fallow:hooks` if the local Git hook is absent. Standalone-script explorers can do this when ready to commit. Agent users can follow the [official Fallow setup](tracks/b/fallow.md#set-up-agents-and-commit-checks).
4. Follow your track’s bootstrap. For a gallery contribution, use the [demo guide](playground/src/demos/template/README.md). For an investigation or tool, edit the relevant script or add a uniquely named Markdown note under your track; a gallery component is optional.
5. Keep demo code, scoped styles and notes in your demo directory; keep standalone findings beside the relevant track. Share useful discoveries even if the experiment is unfinished.
6. Run `npm run check`. For browser behavior changes, also run `npm run test:browser` with the [browser setup](playground/README.md). Run `npm run analyze:changes` and resolve introduced findings (see the [Fallow guide](tracks/b/fallow.md)). Review `git diff`, stage only your contribution, commit your scoped files and push your branch with `git push -u origin HEAD`.
7. Open a pull request describing what to try and what you learned. Once merged, everyone pulls `main` and runs the app locally to see the shared gallery.

The registry is shared. If two demos conflict in `playground/src/demo-registry.ts`, retain both entries with unique IDs, preserve the generator marker, and rerun checks. Do not overwrite someone else's demo to resolve a conflict.

Keep example data synthetic. Internal repository access does not authorize copying another project's source, credentials or participant data. Shared shell changes should remain useful to all four tracks. The shell uses the Front-End Lab theme; Sapphire is not required for this workshop.

The local app displays the merged collection. It has no upload endpoint or live synchronization: Git and pull requests are how contributions arrive.
