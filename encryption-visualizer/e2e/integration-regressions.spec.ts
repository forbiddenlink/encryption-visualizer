import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`blocked browser storage keeps lessons and theme controls usable at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get: () => { throw new DOMException('Storage is blocked', 'SecurityError'); },
      });
    });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Start with AES', exact: true })).toBeVisible();
    const themes = page.getByRole('radiogroup', { name: 'Theme selection' }).filter({ visible: true });
    await themes.getByRole('radio', { name: 'Light mode' }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('beforeinstallprompt', { cancelable: true }));
    });
    await page.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Install', exact: true })).toHaveCount(0);
    await page.getByRole('link', { name: 'Start with AES', exact: true }).click();
    await page.getByRole('button', { name: 'Start Encryption Visualization', exact: true }).click();
    await expect(page.getByText(/^Step 1 of \d+$/)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`navigation and theme keyboard recovery at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/aes');
    await expect(page.getByRole('heading', { name: 'AES Encryption Visualizer', exact: true })).toBeVisible();
    if (width === 390) {
      await page.getByLabel('Open navigation menu').click();
      await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'AES Encryption', exact: true }).click();
      await expect(page.locator('details.mobile-menu')).not.toHaveAttribute('open');
    } else {
      await page.getByText('Explore topics', { exact: true }).click();
      await page.getByRole('link', { name: 'View the complete library' }).click();
      await expect(page).toHaveURL(/\/#topics$/);
      await expect(page.locator('#topics')).toBeInViewport();
      await expect.poll(async () => page.locator('#topics').evaluate((element) => {
        const header = document.querySelector('header.site-header')!;
        return Math.abs(element.getBoundingClientRect().top - header.getBoundingClientRect().bottom - 16);
      })).toBeLessThan(20);
      await expect(page.locator('details.explore-menu')).not.toHaveAttribute('open');
    }
    const radios = page.getByRole('radiogroup', { name: 'Theme selection' }).filter({ visible: true });
    const dark = radios.getByRole('radio', { name: 'Dark mode' });
    await dark.click();
    await dark.press('ArrowRight');
    await expect(radios.getByRole('radio', { name: 'System theme' })).toBeFocused();
    await radios.getByRole('radio', { name: 'System theme' }).press('ArrowDown');
    await expect(radios.getByRole('radio', { name: 'Light mode' })).toBeChecked();
  });

  test(`native install dismissal consumes the visible action at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => {
      const prompt = new Event('beforeinstallprompt', { cancelable: true });
      Object.assign(prompt, { prompt: async () => undefined, userChoice: Promise.resolve({ outcome: 'dismissed' }) });
      window.dispatchEvent(prompt);
    });
    await page.getByRole('button', { name: 'Install', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Install', exact: true })).toHaveCount(0);
  });

  test(`rejected lesson download retains navigation and reload recovery at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route('**/src/pages/AboutPage.tsx*', (route) => route.abort());
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'About', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'This lesson could not load' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'CryptoViz home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return home', exact: true })).toBeVisible();
    await page.unroute('**/src/pages/AboutPage.tsx*');
    await page.getByRole('button', { name: 'Reload lesson' }).click();
    await expect(page.getByRole('heading', { name: 'About CryptoViz', exact: true })).toBeVisible();
  });
}
