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

**Exit codes matter:** a scan can finish successfully and exit 1 because findings exceed its default thresholds. Our initial report does this. Read the finding and any gate message; a missing binary, invalid configuration or parse diagnostic needs a different investigation. Analysis is deliberately separate from `npm run check`; the official hooks now gate new findings at commit time (see below). There is no hosted CI gate.

## Set up agents and commit checks

After `npm ci`, from the root of a fresh clone:

```sh
npm run fallow:setup
npm run fallow:hooks
npm run fallow:status
```

These commands use Fallow’s official installers, not a custom hook framework:

- `fallow:setup` installs the version-matched `fallow` and `fallow-setup` skills, MCP registrations and PreToolUse commit/push gates for Codex and Claude Code. The generated agent files are committed; rerunning setup keeps them current. The official task map lives in the managed AGENTS.md block; CLAUDE.md imports it.
- `fallow:hooks` installs the Git pre-commit hook **locally in each clone**. Git does not copy `.git/hooks` when cloning. The installer refuses to overwrite an existing hook, including its own: check `fallow:status` first and preserve any existing hook rather than forcing replacement.
- Codex must trust this project and its hooks through `/hooks`. Claude Code asks to approve the project MCP server. Installation status does not prove your running agent loaded the integration; reload/start a trusted session and check its tools/hooks. We do not change global agent configuration or pre-approve trust on your behalf.
- Node/npm must be on the agent or Git client’s PATH. The generated scripts use the installed Fallow binary; Windows needs Git Bash or WSL for the Bash agent hooks. If launched from a GUI, verify the runtime is available there too.

The Git hook runs `fallow audit --staged`, comparing the staged snapshot with HEAD. Agent hooks check before commit/push. The default `new-only` gate blocks introduced findings, while inherited findings remain visible without blocking unrelated work. A full `npm run analyze` can therefore exit 1 while a changed-code audit passes.

To inspect a failure, run `npm run analyze:changes -- --staged` before a commit, or `npm run analyze:changes -- --base origin/main` for your branch. Review the report, fix the introduced finding or justify a narrow configuration change, then rerun. Agent failure reports are saved under `.fallow/gate-report.json`. These are local checks, not enforced GitHub branch protection. Official hooks have documented fail-open cases: the Git hook skips if Fallow is absent, and agent hooks allow runtime errors with a diagnostic. Verify status and diagnostics rather than assuming every command was checked.

References: [official agent installer](https://fallow.tools/docs/cli/agent/), [official hooks](https://fallow.tools/docs/cli/hooks/).

## Choose a lens

| Root command | Question |
| --- | --- |
| `npm run analyze:dead-code` | Which files, exports or dependencies appear unused? |
| `npm run analyze:dupes` | Where is code repeated? |
| `npm run analyze:health` | Which functions deserve a closer look for complexity? |
| `npm run analyze:architecture` | Are there import cycles or configured boundary violations? |
| `npm run analyze -- list --entry-points --plugins --workspaces` | What does the tool think this project contains? |

Pass CLI options after `--`, for example `npm run analyze:health -- --report-only` for an advisory health run. For a machine-readable report without npm's script banner, use `npm run --silent analyze:dead-code -- --format json --output-file .fallow/dead-code.json` after creating `.fallow/` if necessary.

## Worked investigation: an unused export

The initial scan flagged `marker` in [create-demo.mjs](../../turbo/generators/create-demo.mjs). Investigate it:

```sh
npm run analyze:dead-code -- --trace turbo/generators/create-demo.mjs:marker
```

Fallow reports a reachable file but no references to the exported symbol. Read the file and search its imports: `marker` is used **inside** the generator to register demos, but no other module imports it. The potential improvement is to remove the `export` keyword, not the constant or its uses.

On your own branch, try that one change, rerun the trace and `npm run test:generator`, then `npm run check`. Does the finding disappear while the generator still works? This small cleanup is intentionally left for participants; later branches may already contain it. If so, pick another finding rather than manufacture a defect.

## Worked investigation: complexity is a clue

The initial health report identified `App` in [App.tsx](../../playground/src/app/App.tsx) with cyclomatic complexity 21. Read its route selection and JSX conditions. Would extracting one cohesive view improve understanding, or merely move branches elsewhere?

No coverage file is supplied to Fallow. Its CRAP/risk score is **not measured test coverage**, and this app already has browser journeys. A high score does not establish a defect. If you try a refactor, keep routes and error handling intact and run `npm run check` plus the documented browser checks. A reasoned decision to leave the code alone is a valid outcome.

## How this repository is configured

- We use Fallow's built-in discovery without a custom config. The verified scan discovers the npm workspace, Vite entry, Turbo generator, tests, lazy demo imports and Worker module. Check the discovery command above before trusting unused-code results in a different repository.
- Scripts run once at the repository root, outside Turbo's task cache, so the report reflects the current whole workspace. There is no analyzer wrapper or per-demo configuration.
- No findings are suppressed and no baseline hides existing issues. We keep the defaults so participants can inspect their meaning before proposing thresholds.
- No architecture boundary rules or rule packs have been configured. Cycle checks still run; zero boundary violations means that no boundary policy was measured, not that the architecture is proven correct.
- `.fallow/` is ignored because it holds local generated data. Do not commit caches or machine-specific reports.

If discovery misses a real entry in your own project, inspect it first and add a narrow `entry` pattern in `.fallowrc.json`. Avoid marking every file as an entry or ignoring a whole directory to obtain a clean report. Do not run automatic fixes before understanding the candidate change.

## Assemble your own journey

- **Dependency detective:** `npm run analyze:dead-code -- --trace-dependency d3-force`. Follow the result into the constellation demo. Would you keep this dependency?
- **Duplication:** run the duplication command. The initial default scan found no clone groups and skipped six files under its default duplication ignores. Use `npm run analyze:dupes -- --explain-skipped` to inspect that scope. Compare the template and examples manually; a clean report is not proof that every repeated idea is detected or should be shared.
- **Architecture:** trace how the registry loads demos. Propose one useful dependency boundary before writing any rules.
- **Your own repository:** use its normal setup and obtain permission where needed. Start with discovery, record the Fallow version/config and manually check a few findings before adopting gates or fixes.

Share your question, command/version, file or symbol, alternative explanation, decision and verification in [findings](../findings.md). Keep sensitive source and reports within the repository's permitted audience.

References: [official quick start](https://fallow.tools/docs/quickstart/), [configuration](https://fallow.tools/docs/configuration/), [Fallow source](https://github.com/fallow-rs/fallow). Website examples can advance beyond our pinned version; `npm run analyze -- --help` describes the installed CLI.

[Track B](README.md) · [Investigation bootstrap](bootstrap.md)
