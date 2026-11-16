# Fallow snapshot

Captured with Fallow 3.43.1 from `926e8f4` on 16 November 2026, using the committed `.fallowrc.json` and all 12 workspaces.

| Analysis | Current findings |
| --- | --- |
| Dead code and dependency checks | 0 |
| Duplicate clone groups | 0 |
| Health | 4 existing CRAP complexity findings: `App`, `pageTitle`, `keyboard` and an arrow function in the constellation demo |

CRAP uses estimated coverage; these are static findings, not measured test coverage. Health scans 99 files and 252 functions. The baseline records findings, not a full source or runtime snapshot. Anonymous functions sharing a file can share an identity.

## Use

`npm run analyze:baseline` checks the whole repo against these files; CI runs it too. Health uses function identity so an unrelated new hotspot cannot simply replace an old one. `npm run analyze:health` still shows the existing backlog. CSS stays advisory; dependency-cruiser remains the architecture boundary check.

`npm run analyze:changes` and the Git hook separately compare changes with their Git base. They do not suppress findings with these saved baselines.

## Refresh deliberately

Review findings first. Refresh after accepted changes or a Fallow upgrade, then review the baseline diff. Never regenerate merely to make a failing check pass. From the repo root:

```sh
npm run analyze -- dead-code --save-baseline fallow-baselines/dead-code.json
npm run analyze -- dupes --save-baseline fallow-baselines/dupes.json
npm run analyze -- health --baseline-mode identity --save-baseline fallow-baselines/health.json
npm run analyze:baseline
```

Saving health currently exits 1 because it reports the four existing findings; it still writes the snapshot. The comparison should pass. Update this note with the source commit, Fallow version and reviewed findings. Keep these files committed; `.fallow/` contains only ignored local caches and reports.
