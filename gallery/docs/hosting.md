# Temporary Vercel hosting

Hosting is a temporary convenience, not a participant entry point. Local development is the documented workflow; hosting can be removed without changing demos.

Vercel project: `frontend-chapter-day` in `morten-broesbyolsens-projects`, connected to `mortenbroesby/frontend-chapter-day`. Production follows `main`; Git integration handles builds, with no deployment secrets or additional GitHub workflow in this repository.

Project settings:

- Repository root; framework preset Vite; Node 24.x.
- Install: `npx --yes npm@11.6.2 ci`, pinned in `vercel.json` to match `packageManager` and GitHub CI. Vercel’s default npm version may validate optional lockfile dependencies differently.
- Build: `npm run build`.
- Output: `gallery/dist`, set in the repository’s `vercel.json`.
- Production domain is public; preview and deployment-specific URLs use Vercel authentication. Repository source remains private.

The initial production deployment used commit `cb7e020`. An unauthenticated HTTP request and a Chrome smoke check verified the home page, named track navigation, D3 demo and Worker result. This is hosting verification, not participant-device or cross-device acceptance.

To remove hosting, disconnect the Git repository and remove the Vercel project in its dashboard. The documentation must not depend on deployment links. There is no Vercel dependency in application code. To migrate to GitHub Pages, publish the same static build and configure Vite's base path for the destination; retain hash routes. Recheck lazy assets and Workers on the new host before sharing it.
