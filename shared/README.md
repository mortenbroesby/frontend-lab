# Shared utilities

A small home for framework-independent utilities used by more than one demo or by the gallery. Keep demo-specific helpers with their demo. Shared presentation belongs in `@lab/demo-kit`.

Add a clearly named TypeScript file here when there is a real shared need. Add an explicit subpath to this package's `exports` and declare `"@lab/shared": "*"` in each consuming workspace. Import through `@lab/shared/<name>`, not a relative path into this folder. Keep any focused tests beside the utility and add a workspace test script when needed.

This package starts empty intentionally. It must not depend on demos, the gallery, the demo kit or React. Run `npm run check:architecture` from the repository root to check the boundaries.
