import { test, expect, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

async function pauseAndFinish(page: Page): Promise<void> {
  const pause = page.getByRole('button', { name: /^Pause(?: visualization)?$/ });
  if (await pause.count()) await pause.first().click();
  const next = page.getByRole('button', { name: /^(?:Go to )?Next step$/i }).first();
  for (let i = 0; i < 90 && await next.isEnabled(); i++) await next.click();
  await expect(next).toBeDisabled();
}
async function capture(page: Page, slug: string, state: string, width: number): Promise<void> {
  await mkdir('../design-research/screenshots/states', { recursive: true });
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `../design-research/screenshots/states/${slug}-${state}-${width}.png`, fullPage: true });
}

for (const width of [1440, 390]) {
  test(`RSA round trip and invalid input at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/rsa');
    for (const size of ['Medium', 'Large', 'Small']) {
      await page.getByRole('button', { name: new RegExp(size === 'Small' ? 'Small' : `^${size}`) }).click();
      await page.getByRole('button', { name: 'Generate RSA Key Pair' }).click();
      await pauseAndFinish(page);
    }
    const input = page.getByRole('spinbutton', { name: /Enter a number to encrypt/ });
    await input.fill('-1');
    await page.getByRole('button', { name: 'Encrypt', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText(/whole number between 0/);
    await capture(page, 'rsa', 'invalid-number', width);
    await input.fill('42');
    await page.getByRole('button', { name: 'Encrypt', exact: true }).click();
    await page.getByRole('button', { name: 'Decrypt with Private Key' }).click();
    await expect(page.getByRole('heading', { name: 'Decrypted Message' })).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await capture(page, 'rsa', 'round-trip', width);
  });

  test(`signature verification and tampering at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/signatures');
    await page.getByRole('button', { name: 'Generate Keys & Sign' }).click();
    await pauseAndFinish(page);
    await page.getByRole('textbox', { name: 'Enter message to sign:' }).fill('Signed learning example');
    await page.getByRole('button', { name: 'Generate Signature', exact: true }).click();
    await page.getByRole('button', { name: 'Test Verification' }).click();
    await page.getByRole('button', { name: 'Verify Signature', exact: true }).last().click();
    await expect(page.getByRole('heading', { name: 'Signature Valid!', exact: true })).toBeVisible();
    await capture(page, 'signatures', 'valid', width);
    await page.getByRole('textbox', { name: 'Message to verify:' }).fill('Tampered learning example');
    await page.getByRole('button', { name: 'Verify Signature', exact: true }).last().click();
    await expect(page.getByRole('heading', { name: 'Signature Invalid!', exact: true })).toBeVisible();
    await capture(page, 'signatures', 'tampered', width);
  });

  test(`curve, mode, scheme and attack variations at ${width}`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const slug of ['ecc', 'block-modes', 'padding', 'cryptanalysis']) {
      await page.goto(`/${slug}`);
      if (slug === 'ecc') {
        for (const name of ['Tiny', 'Small', 'Medium']) { await page.getByRole('button', { name: new RegExp(`^${name}`) }).click(); await pauseAndFinish(page); }
      } else if (slug === 'block-modes') {
        for (const name of ['ECB', 'CBC', 'GCM']) { await page.getByRole('button', { name, exact: true }).click(); await page.getByRole('button', { name: `Encrypt with ${name}` }).click(); await pauseAndFinish(page); }
        await page.getByTitle('Demonstrate ECB pattern problem').click();
      } else if (slug === 'padding') {
        for (const name of ['zero', 'ansi-x923', 'pkcs7']) { await page.getByRole('combobox', { name: 'Scheme' }).selectOption(name); await page.getByRole('button', { name: '8 bytes' }).click(); await page.getByRole('textbox', { name: 'Input Text' }).fill('12345678'); await page.getByRole('button', { name: 'Apply Padding' }).click(); await pauseAndFinish(page); }
        await page.getByRole('textbox', { name: 'Input Text' }).fill(''); await page.getByRole('button', { name: '16 bytes' }).click(); await expect(page.getByRole('button', { name: 'Apply Padding' })).toBeDisabled();
      } else {
        for (const name of ['Frequency Analysis', 'Padding Oracle', 'Timing Attack']) { await page.getByRole('button', { name, exact: true }).first().click(); await pauseAndFinish(page); }
      }
      await capture(page, slug, 'variants', width);
    }
  });

  test(`hash playground, avalanche and cost benchmark at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hashing');
    await page.getByRole('textbox', { name: 'Avalanche message' }).fill('Hello');
    await page.getByRole('button', { name: 'Demonstrate' }).click();
    await expect(page.getByText(/Average bits changed:/)).toBeVisible();
    await page.getByRole('textbox', { name: 'Playground message' }).fill('Hello');
    await page.getByRole('button', { name: 'Compare', exact: true }).click();
    await page.getByRole('textbox', { name: 'Comparison message' }).fill('hello');
    for (const mode of ['Hex', 'Binary', 'Blocks']) await page.getByRole('button', { name: mode, exact: true }).click();
    await capture(page, 'hashing', 'playground', width);
    await page.goto('/password-hashing');
    await page.getByRole('slider', { name: /Cost Factor:/ }).fill('8');
    await page.getByRole('button', { name: 'Hash Password', exact: true }).click();
    await pauseAndFinish(page);
    await page.getByRole('button', { name: 'Benchmark', exact: true }).click();
    await expect(page.getByText('10,000x', { exact: true })).toBeVisible();
    await capture(page, 'password-hashing', 'cost-benchmark', width);
  });

  test(`comparison selection, synchronized and independent playback at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/compare');
    const left = page.getByRole('region', { name: 'left experiment', exact: true });
    const right = page.getByRole('region', { name: 'right experiment', exact: true });
    await left.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(left.getByRole('status')).toContainText('Step 2');
    await expect(right.getByRole('status')).toContainText('Step 2');
    await page.getByRole('button', { name: 'Sync On', exact: true }).click();
    await left.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(left.getByRole('status')).toContainText('Step 3');
    await expect(right.getByRole('status')).toContainText('Step 2');
    await left.getByRole('button', { name: 'Play', exact: true }).click();
    await expect(left.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
    await left.getByRole('button', { name: 'Pause', exact: true }).click();
    await left.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(left.getByRole('status')).toContainText('Step 1');
    await page.getByRole('button', { name: 'Hashing', exact: true }).first().click();
    await expect(left.getByRole('status')).toContainText('Step 1');
    for (const name of ['Signatures', 'Diffie-Hellman', 'Block Modes', 'AES']) { await page.getByRole('button', { name, exact: true }).first().click(); await expect(left.getByRole('status')).toContainText('Step 1'); }
    await page.getByRole('button', { name: 'Hashing', exact: true }).last().click();
    await page.getByRole('button', { name: 'RSA', exact: true }).first().click();
    await expect(left.getByRole('status')).toContainText('Step 1');
    await capture(page, 'compare', 'independent', width);
  });
}
