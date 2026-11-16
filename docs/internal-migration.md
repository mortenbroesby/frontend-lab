# Move the lab into GitHub Enterprise Cloud

This repository is prepared for migration; no destination repository, team permissions or Pages site has been created by this preparation.

## Repository and access

1. Agree the destination organization, repository name, chapter team and maintainers. Use the enterprise's approved transfer/import procedure; preserve Git history if permitted. Review history before copying it into a different audience. Do not mirror-push over an existing repository.
2. Keep the repository private, or choose internal visibility if enterprise-wide read access is intended. Grant the chapter team **Write** so participants can push their own branches. Repository visibility alone does not grant write access.
3. Keep `main` as the default branch, or update the workflow's branch trigger and publishing condition if renamed. Consider requiring PRs and the `verify` check on `main`; this still permits everyone to push demo branches.
4. Clone from the destination's **Code → SSH** URL, or change a reviewed existing clone's `origin`. Follow [CONTRIBUTING.md](../CONTRIBUTING.md). Git hooks are local and must be installed in each clone.

## Enable GitHub Pages in the destination

1. Confirm the organization permits Pages, GitHub Actions and the actions used in `.github/workflows/lab.yml`. Adapt the runner if policy requires an internal runner. Node/npm dependencies must be available through the approved registry/network.
2. In **Settings → Pages**, choose **GitHub Actions** as the publishing source. Set the site's access to **private** for the intended internal audience before enabling publication. Private repository visibility by itself is not the Pages visibility setting. Verify both an allowed colleague and a signed-out user after publishing.
3. Review the `github-pages` environment and any required deployment approvals. Add repository Actions variable **`PAGES_ENABLED=true`** only in the destination when ready.
4. Run **Verify and publish the lab** manually on `main`, or push a reviewed change to `main`. The workflow checks/tests/builds before publishing `playground/dist`. PRs run verification and Fallow's introduced-findings audit, without publishing. It does not request a personal access token.
5. Share the URL returned by the Pages deployment. Do not construct it from the repository name: privately published Pages sites can have their own hostname.

Without `PAGES_ENABLED=true`, verification runs but neither an artifact upload nor publication occurs. Actual organization policies, access, runner compatibility and deployment remain to be checked in the destination. The workflow does not change any repository or Pages permissions.

## What makes the app portable

- Vite emits relative asset URLs (`base: './'`). Hash routes work at `/` or a repository subpath without server rewrites. Share the deployed base URL followed by `#/track/a` or `#/demo/<id>`; keep the base URL's trailing slash.
- The workflow sets `VITE_SOURCE_URL` from the current GitHub server, repository and default branch. Bootstrap links therefore target the destination, not the original personal repository. Locally, copy `playground/.env.example` to `.env.local` and set that optional URL, or use the editor paths shown by default. Restart Vite after changing it. This value is browser-visible and must never contain a token.
- Turbo includes `VITE_SOURCE_URL` in its environment/cache inputs, so builds for different repositories do not reuse the wrong source links.
- The shell's palette is in `playground/src/theme.css`. Track colors follow track IDs, not gallery position. Keep experimental demo artwork independent. The workshop does not depend on Sapphire or an internal package registry.
- The app is static. Repository membership and Pages access are managed by GitHub; there is no application sign-in service to migrate.

## Acceptance before sharing

- A colleague can clone, install, generate a named demo, push a branch and open a PR.
- The workflow verifies that PR and publishes only after merge to `main` with Pages enabled.
- The deployed URL loads directly and after reload on a demo route; the Worker example computes successfully and lazy demos load.
- Bootstrap links open the internal repository; no app links lead to the personal source repository.
- Intended colleagues can view the site; users outside its allowed audience cannot.
- Phone-width layout, keyboard navigation and reduced motion remain usable.

References: [GitHub private Pages access](https://docs.github.com/en/enterprise-cloud%40latest/pages/getting-started-with-github-pages/about-privately-published-github-pages-sites), [Pages visibility settings](https://docs.github.com/en/enterprise-cloud%40latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site), [Vite relative base URLs](https://vite.dev/guide/build.html#relative-base).
