import { defineConfig } from '@playwright/test';

// Explicit opt-in: this smoke test depends on public signaling and WebRTC connectivity.
const port = Number(process.env.PLAYWRIGHT_PORT || 4174);

export default defineConfig({
  testDir: './tests/devices',
  outputDir: './test-results/devices',
  testMatch: '**/*.live.ts',
  timeout: 90000,
  workers: 1,
  use: { baseURL: `http://127.0.0.1:${port}`, channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
  webServer: {
    command: `npm run build --workspace @lab/demo-device-rally && npm run preview --workspace @lab/demo-device-rally -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`, reuseExistingServer: false, timeout: 60000,
  },
});
