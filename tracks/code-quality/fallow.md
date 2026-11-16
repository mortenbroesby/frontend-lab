# Investigate with Fallow

Pick a question, run an analysis and verify one finding. You can use this repository as-is; no new demo or deliberately broken application is needed. Fallow 3.43.1 is pinned as a root development dependency and installed through the root lockfile.

## Get a first result

Use Node 24 and run these from the **repository root**, not `playground/`:

```sh
npm ci
npm run analyze -- --version
npm run analyze
```

The last command combines unused-code, duplication and health analysis. It reads local source and may write caches under ignored `.fallow/`. It does not apply fixes. No account, cloud connection or editor extension is needed. The gallery's **Investigate with Fallow** entry explains the journey; your terminal output is the current evidence.

**Exit codes matter:** a scan can finish successfully and exit 1 because findings exceed its default thresholds. Our initial report does this. Read the finding and any gate message; a missing binary, invalid configuration or parse diagnostic needs a different investigation. Analysis is deliberately separate from `npm run check`; the official hooks now gate new findings at commit time (see below). The repository verification workflow also audits introduced findings on pull requests.

## Set up agents and commit checks

After `npm ci`, run `npm run fallow:status`. If the Git hook is absent, run `npm run fallow:hooks` once per clone. This uses Fallow’s official installer; it refuses to overwrite existing hooks. Keep Node/npm available to your terminal and Git client.

Both **Codex and Copilot CLI** read the root `AGENTS.md` and the single skill in `.agents/skills/fallow`. The skill points to the full official instructions bundled with our pinned Fallow dependency. No copying of the full task map or per-agent hook scripts is needed.

| Client | MCP configuration | Confirm in a trusted project session |
| --- | --- | --- |
| Codex | `.codex/config.toml` | Check `/mcp` and the available Fallow skill |
| Copilot CLI | `.github/mcp.json` | Check `/mcp`, `/instructions` and `/skills info fallow` (or `/skills reload`) |

Both MCP entries launch the locally installed `fallow-mcp` through `npx --no`; no global installation or credentials are needed. Restart the client after changing configuration. Client trust and tool permissions still apply. Copilot CLI support follows its documented repository formats; an actual Copilot session still needs participant verification.

The **Git pre-commit hook** runs `fallow audit --staged` against HEAD and blocks new findings for either client or a manual commit. Existing findings remain visible without blocking unrelated changes. Run `npm run analyze:changes -- --staged` to inspect a failure. Agents are instructed to run `npm run analyze:changes` before pushing; there is **no automatic pre-push or per-agent tool hook**. PRs also run a changed-code audit in CI.

The Git hook is local, not branch protection; if Fallow is absent its official script warns and skips. Use the status command and check client discovery rather than assuming installation proves enforcement. Keep this setup small when updating Fallow: preserve the shared skill and two MCP entries rather than rerunning `fallow agent install`, which regenerates the larger harness-specific integration.

References: [official Git hooks](https://fallow.tools/docs/cli/hooks/), [Copilot shared skills](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills), [Copilot repository MCP](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers).

## Choose a lens

| Root command | Question |
| --- | --- |
| `npm run analyze:dead-code` | Which files, exports or dependencies appear unused? |
| `npm run analyze:dupes` | Where is code repeated? |
| `npm run analyze:health` | Which functions deserve a closer look for complexity? |
| `npm run analyze:architecture` | Are there import cycles or configured boundary violations? |
| `npm run analyze -- list --entry-points --plugins --workspaces` | What does the tool think this project contains? |

Pass CLI options after `--`, for example `npm run analyze:health -- --report-only` for an advisory health run. For a machine-readable report without npm's script banner, use `npm run --silent analyze:dead-code -- --format json --output-file .fallow/dead-code.json` after creating `.fallow/` if necessary.

## Worked investigation: why is this dependency here?

Trace a real dependency from the repository root:

```sh
npm run analyze:dead-code -- --trace-dependency d3-force
```

Follow the result into [Constellation.tsx](../../playground/src/demos/constellation/Constellation.tsx). Compare the imported functions with their actual uses. What does the dependency provide, and what would implementing that behaviour yourself involve? A justified decision to keep it is a useful result.

The earlier unused `marker` export exercise depended on the manual demo registry. Folder discovery removes that registration mechanism; do not recreate the marker to reproduce an old finding. For unused-code investigation, run a fresh scan and follow a current finding instead. Check that discovery sees `demo.config.ts` loaders before trusting a report that calls a demo unused.

## Worked investigation: complexity is a clue

The initial health report identified `App` in [App.tsx](../../playground/src/app/App.tsx) with cyclomatic complexity 21. Read its route selection and JSX conditions. Would extracting one cohesive view improve understanding, or merely move branches elsewhere?

No coverage file is supplied to Fallow. Its CRAP/risk score is **not measured test coverage**, and this app already has browser journeys. A high score does not establish a defect. If you try a refactor, keep routes and error handling intact and run `npm run check` plus the documented browser checks. A reasoned decision to leave the code alone is a valid outcome.

## How this repository is configured

- We use Fallow's built-in discovery without a custom config. Earlier verification covered the npm workspace, Vite entry, Turbo generator, tests, lazy demo imports and Worker module. Recheck the discovery command above after changes to folder discovery or when using another repository; previous evidence does not prove the new entry paths are understood.
- Scripts run once at the repository root, outside Turbo's task cache, so the report reflects the current whole workspace. There is no analyzer wrapper or per-demo configuration.
- No findings are suppressed and no baseline hides existing issues. We keep the defaults so participants can inspect their meaning before proposing thresholds.
- No architecture boundary rules or rule packs have been configured. Cycle checks still run; zero boundary violations means that no boundary policy was measured, not that the architecture is proven correct.
- `.fallow/` is ignored because it holds local generated data. Do not commit caches or machine-specific reports.

If discovery misses a real entry in your own project, inspect it first and add a narrow `entry` pattern in `.fallowrc.json`. Avoid marking every file as an entry or ignoring a whole directory to obtain a clean report. Do not run automatic fixes before understanding the candidate change.

## Assemble your own journey

- **Dependency detective:** `npm run analyze:dead-code -- --trace-dependency d3-force`. Follow the result into the constellation demo. Would you keep this dependency?
- **Duplication:** run the duplication command. The initial default scan found no clone groups and skipped six files under its default duplication ignores. Use `npm run analyze:dupes -- --explain-skipped` to inspect that scope. Compare the template and examples manually; a clean report is not proof that every repeated idea is detected or should be shared.
- **Architecture:** trace how host discovery finds `demo.config.ts` and loads a component. Propose one useful dependency boundary before writing any rules.
- **Your own repository:** use its normal setup and obtain permission where needed. Start with discovery, record the Fallow version/config and manually check a few findings before adopting gates or fixes.

Share your question, command/version, file or symbol, alternative explanation, decision and verification in [findings](../findings.md). Keep sensitive source and reports within the repository's permitted audience.

References: [official quick start](https://fallow.tools/docs/quickstart/), [configuration](https://fallow.tools/docs/configuration/), [Fallow source](https://github.com/fallow-rs/fallow). Website examples can advance beyond our pinned version; `npm run analyze -- --help` describes the installed CLI.

[Code Quality & Maintainability](README.md) · [Investigation bootstrap](bootstrap.md)
