import { expect, test } from '@playwright/test';

test('gallery launches a working independent demo page with no gallery shell', async ({ page }) => {
  await page.goto('/#/demo/art');
  await page.getByRole('link', { name: 'Open standalone demo' }).click();
  await expect(page).toHaveURL(/demos\/art\/index.html$/);
  await expect(page.getByRole('button', { name: 'Save SVG' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Lab' })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Save SVG' })).toBeVisible();
  await page.getByRole('link', { name: 'Create your own artwork' }).click();
  await expect(page).toHaveURL(/#\/create$/);
  await expect(page.getByRole('navigation', { name: 'Lab' })).toBeVisible();
});

test('standalone worker entry resolves its worker asset and computes a result', async ({ page }) => {
  await page.goto(`http://127.0.0.1:${Number(process.env.PLAYWRIGHT_PORT || 4173) + 2}/`);
  await page.getByRole('button', { name: 'Run in Worker', exact: true }).click();
  await expect(page.locator('#workers [role=status]')).toContainText('primes');
  await expect(page.getByRole('link', { name: 'Create an independent demo' })).toHaveCount(0);
});
