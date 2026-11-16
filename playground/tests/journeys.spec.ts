import { expect, test } from '@playwright/test';

test('remix, export, hide examples and begin an independent idea', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Follow your');
  await page.getByRole('button', { name: 'Remix composition' }).click();
  await expect(page.getByTestId('seed')).toHaveText('43');
  await page.getByRole('slider', { name: 'Dots' }).fill('120');
  await expect(page.locator('#art svg circle')).toHaveCount(120);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save SVG' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('front-end-lab-43.svg');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const exported = Buffer.concat(chunks).toString();
  expect(exported).toContain('http://www.w3.org/2000/svg');
  expect(exported.match(/<circle/g)).toHaveLength(120);
  await page.getByRole('button', { name: 'Hide examples' }).click();
  await expect(page.locator('#examples')).toBeHidden();
  await page.getByRole('link', { name: 'Try the browser examples' }).click();
  await expect(page.locator('#examples')).toBeVisible();
  await page.getByLabel('What are you curious about?').fill('Can I build a chapter quiz?');
  await expect(page.locator('.idea-stage')).toContainText('Can I build a chapter quiz?');
  expect(errors).toEqual([]);
});

test('real Worker returns the same result as the main-thread computation', async ({ page }) => {
  await page.goto('/#workers');
  await page.getByLabel('Count primes up to').selectOption('100000');
  await page.getByRole('button', { name: 'Run in Worker', exact: true }).click();
  await expect(page.locator('#workers [role=status]')).toContainText('9,592 primes');
  await page.getByRole('button', { name: 'Compare on main thread' }).click();
  await expect(page.locator('#workers [role=status]')).toContainText('9,592 primes');
});

test('interaction and cancellation remain available while a Worker is pending', async ({ page }) => {
  // Delay only delivery to deterministically exercise the pending state on fast hardware.
  // The separate test above checks the real Worker and production bundle.
  await page.addInitScript(() => {
    const RealWorker = window.Worker;
    window.Worker = class extends RealWorker {
      override postMessage(message: unknown) {
        setTimeout(() => super.postMessage(message), 1000);
      }
    };
  });
  await page.goto('/#workers');
  await page.getByRole('button', { name: 'Run in Worker', exact: true }).click();
  await page.getByRole('button', { name: /Interaction pad/ }).click();
  await expect(page.getByRole('button', { name: /Interaction pad/ })).toContainText('1');
  await page.getByRole('button', { name: 'Cancel Worker' }).click();
  await expect(page.locator('#workers [role=status]')).toContainText('Cancelled');
  await expect(page.getByRole('button', { name: 'Run in Worker', exact: true })).toBeEnabled();
});

test('two tabs exchange local signals without reflecting HTML or keeping more than five', async ({ page, context }) => {
  await page.goto('/#signals');
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open second lab tab' }).click();
  const second = await popupPromise;
  await expect(second.getByRole('button', { name: 'Send signal' })).toBeEnabled();
  await page.getByLabel('Your signal').fill('<b>A shared discovery</b>');
  await page.getByRole('button', { name: 'Send signal' }).click();
  await expect(second.locator('.messages')).toContainText('<b>A shared discovery</b>');
  await expect(second.locator('.messages b')).toHaveCount(0);
  await expect(page.locator('.messages li')).toHaveCount(0);
  for (let index = 0; index < 6; index++) {
    await page.getByLabel('Your signal').fill(`Signal ${index}`);
    await page.getByRole('button', { name: 'Send signal' }).click();
  }
  await expect(second.locator('.messages li')).toHaveCount(5);
  await expect(second.locator('.messages li').first()).toHaveText('Signal 5');
  await page.getByLabel('Your signal').fill('   ');
  await expect(page.getByRole('button', { name: 'Send signal' })).toBeDisabled();
  await second.close();
  expect(context.pages()).toHaveLength(1);
});

test('narrow screen and reduced-motion preference remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('.orbit')).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to your journey' })).toBeFocused();
  await page.getByLabel('What are you curious about?').fill('My own mobile experiment');
  await expect(page.locator('.idea-stage')).toContainText('My own mobile experiment');
});

test('unsupported browser capability has a readable fallback', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'BroadcastChannel', { value: undefined, configurable: true }); });
  await page.goto('/#signals');
  await expect(page.locator('#signals [role=status]')).toContainText('unavailable here');
  await expect(page.getByRole('button', { name: 'Send signal' })).toBeDisabled();
});

test('D3 graph supports filtering, layout changes, dragging and keyboard pinning', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#constellation');
  const graph = page.locator('#constellation');
  await expect(graph.locator('[data-node]')).toHaveCount(20);
  await graph.getByRole('button', { name: 'Pause motion' }).click();
  const node = graph.locator('[data-node="0-0"]');
  const before = await node.getAttribute('transform');
  await node.focus();
  await page.keyboard.press('ArrowRight');
  await expect(node).not.toHaveAttribute('transform', before!);
  await expect(graph.getByRole('status')).toContainText('SVG · Browser · pinned');
  const circle = node.locator('circle').last();
  const box = await circle.boundingBox();
  const afterKeyboard = await node.getAttribute('transform');
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + 60, box!.y + 40, { steps: 5 });
  await page.mouse.up();
  await expect(node).not.toHaveAttribute('transform', afterKeyboard!);
  await graph.getByRole('button', { name: 'Release pinned ideas' }).click();
  await expect(graph.getByRole('status')).not.toContainText('pinned');
  await page.getByLabel('Explore a cluster').selectOption('1');
  await expect(graph.locator('[data-node]')).toHaveCount(5);
  await expect(graph.locator('.graph-count')).toHaveText('5 ideas · 5 connections');
  await page.getByLabel('Shape the network').selectOption('clusters');
  await expect(graph.locator('svg')).toBeVisible();
  await page.getByLabel('Explore a cluster').selectOption('all');
  await expect(graph.locator('[data-node]')).toHaveCount(20);
  await page.getByRole('button', { name: 'Hide examples' }).click();
  await expect(graph).toHaveCount(0);
  await page.getByRole('button', { name: 'Show examples' }).click();
  await expect(graph.locator('[data-node]')).toHaveCount(20);
  expect(errors).toEqual([]);
});

test('D3 graph starts still with reduced motion and remains usable on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#constellation');
  const graph = page.locator('#constellation');
  await expect(graph.getByRole('button', { name: 'Resume motion' })).toBeVisible();
  const before = await graph.locator('[data-node="0-0"]').getAttribute('transform');
  await page.getByLabel('Explore a cluster').focus();
  await expect(graph.locator('[data-node="0-0"]')).toHaveAttribute('transform', before!);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
