# A worked examples · Browser capabilities

These are completed references, separate from your [bootstrap](bootstrap.md). Choose one door below. You can experience the result first, rebuild a small version in your copied `src/demos/<your-idea>/Demo.tsx`, inspect the reference only when stuck, or take an entirely different API direction. [Start the playground](../../playground/README.md) if you want these examples.

## D3: build an atlas of ideas

**Experience:** Open the playground's D3 constellation. Drag an idea and watch its neighbours follow, switch between one constellation and four islands, or filter to one cluster. Nodes stay pinned after dragging; release them with the button. Keyboard users can focus a node and move it with arrow keys. Pause motion to inspect it; reduced-motion preference starts paused.

**Build towards it:** In your copied `src/demos/<your-idea>/Demo.tsx`, draw three labelled SVG circles from an array. Add a few source/target connections, then use D3's force simulation to calculate positions. Start with one force, inspect the result, and add links or collision avoidance only when useful. The completed reference is `src/examples/Constellation.tsx`; it uses the focused `d3-force` package rather than the whole D3 bundle.

**Understand the boundary:** D3 owns mutable simulation nodes; React receives position snapshots and renders SVG. Copy links before passing them to D3 because the simulation resolves their endpoints into node objects. Stop its timer when leaving the example. D3 is a library on top of browser capabilities, not a native browser API.

**Make it yours:** Replace the illustrative topics with technologies you use, dependencies in a small project, characters in a story or a dataset you are curious about. Decide what a connection means before styling it. The included edges are invented for exploration, not evidence about actual relationships.

**Branch:** Change force strengths, add a search, expose meaningful connection weights, or compare a force layout with a static diagram. Ask whether motion helps explain the data. The mobile graph scrolls horizontally to keep labels usable; filter to reduce clutter.

References: [D3 force simulations](https://d3js.org/d3-force/simulation), [link forces](https://d3js.org/d3-force/link), [collision forces](https://d3js.org/d3-force/collide). The completed example is an optional destination, not a requirement to rebuild every control.

## Door 1: draw something surprising

**Experience:** In the SVG example, adjust the dot count, remix and save an image. Notice that the same seed produces the same result.

**Build towards it:** Start with one SVG circle. Add an array of circles, then one control. If useful, borrow `makeDots` from `src/examples/art.ts`; alternatively invent your own distribution. The finished reference is `src/examples/ArtStudio.tsx`.

**Branch:** Spiral instead of random scatter; data-driven sizes; pointer interaction; a game of finding a dot; keyboard controls or reduced motion. Optional export is already demonstrated by serialising SVG into a downloadable Blob.

**Question worth keeping:** When would SVG suit this better than Canvas? What information would a person need if they could not see the image?

## Door 2: keep the interface listening

**Experience:** Run the calculation in a Worker and use the interaction pad. Compare it on the main thread, starting small. A quick run may be hard to perceive; inspect a trace or increase the bounded workload.

**Build towards it:** Start a Worker that receives a number and replies with a result. Then move one pure computation into it, show its status and add cancellation by terminating the Worker. References: `Workers.tsx`, `compute.worker.ts` and `compute.ts` under `src/examples`.

**Branch:** Progress messages, image processing, search, or producing a large array of points for your SVG. Think about data-transfer cost, cancellation and stale results when inputs change.

**Evidence:** Record workload, browser/device and whether interaction remains available. The displayed time measures computation, not Worker startup or messaging. Off-thread work does not guarantee faster execution.

## Door 3: let two tabs talk

**Experience:** Open the second lab tab from the signals example. Send a message and observe that only the other tab receives it. Close and reopen a tab: there is no saved history.

**Build towards it:** Create a `BroadcastChannel`, send a string, display received strings and close the channel when the component leaves. Reference: `src/examples/Signals.tsx`. Keep both tabs on the exact same origin.

**Branch:** Share a palette, quiz question or simple drawing event between tabs. Decide how to distinguish event types, handle invalid messages or avoid feedback loops.

**Scope:** This is local tab communication. To explore WebSockets, SSE or WebRTC across computers, investigate their server/peer/signalling requirements separately; do not assume BroadcastChannel provides that service.

## Other doors remain open

View Transitions, Canvas, browser scheduling, WebAssembly and other APIs are valid choices. Find a minimal documented example, establish browser support and keep the first result small. No one is expected to try every API.

## References and a stopping point

- [MDN SVG tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [MDN: using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [MDN: Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [MDN: Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

Stop when you have a discovery worth explaining. Capture your question, one piece of evidence and a next possibility in [findings](../findings.md). You can combine doors or jump to [your own project](../d/README.md).

[Choose another track](../../README.md#tracks)
