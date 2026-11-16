# Code Quality & Maintainability worked example · Does the largest workload have a trustworthy result?

This is a completed investigation, separate from [your bootstrap](#/track/code-quality). It examines the kit's actual code, not planted defects. The resulting test is already included; choose a different question rather than reproducing a known gap.

For a second investigation using automated analysis, follow the [Fallow walkthrough](#/track/code-quality/fallow).

## Problem and approach

The Worker demo offers a workload up to two million. Before this investigation, tests checked known results up to 100,000 and rejected values above the supported maximum. The question was whether the **largest accepted input** had a verified result.

1. Read `playground/src/examples/compute.ts`: it counts primes inclusively and allows `MAX_LIMIT = 2_000_000`.
2. Read `playground/src/examples/Workers.tsx`: the largest menu option passes that same input.
3. Read the tests: rejecting values above the limit tests validation, not correctness at the limit.
4. Independently calculate the result with a sieve rather than reuse the trial-division implementation: 148,933 primes.
5. Add one assertion at the accepted boundary in `playground/tests/compute.test.ts`.

The new test is named **“the largest selectable workload has a known correct result”**. From `playground`, `npm test` runs it alongside the smaller cases. It passes with the existing implementation: we found a confidence gap, not a demonstrated calculation bug.

## Modern Web Capabilities concern that did not justify a rewrite

Both UI and Worker paths call the calculation. That might initially look like duplicated implementation. Following imports shows that they share `compute.ts`; running it in two places is the deliberate comparison. Removing one caller would remove the learning experience. “Two callers” is not “two implementations”.

## Improvement, evidence and limits

The improvement is one meaningful boundary test, without changing runtime behaviour. It complements validation tests and browser tests of the interaction. The expected count was checked independently; no timing threshold is asserted because hardware differs.

This does not prove every input correct, establish performance on participant machines or suggest all code needs maximum-size tests. Use the question and evidence pattern on another part of this kit or your own repository.

[Your investigation bootstrap](#/track/code-quality) · [Code Quality & Maintainability](#/track/code-quality/explore)
