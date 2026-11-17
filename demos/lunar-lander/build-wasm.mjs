import { execFileSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';

// Rust is only needed when changing the engine; normal Vite builds use engine.wasm.
const root = new URL('./', import.meta.url);
execFileSync(
  'cargo',
  [
    'build',
    '--manifest-path',
    'rust/Cargo.toml',
    '--release',
    '--target',
    'wasm32-unknown-unknown',
    '--locked',
  ],
  { cwd: root, stdio: 'inherit' },
);
copyFileSync(
  new URL('rust/target/wasm32-unknown-unknown/release/lunar_lander.wasm', root),
  new URL('engine.wasm', root),
);
