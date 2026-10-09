import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const screenshotDir = path.resolve('..', 'design-research', 'screenshots', 'states');
const actions: Record<string, string> = { aes: 'Start Encryption Visualization', rsa: 'Generate RSA Key Pair', ecc: 'Tiny (p=23)', 'block-modes': 'Encrypt with ECB', 'diffie-hellman': 'Start Key Exchange', hashing: 'Hash It!', hmac: 'Compute HMAC', signatures: 'Generate Keys & Sign', padding: 'Apply Padding', 'password-hashing': 'Hash Password', tls: 'Start Handshake', cryptanalysis: 'Brute Force' };

async function capture(page: Page, slug: string, state: string, width: number): Promise<void> {
  await mkdir(screenshotDir, { recursive: true });
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: path.join(screenshotDir, `${slug}-${state}-${width}.png`), fullPage: true });
}

async function pause(page: Page): Promise<void> {
  const button = page.getByRole('button', { name: /^Pause(?: visualization)?$/ });
  if (await button.count()) await button.first().click();
}

for (const width of [1440, 390]) {
  for (const [slug, action] of Object.entries(actions)) {
    test(`${slug} lab states at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`/${slug}`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page).toHaveTitle(/CryptoViz/);
      await page.getByRole('link', { name: 'Learn More', exact: false }).first().click();
      await expect(page.locator('#lesson-notes')).toBeInViewport();
      await capture(page, slug, 'initial', width);
      const firstInput = page.locator('main input[type="text"], main textarea').first();
      if (await firstInput.count()) {
        const original = await firstInput.inputValue();
        await firstInput.fill('');
        if (['aes', 'hmac', 'signatures', 'password-hashing'].includes(slug)) {
          await expect(page.getByRole('button', { name: action, exact: true })).toBeDisabled();
        }
        await capture(page, slug, 'empty', width);
        await firstInput.fill(original);
      }
      await page.getByRole('button', { name: action, exact: slug !== 'ecc' }).first().click();
      await pause(page);
      await expect(page.getByRole('button', { name: /^(?:Go to )?Next step$/i }).first()).toBeVisible();
      await page.getByRole('button', { name: /^(?:Go to )?Next step$/i }).first().click();
      await capture(page, slug, 'step', width);
      const previous = page.getByRole('button', { name: /^(?:Go to )?Previous step$/i }).first();
      await previous.click();
      await expect(previous).toBeDisabled();
      await page.getByRole('button', { name: '4x', exact: true }).first().click();
      await page.getByRole('button', { name: /^Play(?: visualization)?$/ }).first().click();
      await expect(page.getByRole('button', { name: /^Pause(?: visualization)?$/ }).first()).toBeVisible();
      await pause(page);
      const next = page.getByRole('button', { name: /^(?:Go to )?Next step$/i }).first();
      for (let i = 0; i < 90 && await next.isEnabled(); i++) await next.click();
      await expect(next).toBeDisabled();
      await capture(page, slug, 'result', width);
      const reset = page.getByRole('button', { name: 'Reset visualization', exact: true }).first();
      if (await reset.count()) { await reset.click(); await expect(previous).toBeDisabled(); }
      await expect(page.locator('#lesson-quiz')).toBeVisible();
      await expect(page.getByRole('region', { name: 'Continue learning' })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}
