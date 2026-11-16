import { defineConfig } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT || 4173);

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    headless: true,
    // An existing Chrome installation avoids a second browser download.
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: [{
    command: `npm run build && npm run preview -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 60000,
  }, {
    command: `npm run build --workspace @lab/demo-workers && npm run preview --workspace @lab/demo-workers -- --port ${port + 2} --strictPort`,
    url: `http://127.0.0.1:${port + 2}`,
    reuseExistingServer: false,
    timeout: 60000,
  }],
});
