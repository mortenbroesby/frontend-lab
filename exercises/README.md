# Technical bootstrap plan

No technical exercises are implemented yet. This directory intentionally contains no package manifest, install instructions or run scripts.

## Proposed approach

Start with the smallest approved experiment and prove that setup is fast. Prefer Vite, React and TypeScript for an application starter; use a plain browser page or a small Node.js script when those better fit the task. Add dependencies only for a concrete need.

Keep each exercise independent under a descriptive directory when implemented. Each should own its instructions, required assets and, if needed, package manifest and lockfile. Avoid workspace orchestration, shared packages, task runners, containers and complex monorepo infrastructure unless a demonstrated requirement justifies them.

A proposed first slice is one tiny Vite/React/TypeScript starter that can be copied for selected UI challenges, not five prebuilt solutions. Agree which track needs it before creating it. Performance Detective may need a deliberately slow synthetic sample; Push the Browser needs a bounded workload. Track E remains blocked on its direction, not on infrastructure.

## Before implementation

Agree the first challenge, required browser capabilities, runtime/package-manager baseline, target participant environments and contribution workflow. Pin compatible tool versions and commit the lockfile when implementing. Resolve package versions and compatibility at that time rather than guessing them in planning docs.

## Each future exercise should include

- An engaging question and a visible, achievable starting point.
- Exact prerequisites and verified installation/start commands for scripts that exist.
- A short menu of experiments, optional stretch goals and freedom to change direction.
- Local synthetic fixtures with no production access requirement.
- A findings template: question, method, evidence, limitation and next step.
- A suggested lightweight show-and-tell result and a link to its board area.

## Bootstrap acceptance

Verify from a clean checkout: documented versions install reproducibly, the documented command starts the example, and the first interaction works. Record any actual build/test checks and browser limitations. Have another participant try the instructions before Friday. Measure setup friction and simplify it; do not add a CI platform or abstraction just to support one starter.

The organiser should approve exercise scope before implementation expands. A completed planning repository does not imply runnable exercises or participant readiness.
