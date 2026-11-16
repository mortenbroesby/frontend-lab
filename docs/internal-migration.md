# Move the lab into GitHub Enterprise Cloud

This repository is prepared for migration; no destination repository or team permissions have been created. Participants run the app locally. Temporary Vercel hosting is documented in [hosting and removal](hosting.md); reassess it before the internal migration.

## Repository and access

1. Agree the destination organization, repository name, chapter team and maintainers. Use the enterprise's approved transfer/import procedure; preserve Git history if permitted. Review history before copying it into a different audience. Do not mirror-push over an existing repository.
2. Keep the repository private, or choose internal visibility if enterprise-wide read access is intended. Grant the chapter team **Write** so participants can push their own branches. Repository visibility alone does not grant write access.
3. Keep `main` as the default branch, or update the verification workflow's branch trigger if renamed. Consider requiring PRs and the `verify` check on `main`; this still permits everyone to push demo branches.
4. Clone from the destination's **Code → SSH** URL, or change a reviewed existing clone's `origin`. Follow [CONTRIBUTING.md](../CONTRIBUTING.md). Git hooks are local and must be installed in each clone.
5. Confirm the organization permits the actions in `.github/workflows/lab.yml`, or adapt it to approved equivalents and runners. The workflow only verifies code; it does not deploy anything. Node/npm dependencies must be available through the approved registry/network.

## Local setup and source links

Use Node 24, run `npm ci` and `npm run dev` at the repository root, then open the printed URL. After a contribution merges, pull `main` and restart/install dependencies when needed. There is no live synchronization between colleagues' apps.

Participant guides are bundled from `gallery/src/content/` and use in-app routes. No source-repository environment variable is required. Repository entry documents describe local startup and do not depend on a deployment URL.

## Workshop identity

The shell's palette is in `gallery/demo-kit/theme.css`. Track colors follow track IDs, not gallery position. Keep experimental demo artwork and scoped styles independent. The workshop uses the Front-End Lab identity and does not require Sapphire or an internal component package registry.

## Acceptance before inviting participants

- A colleague can clone, install and run the app on their actual device/network.
- The chapter team can generate a named demo, push a branch and open a PR.
- Verification runs in the destination, with its approved runner and action policies.
- After merge and pull, another colleague sees the new demo in the local gallery.
- Track guides and their links work inside the app on the destination host.
- Fallow's per-clone Git hook and agent trust/setup instructions work in the chosen clients.

Still to decide: destination organization/repository, chapter team and maintainers, visibility, branch rules and any enterprise-specific registry/runner requirements. The temporary Vercel project can be removed or replaced independently.
