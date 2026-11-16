# Lab UI

30 component families for the gallery and standalone demos, adapted from [shadcn/ui’s New York v4 registry](https://ui.shadcn.com/docs/components) with focused Radix primitives. MIT attribution is in [LICENSE.md](LICENSE.md).

Run `npm run storybook` from the repository root to inspect individual components, edit controls and browse state examples on port 6006. `npm run storybook:build` produces a static site in `shared/ui/dist/storybook`.

Agents can query component documentation without starting a server:

```sh
npm run storybook:tools -- docs list --withStoryIds
npm run storybook:tools -- docs show --id <id-from-list>
```

Use `docs show-story --storyId <story-id-from-list>` for a specific example, or append `--json` for structured output. The shared `lab-storybook` skill explains the workflow. Generated metadata can omit inherited props or inferred unions; component source and TypeScript remain authoritative. These commands inspect documentation; they do not test browser behaviour.

For components working together, open **UI library** in the gallery or run `npm run dev --workspace @lab/demo-ui-library`.

| Use | Package exports |
| --- | --- |
| Actions | `button`, `toggle`, `toggle-group` |
| Forms | `input`, `textarea`, `label`, `checkbox`, `radio-group`, `switch`, `select`, `slider` |
| Layout and content | `card`, `badge`, `separator`, `table`, `avatar`, `scroll-area` |
| Navigation | `tabs`, `accordion`, `breadcrumb`, `pagination` |
| Overlays | `dialog`, `alert-dialog`, `sheet`, `popover`, `dropdown-menu`, `tooltip` |
| Feedback | `alert`, `progress`, `skeleton` |

## Use

```tsx
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';

<form onSubmit={save}>
  <Label htmlFor="title">Title</Label>
  <Input id="title" name="title" required />
  <Button type="submit">Save</Button>
</form>
```

Generated demos declare `@lab/ui`; other consumers need `"@lab/ui": "*"` and a root `npm install`. Import individual exports. The standard demo mount loads styles; custom entries must import `@lab/ui/styles.css`.

Native attributes and React 19 refs pass through. Radix controls support controlled and uncontrolled state. Consumers own data, validation and side effects; the library has no app routes or services.

## Interaction contracts

- Buttons default to `type="button"`; submit explicitly. `asChild` uses the child’s element semantics. A disabled anchor still needs application-level navigation prevention; prefer a native button for disabled actions.
- Label every field. Pair errors with `aria-invalid` and `aria-describedby`; an invalid style alone is not validation. Label icon-only buttons and tooltip triggers too.
- Include Dialog/Sheet/AlertDialog titles and descriptions. Radix handles focus trapping, Escape and focus return. AlertDialog is for confirmation; cancellation gets initial focus.
- Wrap tooltips in `TooltipProvider`. Essential instructions must remain visible without hovering.
- Slider defaults to one thumb. Pass `aria-label` or `aria-labelledby`; use `thumbLabels={['Minimum', 'Maximum']}` for separately named range thumbs.
- Progress accepts `value` and `max` (default 100). Missing or invalid values are indeterminate. Give it an accessible name.
- ScrollArea focuses its viewport. Use `viewportProps` for an accessible region name or to override `tabIndex`.
- Pagination uses links; callers supply URLs, state and unavailable-link handling. Table is semantic markup, not a sorting/filtering engine.
- Alert defaults to an assertive announcement; use `role="status"` or `role="note"` for nonurgent/static content. Skeleton is presentation; announce loading on its container.

## Styling

`theme.css` owns Lab tokens. The Geist-inspired styling uses neutral surfaces, quiet one-pixel borders, 6px control corners and flat 8px cards. Reserve shadows for floating overlays; keep primary actions dark, supporting actions outlined and keyboard focus clearly visible. Preserve 44px default button targets even when tightening visual spacing. Tailwind compiles in both Vite builds without Preflight. Scoped `data-slot` resets keep library elements consistent. Demo controls use these components; the worker interaction pad and native colour picker retain dedicated styling. Portals use the same global tokens. Reduced-motion preferences disable library transitions and animations.

Shared styles scan the library source. For utility classes in your own demo, import local CSS containing:

```css
@import '@lab/ui/styles.css';
@source '.';
```

Use `className` for local adjustments; `cn` resolves conflicting Tailwind utilities. Default buttons have 44px targets; compact variants need appropriate surrounding space. Checkbox/radio controls should have clickable labels. `ThemeControl` from `@lab/ui/theme-control` offers Light, Dark and System. It applies `data-theme` to the document, follows the device by default and remembers explicit choices locally. The gallery and standard demo mount include this segmented control in the command menu. Custom entry points can use the hook or the segmented control. Use Lab colour tokens for UI surfaces so portals and controls follow the same theme; artwork can keep its own palette.

## Maintain

Run `npm run test --workspace @lab/ui` for focused rendering contracts and `npm run check` for workspace types, builds, hooks and import boundaries. Manually check keyboard interaction and narrow layouts in the playground when behavior changes. No browser test suite is installed.

Sources were imported from `https://ui.shadcn.com/r/styles/new-york-v4/<component>.json` on 16 November 2026. We maintain these files locally. Review upstream updates against our adaptations: focused package imports, scoped resets, button defaults, bounded overlays, slider labels, viewport focus and progress semantics. Do not overwrite them blindly.

The playground covers the listed families. Rich editors, date pickers, combobox search, charts, toasts and data-grid behavior remain separate future additions.
