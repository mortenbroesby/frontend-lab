# Shared UI trial

Use `shared/ui` (`@lab/ui`) for reusable presentation components. The Create a demo page and guide loading/error states use Button, Alert and Skeleton; the demo shell reuses Button for its return link. Existing experimental interfaces keep their own controls.

Tailwind compiles in gallery and standalone Vite builds without Preflight. Shared theme tokens retain the Lab identity. The gallery adds explicit source paths for its utilities; the UI package scans only its own source. The generator declares the UI dependency without changing starter behaviour.

This adds a source workspace and styling toolchain, not a prebuilt component bundle or a redesign. Turbo follows UI → kit → demos typecheck dependencies so shared-source changes invalidate consumer builds. Dependency-cruiser prevents UI from importing app code. See `shared/ui/README.md` for usage and upstream provenance.
