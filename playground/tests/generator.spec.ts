import { expect, test } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer } from 'vite';

const exec = promisify(execFile);

test('the public generator command produces discoverable, editable independent bootstraps', async ({ page }) => {
  test.setTimeout(90000);
  const source = fileURLToPath(new URL('../../', import.meta.url));
  const root = await mkdtemp(join(tmpdir(), 'lab-onboarding-'));
  let server: Awaited<ReturnType<typeof createServer>> | undefined;
  try {
    for (const path of ['package.json', 'turbo.json', 'turbo', 'playground', 'packages']) {
      await cp(join(source, path), join(root, path), {
        recursive: true,
        filter: path => !['node_modules', 'dist', '.turbo', 'test-results', 'playwright-report'].includes(basename(path)),
      });
    }
    // Reuse installed dependencies, but generate and edit only in a disposable workspace.
    await symlink(join(source, 'node_modules'), join(root, 'node_modules'), 'dir');
    const registry = await readFile(join(root, 'playground/src/demo-registry.ts'), 'utf8');
    const starter = await readFile(join(root, 'playground/src/starters/BrowserStarter.tsx'), 'utf8');
    for (const [name, id, track, presentation] of [
      ['My circle', 'onboarding-circle', 'modern-web', 'standalone'],
      ['My idea', 'onboarding-idea', 'experimental-projects', 'inline'],
    ]) {
      const { stdout } = await exec('npm', ['run', 'demo:new', '--', '--args', name, id, track, 'Test participant', 'Try my first change', presentation], { cwd: root, timeout: 30000 });
      expect(stdout).toContain(`playground/src/demos/${id}/Demo.tsx`);
      expect(stdout).toContain(`#/demo/${id}`);
      await exec('npm', ['run', 'build', '--workspace', `@lab/demo-${id}`], { cwd: root, timeout: 30000 });
    }
    await exec('npm', ['run', 'typecheck', '--workspace', 'front-end-lab-playground'], { cwd: root, timeout: 30000 });
    await build({ root: join(root, 'playground'), logLevel: 'error' });
    server = await createServer({ root: join(root, 'playground'), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
    await server.listen();
    const address = server.httpServer!.address();
    if (!address || typeof address === 'string') throw new Error('Expected a local TCP server');
    const url = `http://127.0.0.1:${address.port}`;
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.getByRole('link', { name: 'My circle', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('My circle');
    await page.getByRole('link', { name: 'Open standalone demo' }).click();
    await page.getByRole('slider', { name: 'Circle radius' }).fill('65');
    await expect(page.locator('.visual-stage circle')).toHaveAttribute('r', '65');

    const component = join(root, 'playground/src/demos/onboarding-circle/Demo.tsx');
    await writeFile(component, (await readFile(component, 'utf8')).replace('fill="#24483e"', 'fill="#ff0000"'));
    await expect(page.locator('.visual-stage circle')).toHaveAttribute('fill', '#ff0000');
    await page.reload();
    await expect(page.locator('.visual-stage circle')).toHaveAttribute('fill', '#ff0000');
    await expect(page.getByRole('slider', { name: 'Circle radius' })).toHaveValue('30');

    await page.goto(`${url}/#/track/experimental-projects`);
    await page.getByRole('link', { name: 'My idea', exact: true }).click();
    await expect(page.getByLabel('What are you curious about?')).toHaveValue('My idea');
    await page.getByLabel('What are you curious about?').fill('My first result');
    await expect(page.locator('.idea-stage')).toContainText('My first result');
    await page.reload();
    await expect(page.getByLabel('What are you curious about?')).toHaveValue('My idea');
    expect(await readFile(join(root, 'playground/src/demo-registry.ts'), 'utf8')).toBe(registry);
    expect(await readFile(join(root, 'playground/src/starters/BrowserStarter.tsx'), 'utf8')).toBe(starter);
    expect(errors).toEqual([]);
  } finally {
    await server?.close();
    await rm(root, { recursive: true, force: true });
  }
});
