# Prepare for internal Danske Bank use

This is a repository readiness review, not approval or a completed migration. No destination repository, bank network, registry or hosting policy has been tested. Keep internal code and data out of the current publicly hosted app until the destination and access controls are agreed.

## Decisions before migration

| Area | What exists now | What needs to happen |
| --- | --- | --- |
| Public hosting | The personal Vercel project automatically deploys `main`. Production is public. | Disconnect its Git integration before introducing internal material. Review existing deployments separately. Deleting CI or `vercel.json` does not disconnect the service. See [hosting](hosting.md). |
| Device Rally | `trystero` 0.27.0 uses public Nostr WebSocket relays and default Google/Cloudflare STUN servers. The app uses a public-project app ID and participant-entered room codes. | Keep the current demo and external services, as requested by the project owner for this developer audience. Verify connectivity on the intended VPN/network. Room codes remain peer-discovery identifiers, not employee authentication. |
| Package installation | The lockfile resolves downloads from `registry.npmjs.org`; no Git-sourced dependencies were found. Node 24 and npm 11.6.2 are expected. | Confirm the approved registry/proxy and TLS certificate setup. Validate the lockfile with that registry; changing npm's registry alone is not proof that every resolved download is internal. Never commit registry credentials or disable TLS verification. |
| Native tools and scripts | Vite, Turbo, TypeScript, Oxlint and Fallow include platform-specific tooling; some dependencies have install scripts. | Check package and binary approval on managed Windows laptops. Keep required optional packages available in the registry mirror. Review licenses/dependency scanning using the bank's process; this review does not establish approval. |
| Hosting and browser policy | The build is static, uses hash routes, module Workers and a same-origin Canvas TV iframe. No app login or server is required. | Use an approved host with access control if hosting internally. Check its base path, CSP, Worker/iframe permissions, trusted HTTPS and WebRTC policies. Rebuild with the intended base path and verify nested assets. |
| External resources | Guides link to MDN, vendor docs and optional external examples. Agent skills can fetch public guidance; Codex/Copilot usage depends on the chosen client. | Confirm permitted browsing and agent use. External links are optional resources, not bundled offline copies. Do not send internal source or reports to unapproved services. |
| Automation | GitHub Actions workflows have been removed. Local checks and optional per-clone Fallow hooks remain. | Do not require the retired `verify` job in destination branch rules. Add internal CI only when its runner, policy and commands are explicitly chosen. |

README image badges were removed to avoid incidental external image requests. Public reference links and authorship remain. `vercel.json` remains for the existing temporary host; it contains no credentials and can be removed when that hosting is retired.

## Repository and access

1. Choose the destination organization, repository, maintainers and contributing team. Confirm whether the target is Enterprise Cloud or a self-hosted service rather than assuming a hostname.
2. Use the approved transfer/import procedure. Review source, Git history, issues, attachments, authorship and licenses for the destination audience. This review is not a full historical secret scan. Do not mirror-push over an existing repository.
3. Set private or internal visibility deliberately and grant the contributing team write access. Agree branch and review rules. The source repository's `main` was reported unprotected during this review; destination rules are separate, and the source rulesets endpoint was unavailable.
4. Clone using the destination's approved URL, or update a reviewed clone's `origin`. Follow [contributing](../../CONTRIBUTING.md). There are no runtime source-repository URLs to configure. Install approved hooks separately in each clone.

## Local verification at the destination

From a clean checkout on a managed laptop, using the approved package configuration:

```sh
npm ci
npm run check
npm run analyze:changes
npm run dev
```

Use `npm.cmd` if PowerShell blocks `npm.ps1`; see [Windows notes](windows.md). The Fallow audit needs a usable Git comparison base; inspect its reported base after an import or use an explicit approved base. Hooks are local checks, not server-side enforcement.

Then verify the participant journey:

- Open a track, follow a bundled guide and run a demo. Most demos need no external runtime service; Device Rally is the explicit network-dependent exception.
- Generate a disposable demo with `npm run demo:new`, install its workspace and run its printed standalone commands. Check it appears after rebuilding the gallery.
- Push a branch and open a review using the team's chosen process. After merge and pull, another colleague should see the demo.
- If hosting, verify access as an authorized and unauthorized user, lazy-loaded guides, SVG assets, Workers, downloads and the presentation's Canvas TV embed. `npm run test:servers` checks local HTTP startup after building; it does not validate bank hosting or browser policy.
- Keep Device Rally in the migration. Test joining, sending cheers and reconnecting on the intended VPN/network; the earlier public-network session does not establish compatibility.

The remaining inputs are the destination URL, approved registry/tool versions, hosting/access model and allowed agent clients. No bank-specific configuration is invented here.
