# UI library playground

Run from the repo root:

```sh
npm run dev --workspace @lab/demo-ui-library
```

Or open **UI library** under Developer Experience in the gallery. This standalone demo exercises 30 shared component families with local state: forms, menus, overlays, navigation and feedback. Nothing is sent or persisted.

See [Lab UI](../../shared/ui/README.md) for imports, styling and interaction contracts. Each section lives beside `index.tsx`; `styles.css` handles only showcase layout.

Check with `npm run check --workspace @lab/demo-ui-library`. Production output is `dist/`.
