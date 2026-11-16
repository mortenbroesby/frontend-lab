import { defineConfig } from '@playwright/test';

// Explicit opt-in: this smoke test depends on public signaling and WebRTC connectivity.
export default defineConfig({
  testDir: './tests/devices',
  outputDir: './test-results/devices',
  testMatch: '**/*.live.ts',
  timeout: 90000,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4174', channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174', reuseExistingServer: false, timeout: 60000,
  },
});
