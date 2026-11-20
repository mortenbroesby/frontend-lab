# Windows compatibility

## Run locally

Install Git for Windows and Node 24, including npm. Clone into a writable folder,
open PowerShell or Command Prompt there, and follow the root README. No WSL,
Git Bash, Rust or Unix tools are required for the normal workflow.

Use `npm install --global npm@11.21.2 --ignore-scripts` to match the repository's npm version.
If PowerShell reports that `npm.ps1` cannot run, use `npm.cmd` for every command
(for example, `npm.cmd ci`). Do not change your execution policy just for this repo.
Keep optional dependencies enabled: the compiler, bundler and analyzers install
platform-specific binaries. After switching operating systems, run `npm ci`;
do not copy `node_modules` between machines.

For another device on your LAN, run:

```sh
npm run dev --workspace frontend-lab-gallery -- --host 0.0.0.0
```

Open the printed network address. If Windows Firewall prompts, allow Node on
trusted private networks only. Localhost is a secure browser context; ordinary
LAN HTTP is not. Reaction Room needs HTTPS or localhost as its UI explains.
Corporate firewalls, browser policies and WebRTC relay access can still prevent
peer connections. This does not require disabling the firewall.

## Repository audit

| Area | Safeguard |
| --- | --- |
| Checkout | `.gitattributes` keeps text LF regardless of `core.autocrlf`, so formatting checks agree across systems. No tracked symlinks. |
| Commands | npm scripts use cross-platform CLIs and Node APIs; no Unix copy/remove commands or shell environment assignments. |
| Paths | Node path and file-URL APIs handle native separators. Generator fixtures include spaces and Unicode; test the actual checkout location on the destination laptop. |
| Names | Demo IDs reject traversal, spaces, trailing dots and Windows device names; existing folders are never overwritten. |
| Dependencies | The lockfile includes native Windows packages. Verify a clean install, TypeScript, Vite, Turbo, Oxlint and Fallow on the destination Windows laptop. |
| Generation | Run the Turbo generator, install the new workspace, check its standalone app and rebuild gallery discovery locally. |
| Serving | A bounded HTTP check starts gallery and standalone dev/preview servers and fetches their entry scripts. |
| Components | `npm run storybook:build` checks Storybook; ordinary controls use shared Radix/native controls and system-font fallbacks. |

The Windows/Linux Actions workflow has been removed. Use native PowerShell for
local checks; no browser suite or additional test framework is installed.

## Website audit

- The command button shows **Ctrl K** on Windows and **⌘K** on Apple devices,
  including mobile navigation. The visible button remains usable when browser
  chrome or policy captures the keyboard shortcut.
- Reaction Room's room pattern escapes the hyphen for HTML's Unicode `v` grammar.
- Workers use Vite module URLs; BroadcastChannel and WebRTC have capability/error
  handling. Browser URLs are independent of filesystem separators.
- SVG downloads use Windows-safe filenames. Pointer capture, touch handling,
  keyboard controls, reduced motion and system fonts have no Apple-only dependency.

## Evidence boundary

No CI workflow is configured. Earlier CI results are historical evidence, not acceptance of the current revision.
Source review and HTTP checks do not establish interactive Windows browser support.
Still manually check current Edge/Chrome and Firefox on Windows: open the palette
with Ctrl+K, switch keyboard layouts, save an SVG,
try worker interactions and connect Reaction Room peers over HTTPS. Touch/pen,
managed devices, Windows ARM64 and intended networks remain unverified.

References: [Git line endings](https://git-scm.com/docs/gitattributes),
[PowerShell execution policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies/),
[HTML pattern grammar](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/pattern).
