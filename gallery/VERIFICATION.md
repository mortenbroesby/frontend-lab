# Verification for demos

Keep verification small and tied to the change. Use an existing focused logic test, TypeScript check or build when it answers a concrete question. `npm run check` combines the existing generator/logic tests, TypeScript and gallery build. `npm run analyze:changes` checks introduced findings before committing.

Browser tests, Playwright and browser CI have been removed. No browser installation is needed. Add browser tests later only for an explicitly requested purpose, such as a testing demo.

The standalone demo packages, gallery, generator and shared toolchain remain in place. Physical phones and the workshop network remain untested for Device Rally.

Earlier results in [verification history](VERIFICATION-HISTORY.md) describe previous revisions, not current coverage or required checks. Report only checks actually run for the current change.
