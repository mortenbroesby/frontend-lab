# Dependency installation

Use Node 24 and **npm 11.21.2**. Older npm versions do not enforce all these settings and are rejected by `devEngines`.

```sh
npm install --global npm@11.21.2 --ignore-scripts
npm ci
```

The bootstrap installs a reviewed, pinned npm version; it does not inherit the project's release-age protection. Repository settings live in `.npmrc` and `package.json`, not your global npm configuration.

## Give new releases time

`min-release-age=7` excludes registry versions published less than seven days ago during new dependency resolution, including transitive dependencies. `save-exact=true` pins newly added direct dependencies. Commit and review the root lockfile alongside manifest changes.

**This is a resolution delay, not a universal installation block.** With the pinned npm version, `npm ci` accepts versions already recorded in the lockfile, even if they are too new. Review lockfile updates accordingly. Git dependencies, local tarballs and commands run through `npx` are not covered by this project policy. An organisation-wide guarantee requires enforcement at an approved registry or proxy.

A waiting period gives the ecosystem time to detect problems; it does not prove a package is safe. For an urgent security fix, review and document a narrow release-age exception rather than disabling the delay generally.

## Review install scripts

`strict-allow-scripts=true` rejects dependencies with unreviewed install scripts. The root `allowScripts` map records decisions. Currently no dependency install scripts are approved:

| Package | Decision |
| --- | --- |
| `esbuild` | Deny its validation/download hook; use the locked optional platform binary. |
| `@swc/core` | Deny its validation/fallback hook; use the locked optional native binding. |
| `fsevents` | Explicitly deny install hooks; the current macOS package includes its binary. |

Keep optional dependencies enabled. A clean installation and native SWC/esbuild checks pass with these decisions. A new platform or package version may need fresh verification.

When an installation reports an unknown script:

1. Inspect the package's source, install command and any downloads it performs.
2. Prefer denying unnecessary scripts. Use `npm install-scripts ls` to inspect policy status.
3. If essential, use `npm install-scripts approve <package>` after review. Keep registry approvals version-specific and commit the policy change. Denials can cover all versions of a package.
4. Verify a clean `npm ci` and the affected build before committing.

Do not use blanket script approval to make an installation pass. This policy is not a sandbox: project scripts, development tools and imported dependencies still execute code when you run them.

## Verification

The initial policy was checked with isolated CLI fixtures: a newly published registry version was rejected during resolution, an unreviewed install hook was blocked before execution, and an explicitly approved fixture hook ran. A clean repository install and `npm run check` passed with the dependency hooks denied.

References: [npm configuration](https://docs.npmjs.com/cli/v11/using-npm/config/), [install-script policy](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts), [developer engines](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#devengines).
