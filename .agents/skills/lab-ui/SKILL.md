---
name: lab-ui
description: Build or restyle Front-End Lab interfaces using the existing shared UI library. Use for gallery or demo layout, controls, themes and responsive styling.
---

# Use Lab UI

1. Read `shared/ui/README.md` and inspect the relevant component exports and one existing consumer. Use `lab-storybook` for component API and story discovery. Use the current Storybook or `demos/ui-library` when interaction behaviour is unclear.
2. Compose existing `@lab/ui` components before adding local controls. Import individual exports. Preserve the local adaptations; do not run shadcn init/add or replace components with registry copies as part of styling work.
3. Use shared theme tokens for interface colours, borders and spacing where available. Keep demo-specific layout in that demo. Avoid copying styles into the shared kit, overriding component internals unnecessarily or creating a second design system. Preserve the LabMark and existing navigation unless the task calls for changes.
4. Keep labels, semantic headings, visible focus and accessible names. Check keyboard use, light/dark themes, phone-width overflow and reduced motion where relevant. Review empty, loading and error states that the changed interface actually supports.
5. Verify the affected interaction in the browser, not only a screenshot. Use the preview workflow in `develop-demo` for a standalone demo. For gallery changes, follow `gallery/README.md`. Use existing browser tools; do not add browser-testing infrastructure. If browser access is unavailable, report what remains unverified.
6. Run the relevant checks from `AGENTS.md`. Use `web-design-guidelines` for a requested UI review or a substantial interaction change; keep findings scoped and distinguish code inspection from observed browser behaviour.

`shared/ui/README.md` owns component usage rules. This skill adds a workflow, not a duplicate component reference. New shared components need an actual consumer and an example in the UI library demo.
