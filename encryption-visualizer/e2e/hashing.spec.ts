import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

test.describe('Hashing Visualization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
    await nav.locator('summary').click();
    await nav.getByRole('link', { name: 'Hash Functions', exact: true }).click();
  });

  test('should display hash input panel', async ({ page }) => {
    // Check for input field
    await expect(page.getByRole('textbox', { name: /Enter text to hash/i })).toBeVisible();

    // Check for hash button
    await expect(page.getByRole('button', { name: /Hash It/i })).toBeVisible();
  });

  test('should compute hash when button clicked', async ({ page }) => {
    // Click hash button
    await page.getByRole('button', { name: /Hash It/i }).click();

    // Wait for step visualization
    await expect(page.getByText(/Step 1 of/i)).toBeVisible({ timeout: 5000 });
  });

  test('should have avalanche effect demo', async ({ page }) => {
    // Look for avalanche effect section
    await expect(page.getByText(/Avalanche Effect/i).first()).toBeVisible();
  });

  test('should display educational content', async ({ page }) => {
    // Check for educational cards
    await expect(page.getByText(/What is Hashing/i)).toBeVisible();
    await expect(page.getByText(/Key Properties/i)).toBeVisible();
    await expect(page.getByText(/Common Mistakes/i)).toBeVisible();
  });

  test('should have quiz section', async ({ page }) => {
    // Check for quiz
    await expect(page.locator('#lesson-quiz').getByRole('heading', { name: /Knowledge Check/i })).toBeVisible();
  });
});

for (const width of [1440, 390]) {
  test(`SHA-256 trace, empty input, multi-block messages and byte limits at ${width}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/hashing');
    const input = page.getByRole('textbox', { name: /Enter text to hash/i });
    const jump = page.getByRole('combobox', { name: 'Jump to step', exact: true });
    await input.fill('abc');
    await page.getByRole('button', { name: 'Hash It!', exact: true }).click();
    await jump.selectOption('5');
    await expect(page.getByRole('heading', { name: 'Block 1: Round 1', exact: true })).toBeVisible();
    await expect(page.getByText('5d6aebcd', { exact: true })).toBeVisible();
    await expect(page.getByText('54da50e8', { exact: true })).toBeVisible();
    await jump.selectOption('70');
    await expect(page.getByText('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next step', exact: true })).toBeDisabled();
    for (const message of ['', '😀'.repeat(16)]) {
      await input.fill(message);
      await page.getByRole('button', { name: 'Hash It!', exact: true }).click();
      const count = await jump.locator('option').count();
      expect(count).toBe(message ? 137 : 71);
      await jump.selectOption(String(count - 1));
      const trace = page.getByRole('region', { name: 'Hash computation state' });
      await expect(trace.getByText(createHash('sha256').update(message).digest('hex'), { exact: true })).toBeVisible();
    }
    await input.fill('😀'.repeat(257));
    await page.getByRole('button', { name: 'Hash It!', exact: true }).click();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#hash-input-error')).toContainText('1024 UTF-8 bytes');
    await expect(jump.locator('option')).toHaveCount(137);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('SHA-256 playground compares 256 bits and recovers from clipboard denial', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new DOMException('Clipboard denied', 'NotAllowedError'); },
    } });
  });
  await page.goto('/hashing');
  await page.getByRole('button', { name: 'Hex', exact: true }).click();
  await expect(page.getByText(createHash('sha256').update('').digest('hex'), { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Playground message', exact: true }).fill('abc');
  await expect(page.getByText(createHash('sha256').update('abc').digest('hex'), { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Compare', exact: true }).click();
  await page.getByRole('textbox', { name: 'Comparison message', exact: true }).fill('abc');
  await expect(page.getByText('256/256', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy hash', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: /copy/i })).toBeVisible();
  await page.getByRole('textbox', { name: 'Playground message', exact: true }).fill('abd');
  await expect(page.getByText(createHash('sha256').update('abd').digest('hex'), { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
