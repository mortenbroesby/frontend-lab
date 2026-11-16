# A restrained, Vercel-inspired shell

We use [Vercel’s Geist design system](https://vercel.com/geist/introduction) as a visual reference: neutral surfaces, high contrast typography, fine borders, generous space and a visible grid. The lab keeps its name and mark; demos keep their artwork and identity.

We kept CSS: the small shell already uses `@lab/demo-kit`, so Tailwind would add setup with little benefit. Palette tokens live in `gallery/demo-kit/theme.css`; layout and components live in `styles.css`. Use these before adding one-off shell styles. System sans and monospace fonts need no downloads.

Keep visible keyboard focus, readable contrast and a single-column layout on narrow screens. Avoid turning the visual reference into a new component framework. Reconsider tooling only when repeated UI work makes it worthwhile.

The [shared UI trial](shared-ui.md) later added Tailwind and moved tokens to `shared/ui/theme.css`.
