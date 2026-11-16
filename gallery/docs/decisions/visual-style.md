# A restrained, Vercel-inspired shell

We use [Vercel’s Geist design system](https://vercel.com/geist/introduction) as a visual reference: neutral surfaces, high contrast typography, fine borders, generous space and a visible grid. The Front-End Lab keeps its own name and mark. Individual demos keep their own artwork and visual identity.

We chose the existing CSS over introducing Tailwind. The shell is small, already shared through `@lab/demo-kit`, and a new styling tool would add setup without removing much work. Palette tokens live in `gallery/demo-kit/theme.css`; layout and components live in `styles.css`. Use these before adding one-off shell styles. System sans and monospace fonts keep local demos independent of font downloads.

Keep visible keyboard focus, readable contrast and a single-column layout on narrow screens. Avoid turning the visual reference into a new component framework. Reconsider tooling only when repeated UI work makes it worthwhile.
