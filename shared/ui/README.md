# Lab UI

Small, source-exported React components for the gallery and standalone demos. Based on the official shadcn/ui New York v4 registry (MIT; see LICENSE.md), with Lab theme colours, 44px default buttons, wrapping alert titles and static skeletons.

```tsx
import { Button } from '@lab/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@lab/ui/alert';
import { Skeleton } from '@lab/ui/skeleton';
```

Generated demos already declare `@lab/ui`; existing consumers must declare `"@lab/ui": "*"` in their workspace dependencies and run `npm install` at the root. The standard demo mount loads the stylesheet. Custom entries should import `@lab/ui/styles.css` themselves.

Theme tokens live in `theme.css`. Both Vite configs compile Tailwind; Preflight is deliberately omitted to preserve native demo controls and MDX typography. Shared styles scan these component sources only. For utility classes in a demo's own code, import a local CSS file containing:

```css
@import '@lab/ui/styles.css';
@source '.';
```

Keep components independent of app state and routes. Import individual exports, not a barrel. Add components when a real screen needs them; do not generate a full catalogue. Registry updates require reviewing our local adaptations, not blindly overwriting them.

Sources: https://ui.shadcn.com/r/styles/new-york-v4/button.json, alert.json and skeleton.json under the same registry path. Button uses the focused Radix Slot package; `cn` uses clsx and tailwind-merge. Component source is ours to maintain.

Fallow's advisory CSS audit flags the upstream Alert grid templates and the `theme`/`utilities` layers. The grids reserve a column for an optional icon; both layers are populated by Tailwind imports during compilation. Keep these intentional rules.
