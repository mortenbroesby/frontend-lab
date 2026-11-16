# Fallow snapshot

Captured with Fallow 3.43.1 using `.fallowrc.json` and all 12 workspaces. Dead-code and duplication snapshots originate from `926e8f4`; health was refreshed after the bounded route and dependency-map cleanup based on `5734483` on 16 November 2026.

| Analysis | Current findings |
| --- | --- |
| Dead code and dependency checks | 0 |
| Duplicate clone groups | 0 |
| Health | 0 |

CRAP uses estimated coverage; these are static findings, not measured test coverage. The baseline records findings, not a full source or runtime snapshot. Anonymous functions sharing a file can share an identity.

## Use

`npm run analyze:baseline` checks the whole repo against these files; CI runs it too. Health uses function identity so an unrelated new hotspot cannot simply replace an old one. `npm run analyze:health` shows current metrics and advisories, including large functions. CSS stays advisory; dependency-cruiser remains the architecture boundary check.

`npm run analyze:changes` and the Git hook separately compare changes with their Git base. They do not suppress findings with these saved baselines. The audit uses `new-only` with `worsened: error`: new error-level findings and worsening existing enforceable complexity findings fail locally and in CI; unchanged inherited findings remain allowed. Fallow counts any increase in cyclomatic/cognitive/CRAP metrics, or at least five added function lines, as worsening an existing finding. Fallow deliberately keeps findings based only on estimated coverage (CRAP), test-file complexity and CSS suggestions advisory; these are not proof of regressions. Cyclomatic and cognitive threshold regressions are enforced.

## Refresh deliberately

Review findings first. Refresh after accepted changes or a Fallow upgrade, then review the baseline diff. Never regenerate merely to make a failing check pass. From the repo root:

```sh
npm run analyze -- dead-code --save-baseline .baselines/dead-code.json
npm run analyze -- dupes --save-baseline .baselines/dupes.json
npm run analyze -- health --baseline-mode identity --save-baseline .baselines/health.json
npm run analyze:baseline
```

The comparison should pass. Update this note with the source commit, Fallow version and reviewed findings. Keep these files committed; `.fallow/` contains only ignored local caches and reports.
