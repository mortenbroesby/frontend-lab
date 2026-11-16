import { expect, test } from '@playwright/test';

test('unsupported context explains requirements without opening signaling', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'RTCPeerConnection', { value: undefined }); });
  await page.goto('/demos/device-rally/index.html');
  await expect(page.getByRole('status')).toContainText('secure page');
  await expect(page.getByRole('button', { name: 'Send rocket' })).toBeDisabled();
  await page.getByRole('button', { name: 'Leave room' }).click();
  await page.getByLabel('Room code').fill('another-room');
  await page.getByRole('button', { name: 'Join room', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('secure page');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('unreachable signaling never claims a peer connection and allows leaving', async ({ page }) => {
  await page.routeWebSocket(/wss:\/\//, socket => socket.close());
  await page.goto('/demos/device-rally/index.html');
  await expect(page.getByRole('status')).toContainText(/Still alone|Connection problem/, { timeout: 25000 });
  await expect(page.getByRole('button', { name: 'Send rocket' })).toBeDisabled();
  await page.getByRole('button', { name: 'Leave room' }).click();
  await expect(page.getByRole('status')).toContainText('You left');
  await page.goto('/');
  await page.getByRole('link', { name: 'Device rally', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Leave room' })).toBeEnabled();
});
