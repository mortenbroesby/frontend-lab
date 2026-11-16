import { expect, test } from '@playwright/test';

test('real public signaling connects independent clients for two-way WebRTC cheers', async ({ browser }) => {
  const contexts = await Promise.all([browser.newContext(), browser.newContext(), browser.newContext()]);
  const pages = await Promise.all(contexts.map(context => context.newPage()));
  const code = `test-${Date.now()}`;
  const errors: string[] = [];
  const diagnostics: string[] = [];
  try {
    for (const [index, page] of pages.entries()) {
      page.on('pageerror', error => errors.push(error.message));
      page.on('websocket', socket => socket.on('socketerror', error => diagnostics.push(`${new URL(socket.url()).host}: ${error}`)));
      await page.goto(`/?rallyRoom=${index === 2 ? `${code}-x` : code}#/demo/device-rally`);
    }
    await expect(pages[0].getByTestId('rally-peers')).toHaveText('1 other devices connected', { timeout: 60000 });
    await expect(pages[1].getByRole('button', { name: 'Send rocket' })).toBeEnabled();
    await pages[0].getByRole('button', { name: 'Send rocket' }).click();
    await expect(pages[1].getByTestId('rally-emoji')).toHaveText('🚀');
    await pages[1].getByRole('button', { name: 'Send sparkle' }).click();
    await expect(pages[0].getByTestId('rally-emoji')).toHaveText('✨');
    await expect(pages[0].getByTestId('rally-total')).toHaveText('2 cheers seen here');
    await expect(pages[2].getByTestId('rally-total')).toHaveText('0 cheers seen here');
    await pages[1].getByRole('button', { name: 'Leave room' }).click();
    await expect(pages[0].getByTestId('rally-peers')).toHaveText('0 other devices connected', { timeout: 15000 });
    await pages[1].getByRole('button', { name: 'Join room', exact: true }).click();
    await expect(pages[1]).toHaveURL(new RegExp(`rallyRoom=${code}`));
    await expect(pages[0].getByTestId('rally-peers')).toHaveText('1 other devices connected', { timeout: 60000 });
    expect(errors).toEqual([]);
  } catch (error) {
    console.error({ statuses: await Promise.all(pages.map(page => page.getByRole('status').textContent().catch(() => 'unavailable'))), errors, networkErrors: diagnostics.slice(-12) });
    throw error;
  } finally { await Promise.all(contexts.map(context => context.close())); }
});
