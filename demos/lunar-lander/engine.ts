export interface Flight {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  fuel: number;
  outcome: number;
  burning: boolean;
  altitude: number;
}

interface RustEngine {
  reset: () => void;
  step: (dt: number, turn: number, thrust: number) => void;
  terrain_height: (x: number) => number;
  read_state: (index: number) => number;
}

export async function loadEngine(signal: AbortSignal) {
  const response = await fetch(new URL('./engine.wasm', import.meta.url), { signal });
  if (!response.ok) throw new Error(`Engine download failed (${response.status}).`);
  const { instance } = await WebAssembly.instantiate(await response.arrayBuffer());
  const rust = instance.exports as unknown as RustEngine;
  return {
    terrain: Array.from({ length: 97 }, (_, i): [number, number] => [
      i * 10,
      rust.terrain_height(i * 10),
    ]),
    reset: () => rust.reset(),
    step: (dt: number, turn: number, thrust: boolean) => rust.step(dt, turn, Number(thrust)),
    snapshot: (): Flight => ({
      x: rust.read_state(0),
      y: rust.read_state(1),
      vx: rust.read_state(2),
      vy: rust.read_state(3),
      angle: rust.read_state(4),
      fuel: rust.read_state(5),
      outcome: rust.read_state(6),
      burning: Boolean(rust.read_state(7)),
      altitude: rust.read_state(8),
    }),
  };
}
