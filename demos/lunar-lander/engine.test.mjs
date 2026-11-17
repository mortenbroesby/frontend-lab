import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const bytes = await readFile(new URL('./engine.wasm', import.meta.url));

test('committed Rust binary exports a working, resettable flight engine', async () => {
  const { instance } = await WebAssembly.instantiate(bytes);
  const { reset, step, read_state: read } = instance.exports;
  assert.equal(read(0), 270);
  step(1 / 120, 0, 1);
  assert.ok(read(3) < 0, 'thrust opposes gravity');
  assert.ok(read(5) < 100, 'thrust burns fuel');
  reset();
  assert.equal(read(5), 100);
  for (let i = 0; i < 1000; i++) step(1 / 120, 0, 0);
  assert.equal(read(6), 2, 'uncontrolled descent crashes');
  assert.equal(read(7), 0);
});

test('the compiled engine exposes uneven terrain and a flat landing pad', async () => {
  const {
    instance: { exports: game },
  } = await WebAssembly.instantiate(bytes);
  assert.equal(game.terrain_height(240), 440);
  assert.equal(game.terrain_height(610), 510);
  assert.equal(game.terrain_height(680), 510);
  assert.equal(game.terrain_height(750), 510);
  assert.ok(game.read_state(8) < 382, 'altitude follows terrain rather than pad height');
});
