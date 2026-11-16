import { expect, test } from '@playwright/test';

test('remix, export and begin an independent idea', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/demo/art');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Generative postcard');
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
  await page.goto('/#/create');
  await page.getByLabel('What are you curious about?').fill('Can I build a chapter quiz?');
  await expect(page.locator('.idea-stage')).toContainText('Can I build a chapter quiz?');
  expect(errors).toEqual([]);
});

test('real Worker returns the same result as the main-thread computation', async ({ page }) => {
  await page.goto('/#/demo/workers');
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
  await page.goto('/#/demo/workers');
  await page.getByRole('button', { name: 'Run in Worker', exact: true }).click();
  await page.getByRole('button', { name: /Interaction pad/ }).click();
  await expect(page.getByRole('button', { name: /Interaction pad/ })).toContainText('1');
  await page.getByRole('button', { name: 'Cancel Worker' }).click();
  await expect(page.locator('#workers [role=status]')).toContainText('Cancelled');
  await expect(page.getByRole('button', { name: 'Run in Worker', exact: true })).toBeEnabled();
});

test('two tabs exchange local signals without reflecting HTML or keeping more than five', async ({ page, context }) => {
  await page.goto('/#/demo/signals');
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
  await page.goto('/#/demo/art');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('#content')).toBeFocused();
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#content')).toBeFocused();
  await page.goto('/#/create');
  await page.getByLabel('What are you curious about?').fill('My own mobile experiment');
  await expect(page.locator('.idea-stage')).toContainText('My own mobile experiment');
});

test('unsupported browser capability has a readable fallback', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'BroadcastChannel', { value: undefined, configurable: true }); });
  await page.goto('/#/demo/signals');
  await expect(page.locator('#signals [role=status]')).toContainText('unavailable here');
  await expect(page.getByRole('button', { name: 'Send signal' })).toBeDisabled();
});

test('D3 graph supports filtering, layout changes, dragging and keyboard pinning', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/demo/constellation');
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
  await page.getByRole('link', { name: 'All tracks', exact: true }).click();
  await expect(graph).toHaveCount(0);
  await page.goBack();
  await expect(graph.locator('[data-node]')).toHaveCount(20);
  expect(errors).toEqual([]);
});

test('D3 graph starts still with reduced motion and remains usable on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/demo/constellation');
  const graph = page.locator('#constellation');
  await expect(graph.getByRole('button', { name: 'Resume motion' })).toBeVisible();
  const before = await graph.locator('[data-node="0-0"]').getAttribute('transform');
  await page.getByLabel('Explore a cluster').focus();
  await expect(graph.locator('[data-node="0-0"]')).toHaveAttribute('transform', before!);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('tracks, reference demos and bootstrap are distinct SPA journeys', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Follow your what if.');
  await page.evaluate(() => { (window as unknown as { labNavigation: boolean }).labNavigation = true; });
  await page.getByRole('link', { name: 'Explore Code Quality & Maintainability' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Code Quality & Maintainability');
  await page.getByRole('link', { name: 'A test gap, investigated' }).click();
  await expect(page.getByText('148,933', { exact: false }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Create a demo', exact: true }).click();
  await expect(page.locator('#art')).toHaveCount(0);
  await page.getByLabel('What are you curious about?').fill('My own experiment');
  await expect(page.locator('.idea-stage')).toContainText('My own experiment');
  expect(await page.evaluate(() => (window as unknown as { labNavigation: boolean }).labNavigation)).toBe(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make room for your idea.');
  await page.goto('/#/demo/missing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

test('a failed lazy demo leaves navigation usable', async ({ page }) => {
  await page.route('**/assets/Tooling-*.js', route => route.abort());
  await page.goto('/#/demo/tooling');
  await expect(page.getByRole('alert')).toContainText('This experiment could not open');
  await page.getByRole('link', { name: 'All tracks', exact: true }).click();
  await page.getByRole('link', { name: 'Generative postcard', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Save SVG' })).toBeVisible();
});

test('all named tracks open their matching journey and guide', async ({ page }) => {
  for (const [id, title] of [
    ['modern-web', 'Modern Web Capabilities'],
    ['code-quality', 'Code Quality & Maintainability'],
    ['developer-experience', 'Developer Experience & Tooling'],
    ['experimental-projects', 'Experimental Projects'],
  ]) {
    await page.goto('/');
    await page.getByRole('link', { name: `Explore ${title}` }).click();
    await expect(page).toHaveURL(new RegExp(`#/track/${id}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('.guide')).toContainText('First result');
    await page.getByRole('link', { name: 'Explore further', exact: true }).click();
    await expect(page.locator('.guide table')).toBeVisible();
    await page.getByRole('link', { name: 'Worked examples', exact: true }).click();
    await expect(page.locator('.guide')).not.toBeEmpty();
    await page.reload();
    await expect(page.locator('.guide')).not.toBeEmpty();
  }
});

test('participant guides stay in the app and fit a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/track/modern-web');
  await expect(page.locator('.guide')).toContainText('npm run demo:new');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Setup help', exact: true }).click();
  await expect(page).toHaveURL(/#\/guide\/setup$/);
  await expect(page.locator('.guide')).toContainText('npm ci');
  await page.goBack();
  await expect(page.getByRole('link', { name: 'Getting started', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Explore further', exact: true }).click();
  await expect(page.locator('.guide table')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Record your findings', exact: true }).click();
  await expect(page).toHaveURL(/#\/guide\/findings$/);
  await expect(page.locator('.guide')).toContainText('What were we curious about?');
});

test('guide links resolve to real app pages', async ({ page }) => {
  const routes = ['/create', '/guide/setup', '/guide/contributing', '/guide/findings',
    ...['modern-web', 'code-quality', 'developer-experience', 'experimental-projects']
      .flatMap(id => ['', '/explore', '/examples'].map(suffix => `/track/${id}${suffix}`)),
    '/track/code-quality/fallow'];
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto('/#' + route);
    await expect(page.locator('.guide')).not.toBeEmpty();
    for (const href of await page.locator('.guide a').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')!))) {
      if (href.startsWith('#/')) links.add(href);
      else expect(href).toMatch(/^https?:\/\//);
    }
  }
  for (const href of links) {
    await page.goto('/' + href);
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Page not found');
  }
});

test('the Modern Web guide owns its interactive starter', async ({ page }) => {
  await page.goto('/#/track/modern-web');
  const guide = page.locator('.guide');
  const slider = guide.getByRole('slider');
  await expect(slider).toBeVisible();
  await slider.fill('70');
  await expect(guide.locator('circle')).toHaveAttribute('r', '70');
  const starter = guide.locator('.experiment');
  expect(await starter.evaluate(element => {
    const headings = [...element.parentElement!.children];
    return headings.indexOf(element) < headings.findIndex(child => child.textContent === '3. Create your own demo');
  })).toBe(true);
  await page.getByRole('link', { name: 'Explore further', exact: true }).click();
  await expect(page.getByRole('slider')).toHaveCount(0);
  await page.goBack();
  await expect(guide.getByRole('slider')).toBeVisible();
});

test('a failed MDX page leaves track and demo navigation usable', async ({ page }) => {
  await page.route('**/assets/get-started-*.js', route => route.abort());
  await page.goto('/#/track/modern-web');
  await expect(page.getByRole('alert')).toContainText('This guide could not load');
  await page.getByRole('link', { name: 'Explore further', exact: true }).click();
  await expect(page.locator('.guide table')).toBeVisible();
  await page.getByRole('link', { name: 'All tracks', exact: true }).click();
  await page.getByRole('link', { name: 'Generative postcard', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Save SVG' })).toBeVisible();
});


test('reference pages keep practical next steps in the app on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/create', '/demo/art', '/demo/constellation', '/demo/workers', '/demo/signals', '/demo/fallow', '/demo/quality', '/demo/tooling']) {
    await page.goto('/#' + route);
    if (route === '/create') await expect(page.locator('.guide')).not.toBeEmpty();
    if (route.startsWith('/demo/')) await expect(page.locator('.experiment > :not([role=status])').first()).toBeVisible();
    await expect(page.locator('main')).not.toContainText(/in your editor|Local guide:/);
    await expect(page.locator('main a[href$=".md"], main a[href$=".mdx"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto('/#/create');
  await expect(page.getByRole('heading', { name: 'Your first change', exact: true })).toBeVisible();
  await expect(page.locator('main')).toContainText('npm ci');
  await expect(page.locator('main')).toContainText('npm run demo:new');
  await expect(page.locator('main')).toContainText('npm run check');
});
