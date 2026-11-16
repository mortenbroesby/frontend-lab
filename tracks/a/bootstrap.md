# A bootstrap · One capability, one experiment

**You need:** Node 24.x and npm for this starter, an editor and a current browser. For another project, use its normal setup instead.

From the repository root:

```sh
cd playground
npm ci
npm run dev
```

Open the printed server address with `/#/track/a` (normally `http://127.0.0.1:5173/#/track/a`). You should see one circle and a radius control, alongside links to separate reference demos. Move the control, then choose **Create a demo** to copy a template into your own folder. You can borrow the small circle component from `playground/src/starters/BrowserStarter.tsx`.

**Pick a small next step:** add a second shape; react to a pointer; move one calculation to a Worker; or replace the circle with another browser API experiment. You decide the direction.

**If you want a destination:** open `/#/demo/constellation` separately and read the [D3 guide](examples.md#d3-build-an-atlas-of-ideas). A few nodes and one force are enough for a first result. There is no need to recreate all its controls.

[Setup help](../../playground/README.md) · [Back to Track A](README.md)
