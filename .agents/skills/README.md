# Shared agent skills

Codex and Copilot CLI use these project skills in `.agents/skills`. Keep one copy; do not create agent-specific duplicates or additional hooks.

| Skill | Use |
| --- | --- |
| `develop-demo` | Create or improve an independent demo and verify its LAN preview. |
| `lab-storybook` | Discover component APIs and examples through installed Storybook tools. |
| `lab-ui` | Compose and review interfaces with our existing UI library. |
| `web-design-guidelines` | Review scoped UI code against Vercel's interface guidelines. |
| `turborepo` | Configure tasks, caching and workspace builds using installed-version docs. |
| `lab-debugging` | Reproduce failures, test one cause and verify a focused correction. |
| `fallow` | Audit code quality with the installed Fallow instructions. |

## Upstream sources

- Web Design Guidelines: [Vercel source](https://github.com/vercel-labs/agent-skills/blob/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills/web-design-guidelines/SKILL.md). Locally adapted to use available fetch tools, infer changed-file scope and distinguish fetched review criteria from project permissions. The skill fetches criteria from the commit pinned in its source URL. Review the upstream diff before updating that pin.
- Turborepo: [Vercel source](https://github.com/vercel/turborepo/blob/67484391f9090c51a888221998b042a31a93e49d/skills/turborepo/SKILL.md), unchanged. Its MIT notice is retained in `turborepo/LICENSE`. It reads documentation from the installed `turbo` dependency.

Update deliberately: compare upstream changes with the recorded revision, preserve local adaptations and attribution, and update these references. Check names, triggers and referenced paths after editing. Skills do not grant additional permissions or require installing tools they happen to mention.

## Validation

Use the bounded scenarios in [validation.md](validation.md) to check discovery and workflow selection in fresh clients. Keep execution evidence separate from a proposed plan.

Storybook uses the installed CLI.
