# Presentation

A standalone React deck with five example slides. These demonstrate layouts and interaction; they are not the eventual talk.

```sh
npm run dev --workspace @lab/presentation -- --host 0.0.0.0
npm run build --workspace @lab/presentation
npm run preview --workspace @lab/presentation -- --host 0.0.0.0
```

The gallery build includes `/presentation/` (relative to its hosting base). Open it through the gallery command palette or the Konami code. It is deliberately absent from normal navigation.

## Present

Use arrow keys or Space outside interactive controls. Previous/next buttons work anywhere. Fullscreen uses your browser's native fullscreen support; Escape exits it. Hide controls removes the surrounding chrome; Show controls restores it.

Presenter view keeps the current slide, next-slide preview, notes and an elapsed timer in one window. **Do not project presenter view:** notes are visible in that window. The timer starts when the presentation opens and continues across view changes; Reset timer restarts it. Reloading resets it.

## Author

Edit `slides.tsx`. Each entry has a stable, unique `id`, a `title`, a React `Content` component and optional `notes`. Array order is presentation order. The URL hash preserves the current slide on reload.

Use the five layout components in `layouts.tsx`, or compose a slide directly. Slides use a 16:9 canvas; container-relative typography keeps the composition consistent. Keep text brief and test your projector size.

Interactive slide components receive `preview`. Render a quiet, disabled representation when it is true. The next-slide preview is also inert and hidden from assistive technology. Put complex custom interactions inside `data-presentation-interactive` to reserve their keyboard events. Clean up effects when slides unmount. The included frequency experiment needs no effects or external services.
