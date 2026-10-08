import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load homepage and show navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/encryption/i);
    const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
    await nav.locator('summary').click();
    for (const label of ['AES Encryption', 'RSA Encryption', 'Hash Functions', 'Glossary']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  });

  for (const [label, heading] of [
    ['AES Encryption', 'AES Encryption Visualizer'],
    ['RSA Encryption', 'RSA Encryption Visualizer'],
    ['Hash Functions', 'Hash Functions Visualizer'],
    ['Glossary', 'Crypto Glossary'],
  ]) {
    test(`should navigate to ${label}`, async ({ page }) => {
      await page.goto('/');
      const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
      if (label !== 'Glossary') await nav.locator('summary').click();
      await nav.getByRole('link', { name: label, exact: true }).click();
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    });
  }

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('radio', { name: 'Dark mode' })).toBeChecked();
    await page.getByRole('radio', { name: 'Light mode' }).click();
    await expect(page.getByRole('radio', { name: 'Light mode' })).toBeChecked();
  });
});
