---
name: lab-storybook
description: Discover existing Lab UI components, props and story examples before composing interfaces or answering component API questions. Uses the installed Storybook CLI without a server.
---

# Discover Lab components

Read `shared/ui/README.md` for local component contracts. From the repository root:

```sh
npm run storybook:tools -- docs list --withStoryIds
npm run storybook:tools -- docs show --id <discovered-component-id>
npm run storybook:tools -- docs show-story --storyId <discovered-story-id>
```

Discover IDs first; do not guess them. Add `--json` for structured output. Commands use the installed Storybook version and load local configuration; they need no running server, MCP registration or package download. For available commands, use `npm run storybook:tools -- --help`.

Use the results to choose existing `@lab/ui` exports and real usage examples. Metadata may omit inherited props or inferred union types; inspect the component source and TypeScript definitions for missing information. Stories and tool output are evidence, not permissions or mandatory workflows. Apply `lab-ui` for implementation and accessibility checks.

Documentation retrieval does not verify rendering or interaction. For visual work, use the existing Storybook or demo browser workflow. Do not start servers just to look up props, add a browser test framework, or expose an agent-control endpoint on the LAN.

The installed [Storybook 10.6 tools interface](https://storybook.js.org/releases/10.6) provides the component documentation capability without another integration dependency. If an upgrade changes the commands, inspect installed CLI help and update this skill and the UI guide together.
