# Lunar Lander

Land on the green pad using limited fuel. Hold left/right to rotate and up/Space to thrust, or use the touch buttons. Brake early, level out and keep descent below 35 m/s and drift below 25 m/s. Launch focuses the flight area; keyboard controls only apply there or on the control buttons. Switching away pauses the game.

```sh
npm run dev --workspace @lab/demo-lunar-lander
```

The checked-in `engine.wasm` means playing, building and running the JavaScript tests requires only the normal Lab setup. There are no runtime network services or external assets.

## Change the Rust

Install Rust through [rustup](https://rustup.rs/), then from the repository root:

```sh
rustup target add wasm32-unknown-unknown
npm run test:rust --workspace @lab/demo-lunar-lander
npm run build:wasm --workspace @lab/demo-lunar-lander
npm test --workspace @lab/demo-lunar-lander
```

Reload the browser after rebuilding. Commit `engine.wasm` alongside any Rust changes. The initial binary was compiled with Rust 1.100.0; `rust/Cargo.lock` has no external crates. Normal app builds intentionally do not invoke Cargo.

- `rust/src/lib.rs` owns gravity, thrust, fuel, rotation, collision and landing decisions. Start by changing `GRAVITY` or `THRUST`.
- `engine.ts` loads the binary and translates the eight numeric state fields into a typed snapshot. `reset`, `step` and `read_state` are the entire Rust/JavaScript interface.
- `use-flight.ts` feeds controls into fixed 120 Hz simulation steps, pauses on blur and cleans up its animation loop.
- `paint.ts` draws the state. The 960 × 600 world uses a flat collision surface at y=510; distant hills are scenery. Canvas scales to the available screen.

Try changing the fuel budget, comparing different gravity values or adding a second landing pad. Keep collision rules and their drawing in agreement. This is an interoperability example, not a claim that Wasm is faster or necessary for a game this small.

[WebAssembly loading](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Loading_and_running) · [Rust's browser target](https://doc.rust-lang.org/rustc/platform-support/wasm32-unknown-unknown.html)
